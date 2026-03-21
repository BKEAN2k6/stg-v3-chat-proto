import {type StrengthSlug} from '@/api/ApiTypes';

type LocalicedArticleCategory = {
  _id: string;
  name: string;
  description: string;
  subCategories: LocalicedArticleCategory[];
  thumbnail: string;
  displayAs: 'list' | 'grid';
  articles: Array<{
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    length: string;
    strengths: StrengthSlug[];
    isLocked: boolean;
  }>;
  categoryPath: Array<{_id: string; name: string}>;
  isLocked: boolean;
};

export default LocalicedArticleCategory;
