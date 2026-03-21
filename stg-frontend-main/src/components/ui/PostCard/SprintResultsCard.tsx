import PostInteractions from './PostInteractions';
import SprintResultsHeader from './SprintResultsHeader';
import SprintResultsContent from './SprintResultsContent';
import {
  type UserInfo,
  type Comment,
  type Reaction,
  type StrengthSlug,
} from '@/api/ApiTypes';

type Props = {
  readonly sprintResultId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly strengths: Array<{strength: StrengthSlug; count: number}>;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function SprintResultsCard(props: Props) {
  const {
    sprintResultId,
    createdBy,
    createdAt,
    strengths,
    comments,
    reactions,
    onDelete,
    onClose,
  } = props;

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <SprintResultsHeader
        sprintresultId={sprintResultId}
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
