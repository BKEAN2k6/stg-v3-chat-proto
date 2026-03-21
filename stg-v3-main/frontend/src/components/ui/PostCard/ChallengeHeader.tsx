import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {type ChallengeTheme} from '@client/ApiTypes';
import PostCreator from './PostCreator.js';
import PostTools from './PostTools.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type Properties = {
  readonly challengeId: string;
  readonly theme: ChallengeTheme;
  readonly createdAt: string;
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function ChallengeHeader(properties: Properties) {
  const {challengeId, createdAt, theme, onDelete, onClose} = properties;
  const {_} = useLingui();
  const {currentUser} = useCurrentUser();

  if (!currentUser) {
    return null;
  }

  const userCommunityRole =
    currentUser.communities.find((c) => c.id === currentUser.selectedCommunity)
      ?.role ?? '';

  const isDeleteAllowed =
    currentUser?.roles.includes('super-admin') ||
    ['admin', 'owner'].includes(userCommunityRole);

  const aliases: Record<ChallengeTheme, string> = {
    default: 'coach-kaisa',
    'holiday-calendar': 'holiday-kaisa',
  };

  return (
    <div className="d-flex justify-content-between align-items-center">
      <PostCreator
        createdBy={{
          id: aliases[theme],
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
