const validateArticleCategory = ({
  thumbnail,
  translations,
  order,
}: {
  thumbnail: string;
  translations: Array<{
    name: string;
    description: string;
  }>;
  order: number;
}): string[] => {
  const errors = [];

  if (translations.length === 0) {
    errors.push('Article category must have at least one translation.');
  }

  if (thumbnail === undefined || thumbnail === '') {
    errors.push('Article category must have a thumbnail.');
  }

  if (order === undefined || order === null || Number.isNaN(order)) {
    errors.push('Article category must have an order.');
  }

  for (const translation of translations) {
    const {name, description} = translation;
    if (name === undefined || name === '') {
      errors.push('Article category translation must have a name.');
    }

    if (description === undefined || description === '') {
      errors.push('Article category translation must have a description.');
    }
  }

  return errors;
};

export default validateArticleCategory;
