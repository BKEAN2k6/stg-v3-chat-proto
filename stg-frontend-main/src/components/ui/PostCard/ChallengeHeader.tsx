import {useLingui} from '@lingui/react';
import {msg} from '@lingui/macro';
import PostCreator from './PostCreator';
import PostTools from './PostTools';
import {useCurrentUser} from '@/context/currentUserContext';
import {type ChallengeTheme} from '@/api/ApiTypes';

type Props = {
  readonly challengeId: string;
  readonly theme: ChallengeTheme;
  readonly createdAt: string;
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function ChallengeHeader(props: Props) {
  const {challengeId, createdAt, theme, onDelete, onClose} = props;
  const {_} = useLingui();
  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const isDeleteAllowed =
    currentUser?.roles.includes('super-admin') ||
    currentUser?.communities.find(
      (c) => c._id === currentUser.selectedCommunity,
    )?.role === 'admin';

  const aliases: Record<ChallengeTheme, string> = {
    default: 'coach-kaisa',
    'holiday-calendar': 'holiday-kaisa',
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator
        createdBy={{
          _id: aliases[theme],
          firstName: _(msg`Coach`),
          lastName: _(msg`Kaisa`),
          avatar: aliases[theme],
        }}
        createdAt={createdAt}
      />
      <PostTools
        postId={challengeId}
        isDeleteAllowed={isDeleteAllowed}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
