import {Trans} from '@lingui/react/macro';
import {Button} from 'react-bootstrap';
import {useState, useEffect, useRef} from 'react';
import {type UserInfo} from '@client/ApiTypes';
import ConfettiExplosion from '../ConfettiExplosion/index.js';
import ChallengeParticipants from './ChallengeParticipants.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';
import {Flippy, FrontSide, BackSide} from '@/components/ui/Flippy/index.js';
import {usePlayerContext} from '@/context/Video/PlayerProvider.js';

type Properties = {
  readonly participants: UserInfo[];
  readonly day: number;
  readonly content: string;
  readonly handleAcceptChallenge: () => void;
};

export default function ChallengeThemeHolidayCalendar(properties: Properties) {
  const {participants, content, day, handleAcceptChallenge} = properties;
  const {stopAllPlayers} = usePlayerContext();
  const [isExploding, setIsExploding] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const {currentUser} = useCurrentUser();
  const [aspectRatio, setAspectRatio] = useState('16/9');
  const containerReference = useRef(null);

  const challengeAccepted = participants.some(
    (acceptance) => acceptance.id === currentUser?.id,
  );

  useEffect(() => {
    if (!containerReference.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const {width, height} = entry.contentRect;
      setAspectRatio(`${width + 48} / ${height + 48}`);
    });

    observer.observe(containerReference.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  if (!currentUser) {
    return null;
  }

  const memberCount =
    currentUser.communities.find(
      (community) => community.id === currentUser.selectedCommunity,
    )?.memberCount ?? 0;

  const handleOpen = () => {
    if (!challengeAccepted) {
      handleAcceptChallenge();
    }

    setIsZooming(true);
    setIsExploding(true);
    setIsFlipped(true);
  };

  const handleClose = () => {
    setIsZooming(false);
    stopAllPlayers();
    setIsFlipped(false);
  };

  return (
    <Flippy
      flipDirection="horizontal"
      isFlipped={isFlipped}
      style={{
        width: '100%',
        aspectRatio,
      }}
    >
      <FrontSide
        className="d-flex flex-column justify-content-center align-items-center border rounded text-center p-3"
        style={{backgroundColor: '#027D5E', zIndex: 1}}
      >
        {isExploding ? (
          <ConfettiExplosion
            style={{top: 50}}
            zIndex={1200}
            colors={['#027D5E', '#E24052']}
            onComplete={() => {
              setIsExploding(false);
            }}
          />
        ) : null}
        <div className="d-flex flex-column text-light">
          <Trans>Day</Trans>
          <span
            className="text-3d text-light"
            style={{
              fontSize: '100px',
              fontWeight: 'bold',
              display: 'inline-block',
              lineHeight: 1,
              transition:
                'transform 0.15s ease-in-out, opacity 0.15s ease-in-out',
              transform: isZooming ? 'scale(5)' : 'scale(1)',
              opacity: isZooming ? 0 : 1,
            }}
          >
            {day}
          </span>
          <Button variant="light" className="mb-3" onClick={handleOpen}>
            <Trans>Open</Trans>
          </Button>
          {!challengeAccepted && (
            <span className="text-light font-weight-bold">
              {participants.length} / {memberCount} <Trans>have opened</Trans>
            </span>
          )}
          {challengeAccepted ? (
            <div className="d-flex flex-column justify-content-center align-items-center gap-3">
              <ChallengeParticipants participants={participants} />
            </div>
          ) : null}
        </div>
      </FrontSide>
      <BackSide
        className="d-flex flex-column justify-content-center align-items-center border rounded text-center p-3 text-light"
        style={{backgroundColor: '#027D5E'}}
      >
        <div ref={containerReference} className="w-100">
          <MarkdownView content={content} />
          <Button className="mt-3" variant="light" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
        </div>
      </BackSide>
    </Flippy>
  );
}
