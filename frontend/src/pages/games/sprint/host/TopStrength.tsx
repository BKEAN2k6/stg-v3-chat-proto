import {useLingui} from '@lingui/react';
import {type StrengthSlug} from '@client/ApiTypes';
import {strengthColorMap, strengthName} from '@/helpers/strengths.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type Properties = {
  readonly topStrength: {strength: string; count: number};
  readonly width: string;
};

export default function TopStrength(properties: Properties) {
  const {i18n} = useLingui();
  const {topStrength, width} = properties;
  return (
    <>
      <div
        className="rounded-circle"
        style={{
          width,
          height: width,
          overflow: 'hidden',
          backgroundColor:
            strengthColorMap[topStrength.strength as StrengthSlug][300],
        }}
      >
        <SimpleLottiePlayer
          autoplay
          loop
          src={`/animations/strengths/${topStrength.strength}.json`}
          className="rounded-circle"
        />
      </div>
      <div className="fs-5 fs-md-4 fs-xl-2 fw-bold text-center mt-4 text-truncate d-flex flex-column flex-lg-row gap-3">
        <span>{strengthName(topStrength.strength, i18n.locale)}</span>
        <span>x{topStrength.count}</span>
      </div>
    </>
  );
}
