import {useLingui} from '@lingui/react';
import clsx from 'clsx';
import {type StrengthSlug, type LanguageCode} from '@client/ApiTypes';
import {strengthTranslationMap} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';

type Properties = {
  readonly strengths: string[];
  readonly className?: string;
};

export default function StrengthList(properties: Properties) {
  const {i18n} = useLingui();
  const {strengths, className} = properties;

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
