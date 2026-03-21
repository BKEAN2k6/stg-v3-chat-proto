export const TimelineArticle = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    strength: {$ref: '#/definitions/StrengthSlug'},
    chapter: {$ref: '#/definitions/ArticleChapter'},
    ageGroup: {$ref: '#/definitions/AgeGroup'},
  },
  required: ['id', 'strength', 'chapter', 'ageGroup'],
} as const;
