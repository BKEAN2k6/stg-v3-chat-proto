import {
  type UserInfo,
  type Comment,
  type Reaction,
  type StrengthSlug,
  type Group,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import UserPostHeader from './UserPostHeader.js';
import StrengthCompletedContent from './StrengthCompletedContent.js';

type Properties = {
  readonly postId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly strength: StrengthSlug;
  group: Group;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (postId: string) => void;
  readonly onClose?: () => void;
};

export default function StrengthCompletedCard(properties: Properties) {
  const {
    postId,
    createdBy,
    createdAt,
    strength,
    group,
    comments,
    reactions,
    onDelete,
    onClose,
  } = properties;

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <UserPostHeader
        postId={postId}
        createdBy={createdBy}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <StrengthCompletedContent
        strength={strength}
        group={group}
        date={createdAt}
      />
      <PostInteractions
        postId={postId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
