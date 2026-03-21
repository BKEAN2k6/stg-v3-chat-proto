import {Trans} from '@lingui/react/macro';
import {type UserInfo} from '@client/ApiTypes';
import StrengthTrophy from '../Trophy/StrengthTrophy.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly createdBy: UserInfo;
};

export default function OnboardingCompletedContent({createdBy}: Properties) {
  return (
    <div
      style={{
        backgroundColor: strengthColorMap.selfRegulation[100],
      }}
      className="d-flex flex-column gap-2 text-center align-items-center p-3 rounded"
    >
      <h4 className="mt-3">
        <Trans>
          {createdBy.firstName} {createdBy.lastName} completed the onboarding!
        </Trans>
      </h4>
      <StrengthTrophy strength="selfRegulation" size={250} />
      <h6>
        <Trans>Spectacular!</Trans>
      </h6>
    </div>
  );
}
