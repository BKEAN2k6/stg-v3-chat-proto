import {useLingui} from '@lingui/react';
import PostInteractions from './PostInteractions';
import CoachPostHeader from './CoachPostHeader';
import CoachPostContent from './CoachPostContent';
import StrengthList from '@/components/ui/StrengthList';
import {type UserImage, type Comment, type Reaction} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';

type Props = {
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

export default function CoachPostCard(props: Props) {
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
  } = props;
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
      <StrengthList className="mb-3" strengths={strengths} />
      <PostInteractions
        postId={momentId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
