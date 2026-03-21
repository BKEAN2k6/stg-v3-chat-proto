import {useLingui} from '@lingui/react';
import {strengthColorMap, strengthName} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';

type Props = {
  readonly topStrength: {strength: string; count: number};
  readonly width: string;
};

export default function TopStrength(props: Props) {
  const {i18n} = useLingui();
  const {topStrength, width} = props;
  return (
    <>
      <img
        src={`/images/strengths/${topStrength.strength}.png`}
        alt={topStrength.strength}
        className="rounded-circle"
        style={{
          width,
          objectFit: 'cover',
          backgroundColor:
            strengthColorMap[topStrength.strength as StrengthSlug][300],
        }}
      />
      <div className="fs-5 fs-md-4 fs-xl-2 fw-bold text-center mt-4 text-truncate d-flex flex-column flex-lg-row gap-3">
        <span>{strengthName(topStrength.strength, i18n.locale)}</span>
        <span>x{topStrength.count}</span>
      </div>
    </>
  );
}
