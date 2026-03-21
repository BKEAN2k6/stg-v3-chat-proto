import fm from 'front-matter';

const validateArticle = ({
  category,
  length,
  thumbnail,
  translations,
  order,
}: {
  category: string;
  length: string;
  thumbnail: string;
  translations: Array<{
    title: string;
    description: string;
    content: string[];
  }>;
  order: number;
}): string[] => {
  const errors = [];

  if (!category) {
    errors.push('Article must have a category.');
  }

  if (length === undefined || length === '') {
    errors.push('Article must have a length.');
  }

  if (translations.length === 0) {
    errors.push('Article must have at least one translation.');
  }

  if (thumbnail === undefined || thumbnail === '') {
    errors.push('Article must have a thumbnail.');
  }

  if (order === undefined || order === null || Number.isNaN(order)) {
    errors.push('Article must have an order.');
  }

  for (const translation of translations) {
    const {title, description, content} = translation;
    if (title === undefined || title === '') {
      errors.push('Article translation must have a title.');
    }

    if (description === undefined || description === '') {
      errors.push('Article translation must have a description.');
    }

    if (content === undefined || content.length === 0 || content.includes('')) {
      errors.push('Article translation or section can not be empty.');
    }

    for (const [i, element] of content.entries()) {
      try {
        fm(element);
      } catch {
        errors.push(
          `Article translation section ${i + 1} is invalid. Check syntax between '---'`,
        );
      }
    }
  }

  return errors;
};

export default validateArticle;
