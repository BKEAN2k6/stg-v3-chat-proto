import {useLingui} from '@lingui/react';
import {
  type UserImage,
  type Comment,
  type Reaction,
  type LanguageCode,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import CoachPostHeader from './CoachPostHeader.js';
import CoachPostContent from './CoachPostContent.js';
import StrengthList from '@/components/ui/StrengthList.js';

type Properties = {
  readonly postId: string;
  readonly translations: Record<LanguageCode, string>;
  readonly images: UserImage[];
  readonly strengths: string[];
  readonly createdAt: string;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (postId: string) => void;
  readonly onClose?: () => void;
};

export default function CoachPostCard(properties: Properties) {
  const {i18n} = useLingui();
  const {
    postId: momentId,
    translations,
    images,
    strengths,
    createdAt,
    comments,
    reactions,
    onDelete,
    onClose,
  } = properties;
  const content = translations[i18n.locale as LanguageCode];

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <CoachPostHeader
        momentId={momentId}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <CoachPostContent content={content} images={images} />
      <StrengthList strengths={strengths} />
      <PostInteractions
        postId={momentId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
