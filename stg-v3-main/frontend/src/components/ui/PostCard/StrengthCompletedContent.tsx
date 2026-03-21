import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {
  type StrengthSlug,
  type LanguageCode,
  type Group,
} from '@client/ApiTypes';
import StrengthTrophy from '../Trophy/StrengthTrophy.js';
import DiplomaDownloadButton from './DiplomaDownloadButton.js';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly group: Group;
  readonly date: string;
};

export default function StrengthCompletedContent({
  strength,
  group,
  date,
}: Properties) {
  const {i18n} = useLingui();

  const locale = i18n.locale as LanguageCode;

  const groupName = group.name;
  const capitalizedGroupName =
    groupName.charAt(0).toUpperCase() + groupName.slice(1);
  const backgroundColor = strengthColorMap[strength][100];
  const strengthTranslation = strengthTranslationMap[strength][locale];

  return (
    <div
      style={{backgroundColor}}
      className="d-flex flex-column gap-2 text-center align-items-center p-3 rounded"
    >
      <h4 className="mt-3">
        <Trans>{capitalizedGroupName} completed the strength!</Trans>
      </h4>
      <div className="d-flex flex-column gap-2 mt-2 align-items-center">
        <StrengthTrophy strength={strength} size={250} />
        <h6>
          <Trans>{strengthTranslation} completed!</Trans>
        </h6>

        <div className="mt-2">
          <DiplomaDownloadButton
            strength={strength}
            group={group}
            date={date}
          />
        </div>
      </div>
    </div>
  );
}
