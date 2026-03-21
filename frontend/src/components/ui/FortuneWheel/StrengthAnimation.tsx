import {type StrengthSlug} from '@client/ApiTypes';
import 'react-circular-progressbar/dist/styles.css';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly size: number;
  readonly className?: string;
};

export default function StrengthAnimation({
  strength,
  className,
  size,
}: Properties) {
  const backgroundColor = strengthColorMap[strength][300];
  const borderColor = strengthColorMap[strength][500];

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
      }}
    >
      <SimpleLottiePlayer
        autoplay
        loop
        src={`/animations/strengths/${strength}.json`}
        style={{
          width: '100%',
          backgroundColor,
          cursor: 'pointer',
          borderRadius: '50%',
          border: `1px solid ${borderColor}`,
        }}
      />
    </div>
  );
}
