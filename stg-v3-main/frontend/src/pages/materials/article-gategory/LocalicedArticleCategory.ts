import {type StrengthSlug} from '@client/ApiTypes';

type LocalicedArticleCategory = {
  id: string;
  name: string;
  description: string;
  subCategories: LocalicedArticleCategory[];
  thumbnail: string;
  displayAs: 'list' | 'grid';
  articles: Array<{
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    length: string;
    strengths: StrengthSlug[];
    isLocked: boolean;
  }>;
  categoryPath: Array<{id: string; name: string}>;
  isLocked: boolean;
};

export default LocalicedArticleCategory;
