import {
  type AgeGroup,
  type ArticleChapter,
  type StrengthSlug,
} from '../../api/client/ApiTypes.js';

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

const chapterOrder: ArticleChapter[] = [
  'start',
  'speak',
  'act',
  'assess',
] as const;

type AgeStrengthKey = `${AgeGroup}:${StrengthSlug}`;

/**
 * Calculate the number of diplomas (fully completed strengths) across all age groups.
 * A diploma is earned when all 4 chapters of a strength are completed within an age group.
 * The same strength completed in different age groups counts as multiple diplomas.
 *
 * @param articles - All timeline articles
 * @param readArticles - Articles that have been read/completed by the group
 * @returns The number of completed diplomas (strengths with all 4 chapters done per age group)
 */
export function calculateDiplomaCount(
  articles: TimelineArticle[],
  readArticles: ReadArticle[],
): number {
  const readSet = new Set(readArticles.map((r) => r.article));

  // Group articles by (ageGroup, strength) pair
  const articlesByAgeAndStrength = new Map<AgeStrengthKey, TimelineArticle[]>();
  for (const article of articles) {
    const key: AgeStrengthKey = `${article.ageGroup}:${article.strength}`;
    const existing = articlesByAgeAndStrength.get(key) ?? [];
    existing.push(article);
    articlesByAgeAndStrength.set(key, existing);
  }

  let diplomaCount = 0;

  for (const [, strengthArticles] of articlesByAgeAndStrength) {
    // Check if all 4 chapters are present and completed
    const hasAllChaptersCompleted = chapterOrder.every((chapter) => {
      const chapterArticle = strengthArticles.find(
        (a) => a.chapter === chapter,
      );
      return chapterArticle && readSet.has(chapterArticle.id);
    });

    if (hasAllChaptersCompleted) {
      diplomaCount++;
    }
  }

  return diplomaCount;
}

export type CompletedDiploma = {
  strength: StrengthSlug;
  ageGroup: AgeGroup;
  completionDate: Date;
};

/**
 * Get all completed diplomas with their completion dates.
 * A diploma is completed when all 4 chapters of a strength are done within an age group.
 * The completion date is the date of the final (4th) chapter completion.
 *
 * @param articles - All timeline articles
 * @param readArticles - Articles that have been read/completed by the group
 * @returns Array of completed diplomas with strength and completion date
 */
export function getCompletedDiplomas(
  articles: TimelineArticle[],
  readArticles: ReadArticle[],
): CompletedDiploma[] {
  const readMap = new Map(
    readArticles.map((r) => [r.article, new Date(r.completionDate)]),
  );

  // Group articles by (ageGroup, strength) pair
  const articlesByAgeAndStrength = new Map<AgeStrengthKey, TimelineArticle[]>();
  for (const article of articles) {
    const key: AgeStrengthKey = `${article.ageGroup}:${article.strength}`;
    const existing = articlesByAgeAndStrength.get(key) ?? [];
    existing.push(article);
    articlesByAgeAndStrength.set(key, existing);
  }

  const completedDiplomas: CompletedDiploma[] = [];

  for (const [, strengthArticles] of articlesByAgeAndStrength) {
    // Check if all 4 chapters are present and completed, collect completion dates
    const chapterCompletions: Date[] = [];

    const allCompleted = chapterOrder.every((chapter) => {
      const chapterArticle = strengthArticles.find(
        (a) => a.chapter === chapter,
      );
      if (!chapterArticle) return false;

      const completionDate = readMap.get(chapterArticle.id);
      if (!completionDate) return false;

      chapterCompletions.push(completionDate);
      return true;
    });

    if (allCompleted && chapterCompletions.length === 4) {
      // Diploma completion date is the latest chapter completion
      const diplomaDate = new Date(
        Math.max(...chapterCompletions.map((d) => d.getTime())),
      );
      const firstArticle = strengthArticles[0];
      completedDiplomas.push({
        strength: firstArticle.strength,
        ageGroup: firstArticle.ageGroup,
        completionDate: diplomaDate,
      });
    }
  }

  return completedDiplomas;
}
