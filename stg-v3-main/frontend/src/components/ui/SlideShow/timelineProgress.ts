import {
  type ArticleChapter,
  type ArticleProgressEntry,
  type TimelineArticle,
} from '@client/ApiTypes.js';

export const chapterOrder: ArticleChapter[] = [
  'start',
  'speak',
  'act',
  'assess',
];

export function getCompletedChapters(
  articles: TimelineArticle[],
  reads: ArticleProgressEntry[],
  currentArticleId: string,
): ArticleChapter[] {
  const articleById = new Map<string, TimelineArticle>();
  for (const article of articles) {
    articleById.set(article.id, article);
  }

  const current = articleById.get(currentArticleId);
  if (!current) return [];

  const {strength, ageGroup} = current;

  const completedChapters = new Set<ArticleChapter>();

  for (const read of reads) {
    const article = articleById.get(read.article);
    if (!article) continue;
    if (article.strength === strength && article.ageGroup === ageGroup) {
      completedChapters.add(article.chapter);
    }
  }

  return [...completedChapters];
}
