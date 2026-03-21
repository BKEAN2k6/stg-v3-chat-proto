import {
  type ArticleChapter,
  type AgeGroup,
  type StrengthSlug,
} from '@client/ApiTypes';
import {ageGroups, articleChapters} from '@/helpers/article.js';

type StrengthEntry = {
  id: string;
  strength: StrengthSlug;
  slides: Record<AgeGroup, Record<ArticleChapter, string>>;
};

type CompletionEntry = {
  article: string;
  completionDate: string;
};

type ArticleStatus = {
  id: string;
  status: 'read' | 'next' | 'unread';
};

export type CurrentArticles = {
  ageGroup: AgeGroup;
  strength: StrengthSlug;
  articles: Record<ArticleChapter, ArticleStatus>;
};

export type Selection = {
  ageGroup: AgeGroup;
  strength: StrengthSlug;
};

export type CompletionStatusByAgeGroup = Record<
  AgeGroup,
  Array<{
    strength: StrengthSlug;
    articles: Array<{
      articleId: string;
      type: ArticleChapter;
      completed: boolean;
    }>;
  }>
>;

export function getNextSelection(
  strengths: StrengthEntry[],
  completions: CompletionEntry[],
): Selection | undefined {
  // 1) No completions yet → first strength, preschool
  if (completions.length === 0) {
    const first = strengths[0];
    if (!first) return undefined;
    return {ageGroup: 'preschool', strength: first.strength};
  }

  // 2) Build set of read IDs and find the latest completion
  const readSet = new Set(completions.map((c) => c.article));
  let last = completions[0];
  for (const current of completions) {
    if (new Date(current.completionDate) > new Date(last.completionDate)) {
      last = current;
    }
  }

  const lastReadId = last.article;

  // 3) Locate its strength index and ageGroup
  let foundIndex = -1;
  let foundAge: AgeGroup | undefined;
  for (const [i, strength] of strengths.entries()) {
    for (const ag of ageGroups) {
      if (Object.values(strength.slides[ag]).includes(lastReadId)) {
        foundIndex = i;
        foundAge = ag;
        break;
      }
    }

    if (foundIndex !== -1) break;
  }

  if (foundIndex < 0 || !foundAge) return undefined;

  const currentSlides = strengths[foundIndex].slides[foundAge];
  const allIds = Object.values(currentSlides);
  const isComplete = allIds.every((id) => readSet.has(id));

  // 4) If not fully read → stay here
  if (!isComplete) {
    return {ageGroup: foundAge, strength: strengths[foundIndex].strength};
  }

  // 5) Scan from the first strength and return the first one that’s not fully read
  const partials = strengths
    .map((entry, index) => {
      const ids = Object.values(entry.slides[foundAge]);
      const readIds = ids.filter((id) => readSet.has(id));
      if (readIds.length === 0 || readIds.length === ids.length) {
        return null;
      }

      // find latest completionDate for this slice
      const latestTs = Math.max(
        ...completions
          .filter((c) => ids.includes(c.article))
          .map((c) => new Date(c.completionDate).getTime()),
      );
      return {idx: index, latestTs};
    })
    .filter((x): x is {idx: number; latestTs: number} => x !== null);

  if (partials.length > 0) {
    // pick the one whose last read is most recent
    let best = partials[0];
    for (const item of partials) {
      if (item.latestTs > best.latestTs) {
        best = item;
      }
    }

    return {
      ageGroup: foundAge,
      strength: strengths[best.idx].strength,
    };
  }

  // 6) No partials → pick the first completely unread strength
  for (const strength of strengths) {
    const ids = Object.values(strength.slides[foundAge]);
    if (!ids.every((id) => readSet.has(id))) {
      // at least one unread here, and since no partials exist,
      // this is fully unread
      return {
        ageGroup: foundAge,
        strength: strength.strength,
      };
    }
  }

  // 7) Fallback: advance to next strength after the one we just finished
  const nextIndex = foundIndex + 1;
  if (nextIndex >= strengths.length) return undefined;
  return {
    ageGroup: foundAge,
    strength: strengths[nextIndex].strength,
  };
}

export function getCurrentArticlesForSelection(
  strengths: StrengthEntry[],
  completions: CompletionEntry[],
  selection: Selection,
): CurrentArticles | undefined {
  const {ageGroup, strength} = selection;
  const entry = strengths.find((s) => s.strength === strength);
  if (!entry) return undefined;

  const slideMap = entry.slides[ageGroup];
  if (!slideMap) return undefined;

  const readSet = new Set(completions.map((c) => c.article));

  function makeStatuses(
    slides: Record<ArticleChapter, string>,
    read: Set<string>,
  ) {
    const order: Array<keyof typeof slides> = articleChapters;
    const firstUnread = order.findIndex((k) => !read.has(slides[k]));
    const result: Record<string, ArticleStatus> = {};
    for (const [i, key] of order.entries()) {
      const id = slides[key];
      const status = read.has(id)
        ? 'read'
        : i === firstUnread
          ? 'next'
          : 'unread';
      result[key] = {id, status};
    }

    return result;
  }

  return {
    ageGroup,
    strength,
    articles: makeStatuses(slideMap, readSet),
  };
}

export function getCompletionStatusByAgeGroup(
  strengths: StrengthEntry[],
  completions: CompletionEntry[],
): CompletionStatusByAgeGroup {
  const readSet = new Set(completions.map((c) => c.article));

  const result: CompletionStatusByAgeGroup = {
    preschool: [],
    '7-8': [],
    '9-10': [],
    '11-12': [],
    '13-15': [],
  };

  for (const ag of ageGroups) {
    const list = strengths.map((entry) => {
      const slides = entry.slides[ag];
      const articles = (
        Object.entries(slides) as Array<[ArticleChapter, string]>
      ).map(([type, articleId]) => ({
        articleId,
        type,
        completed: readSet.has(articleId),
      }));
      return {
        strength: entry.strength,
        articles,
      };
    });
    result[ag] = list;
  }

  return result;
}
