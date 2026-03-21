import {type StrengthSlug} from '@client/ApiTypes';
import {SimpleLottiePlayer} from '../SimpleLottiePlayer.js';
import TrophyHandled from './TrophyHandled.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly size?: number;
};

export default function StrengthTrophy({strength, size = 100}: Properties) {
  return (
    <TrophyHandled strength={strength} size={size}>
      <SimpleLottiePlayer
        autoplay
        loop
        src={`/animations/strengths/${strength}.json`}
        style={{
          position: 'absolute',
          top: '38%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '45%',
          height: 'auto',
          pointerEvents: 'none',
        }}
      />
    </TrophyHandled>
  );
}
