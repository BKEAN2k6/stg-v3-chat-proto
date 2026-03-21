import {
  type UserInfo,
  type Comment,
  type Reaction,
  type StrengthSlug,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import UserPostHeader from './UserPostHeader.js';
import GoalCompletedContent from './GoalCompletedContent.js';

type Properties = {
  readonly postId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly strength: StrengthSlug;
  readonly groupName: string;
  readonly completedCount: number;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function GoalCompletedCard(properties: Properties) {
  const {
    postId,
    createdBy,
    createdAt,
    strength,
    completedCount,
    groupName,
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
      <GoalCompletedContent
        strength={strength}
        groupName={groupName}
        completedCount={completedCount}
      />
      <PostInteractions
        postId={postId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
