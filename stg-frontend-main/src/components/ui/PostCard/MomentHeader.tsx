import PostCreator from './PostCreator';
import PostTools from './PostTools';
import {type UserInfo} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';

type Props = {
  readonly momentId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly toggleEditing?: () => void;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function MomentHeader(props: Props) {
  const {momentId, createdBy, createdAt, toggleEditing, onDelete, onClose} =
    props;

  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const canEditOrRemove =
    currentUser?._id === createdBy._id ||
    currentUser?.roles.includes('super-admin') ||
    currentUser?.communities.find(
      (c) => c._id === currentUser.selectedCommunity,
    )?.role === 'admin';

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator createdBy={createdBy} createdAt={createdAt} />
      <PostTools
        postId={momentId}
        toggleEditing={canEditOrRemove ? toggleEditing : undefined}
        isDeleteAllowed={canEditOrRemove}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
