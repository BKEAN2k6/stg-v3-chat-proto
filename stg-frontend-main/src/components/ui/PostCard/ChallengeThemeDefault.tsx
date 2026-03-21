import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';
import ConfettiExplosion from 'react-confetti-explosion';
import ChallengeParticipants from './ChallengeParticipants';
import {type UserInfo} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';
import {MarkdownView} from '@/components/ui/MarkdownView';

type Props = {
  readonly participants: UserInfo[];
  readonly content: string;
  readonly isExploding: boolean;
  readonly onExplosionComplete: () => void;
  readonly handleAcceptChallenge: () => void;
};

export default function ChallengeThemeDefault(props: Props) {
  const {
    participants,
    content,
    isExploding,
    handleAcceptChallenge,
    onExplosionComplete,
  } = props;
  const {currentUser} = useCurrentUser();

  const challengeAccepted = participants.some(
    (acceptance) => acceptance._id === currentUser?._id,
  );

  if (!currentUser) {
    return null;
  }

  const memberCount =
    currentUser.communities.find(
      (community) => community._id === currentUser.selectedCommunity,
    )?.memberCount ?? 0;

  return (
    <div
      style={{
        backgroundColor: '#7754c9',
        width: '100%',
        aspectRatio: '2/1',
      }}
      // Can't use gap here because of the confetti explosion. Elements inside the div need to be spaced with margin.
      className="d-flex flex-column justify-content-center align-items-center border rounded text-center p-3"
    >
      {challengeAccepted && (
        <img
          src="/images/challenges/kaisa-thumb-up.png"
          alt="Kaisa"
          style={{maxWidth: '100%', maxHeight: '100px'}}
          className="mb-3"
        />
      )}
      <div className="text-light text-break w-100 mb-3">
        <MarkdownView content={content} />
      </div>
      {isExploding && (
        <ConfettiExplosion zIndex={1200} onComplete={onExplosionComplete} />
      )}
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
      {challengeAccepted && (
        <div className="d-flex flex-column justify-content-center align-items-center gap-3">
          <Button disabled variant="light">
            <Trans>Accepted</Trans>
          </Button>
          <ChallengeParticipants participants={participants} />
        </div>
      )}
    </div>
  );
}
