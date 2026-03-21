import {useLingui} from '@lingui/react';
import {type StrengthSlug} from '@client/ApiTypes';
import {strengthName} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';

type Properties = {
  readonly topStrength: {strength: StrengthSlug; count: number};
  readonly width: string;
};

export default function SprintResultTopStrength(properties: Properties) {
  const {i18n} = useLingui();
  const {topStrength, width} = properties;
  return (
    <>
      <StrengthAvatar strength={topStrength.strength} size={width} />
      <div className="fs-6 fw-bold text-center mt-4 d-flex flex-md-column gap-1">
        <span>{strengthName(topStrength.strength, i18n.locale)}</span>
        <span>x{topStrength.count}</span>
      </div>
    </>
  );
}
