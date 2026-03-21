import {
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '../api/client/ApiTypes.js';

type TimelineArticle = {
  id: string;
  strength: StrengthSlug;
  chapter: ArticleChapter;
  ageGroup: AgeGroup;
};

type ReadArticle = {
  article: string;
  completionDate: string;
};

export type ArticleSelection = {
  ageGroup: AgeGroup;
  strength: StrengthSlug;
  chapter: ArticleChapter;
};

export type CompletedArticles = {
  strength: StrengthSlug;
  articles: Record<
    ArticleChapter,
    {id: string; status: 'read' | 'next' | 'unread'}
  >;
};

const strengthOrder: StrengthSlug[] = [
  'kindness',
  'selfRegulation',
  'perseverance',
  'teamwork',
  'creativity',
  'curiosity',
  'socialIntelligence',
  'hope',
  'fairness',
  'courage',
  'humour',
  'compassion',
  'enthusiasm',
  'gratitude',
  'honesty',
  'forgiveness',
  'leadership',
  'love',
  'loveOfLearning',
  'loveOfBeauty',
  'perspective',
  'judgement',
  'modesty',
  'grit',
  'spirituality',
  'carefulness',
] as const;

const ageGroupOrder: AgeGroup[] = [
  'preschool',
  '7-8',
  '9-10',
  '11-12',
  '13-15',
] as const;

const chapterOrder: ArticleChapter[] = [
  'start',
  'speak',
  'act',
  'assess',
] as const;

export function getCompletedArticles(
  articles: TimelineArticle[],
  readArticles: ReadArticle[],
  ageGroup: AgeGroup,
): CompletedArticles[] {
  const readSet = new Set(readArticles.map((r) => r.article));
  const filtered = articles.filter((a) => a.ageGroup === ageGroup);
  const result: CompletedArticles[] = [];

  for (const strength of strengthOrder) {
    const articlesFor = filtered.filter((a) => a.strength === strength);
    if (articlesFor.length === 0) continue;

    const articlesRecord: Record<
      ArticleChapter,
      {id: string; status: 'read' | 'next' | 'unread'}
    > = {
      start: {id: '', status: 'unread'},
      speak: {id: '', status: 'unread'},
      act: {id: '', status: 'unread'},
      assess: {id: '', status: 'unread'},
    };

    for (const chapter of chapterOrder) {
      const article = articlesFor.find((a) => a.chapter === chapter);
      if (article) {
        articlesRecord[chapter] = {
          id: article.id,
          status: readSet.has(article.id) ? 'read' : 'unread',
        };
      }
    }

    result.push({strength, articles: articlesRecord});
  }

  return result;
}

export function getDefaultSelection(
  articles: TimelineArticle[],
  readArticles: ReadArticle[],
  defaultAgeGroup: AgeGroup,
): ArticleSelection {
  const readSet = new Set(readArticles.map((r) => r.article));

  // 0. Only look at reads in the default age-group
  const groupReads = readArticles.filter(
    (r) =>
      articles.find((a) => a.id === r.article)?.ageGroup === defaultAgeGroup,
  );

  // 1. Pick lastStrength: most recent in-group read, or first if none
  const lastStrength: StrengthSlug =
    groupReads.length > 0
      ? (() => {
          const lastRead = [...groupReads].sort(
            (a, b) =>
              new Date(b.completionDate).getTime() -
              new Date(a.completionDate).getTime(),
          )[0];
          return articles.find((a) => a.id === lastRead.article)!.strength;
        })()
      : strengthOrder[0];

  const ageGroup = defaultAgeGroup;

  // 2. Finish off the current strength
  const currentStrengthArticles = articles.filter(
    (a) => a.ageGroup === ageGroup && a.strength === lastStrength,
  );
  for (const chap of chapterOrder) {
    const art = currentStrengthArticles.find((a) => a.chapter === chap);
    if (art && !readSet.has(art.id)) {
      return {ageGroup, strength: lastStrength, chapter: chap};
    }
  }

  // 3. Fill in any partially-completed strengths (excluding current)
  for (const strength of strengthOrder) {
    if (strength === lastStrength) continue;
    const strengthArticles = articles.filter(
      (a) => a.ageGroup === ageGroup && a.strength === strength,
    );
    if (strengthArticles.length === 0) continue;
    const readCount = strengthArticles.filter((a) => readSet.has(a.id)).length;
    if (readCount > 0 && readCount < strengthArticles.length) {
      for (const chap of chapterOrder) {
        const art = strengthArticles.find((a) => a.chapter === chap);
        if (art && !readSet.has(art.id)) {
          return {ageGroup, strength, chapter: chap};
        }
      }
    }
  }

  // 4. Start the next completely unstarted strength
  for (const strength of strengthOrder) {
    if (strength === lastStrength) continue;
    const strengthArticles = articles.filter(
      (a) => a.ageGroup === ageGroup && a.strength === strength,
    );
    if (strengthArticles.length === 0) continue;
    const readCount = strengthArticles.filter((a) => readSet.has(a.id)).length;
    if (readCount === 0) {
      const firstChap = chapterOrder.find((chap) =>
        strengthArticles.some((a) => a.chapter === chap),
      )!;
      return {ageGroup, strength, chapter: firstChap};
    }
  }

  // 5. Advance to next age-group if current is fully complete
  const strengthsInAge = strengthOrder.filter((s) =>
    articles.some((a) => a.ageGroup === ageGroup && a.strength === s),
  );
  const allCompleted = strengthsInAge.every((s) => {
    const arts = articles.filter(
      (a) => a.ageGroup === ageGroup && a.strength === s,
    );
    return arts.length > 0 && arts.every((a) => readSet.has(a.id));
  });
  if (allCompleted) {
    const currentIndex = ageGroupOrder.indexOf(ageGroup);
    const nextAgeGroup = ageGroupOrder[currentIndex + 1];
    if (nextAgeGroup) {
      const nextStrength = strengthOrder.find((s) =>
        articles.some((a) => a.ageGroup === nextAgeGroup && a.strength === s),
      )!;
      const nextChap = chapterOrder.find((chap) =>
        articles.some(
          (a) =>
            a.ageGroup === nextAgeGroup &&
            a.strength === nextStrength &&
            a.chapter === chap,
        ),
      )!;
      return {
        ageGroup: nextAgeGroup,
        strength: nextStrength,
        chapter: nextChap,
      };
    }
  }

  // 6. Fallback: first of defaultAgeGroup
  return {
    ageGroup: defaultAgeGroup,
    strength: strengthOrder[0],
    chapter: chapterOrder[0],
  };
}

export function getCurrentChapters(
  articles: TimelineArticle[],
  readArticles: ReadArticle[],
  selection: ArticleSelection,
): Record<
  ArticleChapter,
  {
    id: string;
    status: 'read' | 'next' | 'unread';
  }
> {
  const map: Record<
    ArticleChapter,
    {id: string; status: 'read' | 'next' | 'unread'}
  > = {
    start: {id: '', status: 'unread'},
    speak: {id: '', status: 'unread'},
    act: {id: '', status: 'unread'},
    assess: {id: '', status: 'unread'},
  };

  const {ageGroup, strength} = selection;

  const readSet = new Set(readArticles.map((r) => r.article));
  const available: Partial<Record<ArticleChapter, TimelineArticle>> = {};
  for (const chap of chapterOrder) {
    const art = articles.find(
      (a) =>
        a.ageGroup === ageGroup &&
        a.strength === strength &&
        a.chapter === chap,
    );
    if (art) available[chap] = art;
  }

  let nextChapter: ArticleChapter | undefined;
  for (const chap of chapterOrder) {
    const art = available[chap];
    if (art && !readSet.has(art.id)) {
      nextChapter = chap;
      break;
    }
  }

  for (const chap of chapterOrder) {
    const art = available[chap];
    if (!art) continue;
    let status: 'read' | 'next' | 'unread' = 'unread';
    if (readSet.has(art.id)) {
      status = 'read';
    } else if (nextChapter === chap) {
      status = 'next';
    }

    map[chap] = {id: art.id, status};
  }

  return map;
}
