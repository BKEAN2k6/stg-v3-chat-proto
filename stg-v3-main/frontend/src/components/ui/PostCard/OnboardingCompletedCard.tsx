import {type UserInfo, type Comment, type Reaction} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import UserPostHeader from './UserPostHeader.js';
import OnboardingCompletedContent from './OnboardingCompletedContent.js';

type Properties = {
  readonly postId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function OnboardingCompletedCard(properties: Properties) {
  const {postId, createdBy, createdAt, comments, reactions, onDelete, onClose} =
    properties;

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <UserPostHeader
        postId={postId}
        createdBy={createdBy}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <OnboardingCompletedContent createdBy={createdBy} />
      <PostInteractions
        postId={postId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
