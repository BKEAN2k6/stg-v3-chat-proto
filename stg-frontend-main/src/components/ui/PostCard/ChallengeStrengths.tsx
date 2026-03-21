import {useLingui} from '@lingui/react';
import {type LanguageCode} from '@/i18n';
import {languages} from '@/i18n';
import {strengthTranslationMap, strengthColorMap} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';

type Props = {
  readonly strengths: StrengthSlug[];
};

export default function ChallengeStrengths(props: Props) {
  const {i18n} = useLingui();
  const {strengths} = props;
  let locale = i18n.locale as LanguageCode;
  if (!Object.keys(languages).includes(locale)) {
    locale = 'en';
  }

  if (strengths.length === 0) {
    return null;
  }

  return (
    <div className="d-flex flex-wrap mb-3">
      {strengths.map((strengthSlug) => (
        <div
          key={strengthSlug}
          className="d-flex align-items-center gap-2 text-light"
        >
          <img
            src={`images/strengths/${strengthSlug}.png`}
            alt={strengthSlug}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: strengthColorMap[strengthSlug][300],
            }}
          />
          <small>{strengthTranslationMap[strengthSlug][locale]}</small>
        </div>
      ))}
    </div>
  );
}
