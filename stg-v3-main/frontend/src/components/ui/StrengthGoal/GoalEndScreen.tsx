import {useState} from 'react';
import {CrossFade} from '../CrossFade/CrossFade.js';
import CelebrationScreen from './CelebrationScreen.js';
import GreetingScreen from './GreetingScreen.js';

type Properties = {
  readonly completedCount: number;
  readonly onClose: () => void;
};

export default function GoalEndScreen({completedCount, onClose}: Properties) {
  const [showGreeting, setShowGreeting] = useState(false);

  const handleContinue = () => {
    setShowGreeting(true);
  };

  return (
    <CrossFade contentKey={showGreeting ? 'greeting' : 'explosion'}>
      {showGreeting ? (
        <GreetingScreen onClose={onClose} />
      ) : (
        <CelebrationScreen
          completedCount={completedCount}
          onContinue={handleContinue}
        />
      )}
    </CrossFade>
  );
}
