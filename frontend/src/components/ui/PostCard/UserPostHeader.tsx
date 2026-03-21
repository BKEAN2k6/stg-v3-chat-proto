import {type UserInfo} from '@client/ApiTypes';
import PostTools from './PostTools.js';
import PostCreator from './PostCreator.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type Properties = {
  readonly postId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function OnboardingCompletedHeader(properties: Properties) {
  const {postId, createdBy, createdAt, onDelete, onClose} = properties;

  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const userCommunityRole =
    currentUser.communities.find((c) => c.id === currentUser.selectedCommunity)
      ?.role ?? '';

  const isDeleteAllowed =
    currentUser.id === createdBy.id ||
    currentUser.roles.includes('super-admin') ||
    ['admin', 'owner'].includes(userCommunityRole);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator createdBy={createdBy} createdAt={createdAt} />

      <PostTools
        postId={postId}
        isDeleteAllowed={isDeleteAllowed}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
