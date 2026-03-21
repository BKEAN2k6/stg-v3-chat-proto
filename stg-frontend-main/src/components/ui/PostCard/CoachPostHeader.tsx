import {useLingui} from '@lingui/react';
import {msg} from '@lingui/macro';
import PostCreator from './PostCreator';
import PostTools from './PostTools';
import {useCurrentUser} from '@/context/currentUserContext';

type Props = {
  readonly momentId: string;
  readonly createdAt: string;
  readonly onDelete: (momentId: string) => void;
  readonly onClose?: () => void;
};

export default function CoachPostHeader(props: Props) {
  const {momentId, createdAt, onDelete, onClose} = props;
  const {_} = useLingui();

  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const canEditOrRemove =
    currentUser?.roles.includes('super-admin') ||
    currentUser?.communities.find(
      (c) => c._id === currentUser.selectedCommunity,
    )?.role === 'admin';

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator
        createdBy={{
          _id: 'coach-kaisa',
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
