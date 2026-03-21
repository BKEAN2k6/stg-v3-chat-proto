import {useLingui} from '@lingui/react';
import {strengthName} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';
import StrengthAvatar from '@/components/ui/StrengthAvatar';

type Props = {
  readonly topStrength: {strength: StrengthSlug; count: number};
  readonly width: string;
};

export default function TopStrength(props: Props) {
  const {i18n} = useLingui();
  const {topStrength, width} = props;
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
