import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {type StrengthSlug, type LanguageCode} from '@client/ApiTypes';
import GoalTrophy from '../StrengthGoal/GoalTrophy.js';
import {SimpleLottiePlayer} from '../SimpleLottiePlayer.js';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly groupName: string;
  readonly completedCount: number;
};

export default function GoalCompletedContent({
  strength,
  completedCount,
  groupName,
}: Properties) {
  const {i18n} = useLingui();

  const locale = i18n.locale as LanguageCode;

  const capitalizedGroupName =
    groupName.charAt(0).toUpperCase() + groupName.slice(1);
  const backgroundColor = strengthColorMap[strength][100];
  const ballColor = strengthColorMap[strength][300];
  const borderColor = strengthColorMap[strength][500];
  const strengthTranslation =
    strengthTranslationMap[strength][locale].toLocaleLowerCase();

  return (
    <div
      style={{backgroundColor}}
      className="d-flex flex-column gap-2 text-center align-items-center p-3 rounded"
    >
      <div className="d-flex flex-column gap-2 mt-3 mb-2">
        <h4>
          <Trans>{capitalizedGroupName} completed a goal!</Trans>
        </h4>
        <div
          className="mt-2"
          style={{position: 'relative', width: '100%', height: '100%'}}
        >
          <div
            style={{
              position: 'absolute',
              top: '78%',
              left: '78%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <GoalTrophy completedCount={completedCount} size={110} />
          </div>
          <div
            style={{
              borderRadius: '50%',
              backgroundColor: ballColor,
              border: `1px solid ${borderColor}`,
              width: 250,
              height: 250,
              margin: 'auto',
            }}
          >
            <SimpleLottiePlayer
              autoplay
              loop
              src={`/animations/strengths/${strength}.json`}
            />
          </div>
        </div>
      </div>
      <h6>
        <Trans>Goal in strength {strengthTranslation} completed</Trans>{' '}
        {completedCount === 1 ? (
          <Trans>once</Trans>
        ) : (
          <Trans>{`${completedCount} times`}</Trans>
        )}
        .
      </h6>
    </div>
  );
}
