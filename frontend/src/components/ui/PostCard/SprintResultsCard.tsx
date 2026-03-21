import {
  type UserInfo,
  type Comment,
  type Reaction,
  type StrengthSlug,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import UserPostHeader from './UserPostHeader.js';
import SprintResultsContent from './SprintResultsContent.js';

type Properties = {
  readonly sprintResultId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly strengths: Array<{strength: StrengthSlug; count: number}>;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function SprintResultsCard(properties: Properties) {
  const {
    sprintResultId,
    createdBy,
    createdAt,
    strengths,
    comments,
    reactions,
    onDelete,
    onClose,
  } = properties;

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <UserPostHeader
        postId={sprintResultId}
        createdBy={createdBy}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <SprintResultsContent strengths={strengths} />
      <PostInteractions
        postId={sprintResultId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
