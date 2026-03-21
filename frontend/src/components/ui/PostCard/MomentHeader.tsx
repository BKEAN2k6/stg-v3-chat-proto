import {type UserInfo} from '@client/ApiTypes';
import PostCreator from './PostCreator.js';
import PostTools from './PostTools.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type Properties = {
  readonly momentId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly toggleEditing?: () => void;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function MomentHeader(properties: Properties) {
  const {momentId, createdBy, createdAt, toggleEditing, onDelete, onClose} =
    properties;

  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const userCommunityRole =
    currentUser.communities.find((c) => c.id === currentUser.selectedCommunity)
      ?.role ?? '';

  const canEditOrRemove =
    currentUser.id === createdBy.id ||
    currentUser.roles.includes('super-admin') ||
    ['admin', 'owner'].includes(userCommunityRole);

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
