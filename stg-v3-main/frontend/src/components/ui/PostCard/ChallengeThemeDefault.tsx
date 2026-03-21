import {Trans} from '@lingui/react/macro';
import {Button} from 'react-bootstrap';
import {type UserInfo} from '@client/ApiTypes';
import ConfettiExplosion from '../ConfettiExplosion/index.js';
import ChallengeParticipants from './ChallengeParticipants.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';

type Properties = {
  readonly participants: UserInfo[];
  readonly content: string;
  readonly isExploding: boolean;
  readonly onExplosionComplete: () => void;
  readonly handleAcceptChallenge: () => void;
};

export default function ChallengeThemeDefault(properties: Properties) {
  const {
    participants,
    content,
    isExploding,
    handleAcceptChallenge,
    onExplosionComplete,
  } = properties;
  const {currentUser} = useCurrentUser();

  const challengeAccepted = participants.some(
    (acceptance) => acceptance.id === currentUser?.id,
  );

  if (!currentUser) {
    return null;
  }

  const memberCount =
    currentUser.communities.find(
      (community) => community.id === currentUser.selectedCommunity,
    )?.memberCount ?? 0;

  return (
    <div
      style={{
        backgroundColor: '#7754c9',
        width: '100%',
        aspectRatio: '2/1',
      }}
      className="d-flex flex-column justify-content-center align-items-center border rounded text-center p-3"
    >
      {challengeAccepted ? (
        <img
          src="/images/challenges/kaisa-thumb-up.png"
          alt="Kaisa"
          style={{maxWidth: '100%', maxHeight: '100px'}}
          className="mb-3"
        />
      ) : null}
      <div className="text-light text-break w-100 mb-3">
        <MarkdownView content={content} />
      </div>
      {isExploding ? (
        <ConfettiExplosion zIndex={1200} onComplete={onExplosionComplete} />
      ) : null}
      {!challengeAccepted && (
        <div className="d-flex flex-column gap-3">
          <Button variant="light" onClick={handleAcceptChallenge}>
            <Trans>Accept challenge</Trans>
          </Button>
          <span className="text-light font-weight-bold">
            {participants.length} / {memberCount} <Trans>have accepted</Trans>
          </span>
        </div>
      )}
      {challengeAccepted ? (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Button disabled variant="light">
            <Trans>Accepted</Trans>
          </Button>
          <ChallengeParticipants participants={participants} />
        </div>
      ) : null}
    </div>
  );
}
