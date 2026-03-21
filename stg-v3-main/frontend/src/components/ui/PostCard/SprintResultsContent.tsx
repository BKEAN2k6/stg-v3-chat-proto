import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {type StrengthSlug, type LanguageCode} from '@client/ApiTypes';
import SprintResultTopStrength from './SprintResultTopStrength.js';
import {strengthTranslationMap} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';

type Properties = {
  readonly strengths: Array<{strength: StrengthSlug; count: number}>;
};

export default function SprintResultsContent(properties: Properties) {
  const {i18n} = useLingui();
  const {strengths} = properties;

  let locale = i18n.locale as LanguageCode;
  if (!['fi', 'se', 'en'].includes(locale)) {
    locale = 'en';
  }

  const sortedStrengths = strengths.sort((a, b) => b.count - a.count);

  const restOfStrengths = sortedStrengths.slice(3).map((s) => s.strength);

  return (
    <>
      <div className="d-flex flex-column gap-2 text-center">
        <Trans>
          We played a strength sprint! The top strengths were these.
        </Trans>
      </div>
      <div className="d-flex flex-column flex-md-row w-100 h-100 justify-content-between align-items-baseline gap-4 px-3 px-sm-5">
        {sortedStrengths[1] ? (
          <div className="w-100 d-flex flex-column align-items-center">
            <SprintResultTopStrength
              topStrength={sortedStrengths[1]}
              width="90%"
            />
          </div>
        ) : null}
        {sortedStrengths[0] ? (
          <div className="w-100 d-flex flex-column align-items-center">
            <SprintResultTopStrength
              topStrength={sortedStrengths[0]}
              width={sortedStrengths[1] ? '100%' : '50%'}
            />
          </div>
        ) : null}
        {sortedStrengths[2] ? (
          <div className="w-100 d-flex flex-column align-items-center">
            <SprintResultTopStrength
              topStrength={sortedStrengths[2]}
              width="80%"
            />
          </div>
        ) : null}
      </div>
      {restOfStrengths.length > 0 && (
        <>
          <div className="d-flex flex-column gap-2 text-center">
            <Trans>We also saw these strengths in the sprint.</Trans>
          </div>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            {restOfStrengths.map((strength) => (
              <div key={strength} className="d-flex align-items-center gap-2">
                <StrengthAvatar strength={strength} />
                <small>
                  {
                    strengthTranslationMap[strength][
                      i18n.locale as LanguageCode
                    ]
                  }
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
