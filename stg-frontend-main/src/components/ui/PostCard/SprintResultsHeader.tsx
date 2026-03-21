import PostTools from './PostTools';
import PostCreator from './PostCreator';
import {type UserInfo} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';

type Props = {
  readonly sprintresultId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function SprintResultsHeader(props: Props) {
  const {sprintresultId, createdBy, createdAt, onDelete, onClose} = props;

  const {currentUser} = useCurrentUser();

  const isDeleteAllowed =
    currentUser?._id === createdBy._id ||
    currentUser?.roles.includes('super-admin') || // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    currentUser?.communities.find(
      (c) => c._id === currentUser.selectedCommunity,
    )?.role === 'admin';

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator createdBy={createdBy} createdAt={createdAt} />

      <PostTools
        postId={sprintresultId}
        isDeleteAllowed={isDeleteAllowed}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
