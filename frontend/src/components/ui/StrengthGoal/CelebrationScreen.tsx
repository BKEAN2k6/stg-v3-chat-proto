import {useEffect, useRef} from 'react';
import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import celebrationMp3 from './celebration.mp3';
import GoalTrophy from './GoalTrophy.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type Properties = {
  readonly completedCount: number;
  readonly onContinue: () => void;
};

export default function CelebrationScreen({
  completedCount,
  onContinue,
}: Properties) {
  const wrapperReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sound = new Audio(celebrationMp3);
    void sound.play();
    return () => {
      sound.pause();
      sound.currentTime = 0;
    };
  }, []);

  return (
    <div
      ref={wrapperReference}
      style={{position: 'relative', width: '100%', height: '100%'}}
    >
      <SimpleLottiePlayer
        loop
        autoplay
        src="/animations/other/celebration.json"
        style={{height: '100%', width: 'auto', minWidth: '100%'}}
      />

      <div
        className="d-flex flex-column align-items-center"
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translate(-50%, 0)',
        }}
      >
        <GoalTrophy completedCount={completedCount} size={250} />
        <Button
          className="mt-3"
          size="lg"
          variant="primary"
          onClick={onContinue}
        >
          <Trans>Continue</Trans>
        </Button>
      </div>
    </div>
  );
}
