import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import PostCreator from './PostCreator.js';
import PostTools from './PostTools.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type Properties = {
  readonly momentId: string;
  readonly createdAt: string;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function CoachPostHeader(properties: Properties) {
  const {momentId, createdAt, onDelete, onClose} = properties;
  const {_} = useLingui();

  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const userCommunityRole =
    currentUser.communities.find((c) => c.id === currentUser.selectedCommunity)
      ?.role ?? '';

  const canEditOrRemove =
    currentUser?.roles.includes('super-admin') ||
    ['admin', 'owner'].includes(userCommunityRole);

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator
        createdBy={{
          id: 'coach-kaisa',
          firstName: _(msg`Coach`),
          lastName: _(msg`Kaisa`),
          avatar: 'coach-kaisa',
        }}
        createdAt={createdAt}
      />
      <PostTools
        postId={momentId}
        isDeleteAllowed={canEditOrRemove}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
