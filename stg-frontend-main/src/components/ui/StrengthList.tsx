import {useLingui} from '@lingui/react';
import clsx from 'clsx';
import {strengthTranslationMap} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';
import StrengthAvatar from '@/components/ui/StrengthAvatar';

type Props = {
  readonly strengths: string[];
  readonly className?: string;
};

export default function StrengthList(props: Props) {
  const {i18n} = useLingui();
  const {strengths, className} = props;

  if (strengths.length === 0) {
    return null;
  }

  return (
    <div className={clsx('d-flex flex-wrap gap-3', className)}>
      {strengths.map((strengthSlug) => (
        <div key={strengthSlug} className="d-flex align-items-center gap-2">
          <StrengthAvatar strength={strengthSlug as StrengthSlug} />
          <small>
            {
              strengthTranslationMap[strengthSlug as StrengthSlug][
                i18n.locale as LanguageCode
              ]
            }
          </small>
        </div>
      ))}
    </div>
  );
}
