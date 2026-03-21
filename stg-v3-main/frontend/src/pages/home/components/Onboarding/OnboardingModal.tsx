import {type AgeGroup, type LanguageCode} from '@client/ApiTypes.js';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/core/macro';
import {Wizard} from './Wizard.js';
import GoalsDemo from './steps/GoalsDemo.js';
import GroupSettingsIntro from './steps/GroupSettingIntro.js';
import GroupSettingsForm from './steps/GroupSettingsForm.js';
import MaterialsIntro from './steps/MaterialsIntro.js';
import Materials from './steps/Materials.js';
import CookieConsent from './steps/CookieConsent.js';
import Intro from './steps/Intro.js';
import Games from './steps/Games.js';
import Outro from './steps/Outro.js';

export type OnboardingData = {
  name: string;
  language: LanguageCode;
  ageGroup: AgeGroup;
};

export type CookieConsentData = {
  vimeo: boolean;
};

export type OnboardingModalProperties = {
  readonly isOpen: boolean;
  readonly group: OnboardingData;
  readonly cookieConsents: CookieConsentData;
  readonly onClose: () => void;
  readonly onFinish: () => void;
  readonly onSaveGroup?: (data: OnboardingData) => Promise<void>;
  readonly onSaveCookieConsent?: (data: CookieConsentData) => Promise<void>;
};

export default function OnboardingModal({
  isOpen,
  group,
  cookieConsents,
  onClose,
  onFinish,
  onSaveGroup,
  onSaveCookieConsent,
}: OnboardingModalProperties) {
  const {_} = useLingui();
  return (
    <Wizard isOpen={isOpen} onClose={onClose} onFinish={onFinish}>
      <Wizard.Step id="intro" title={_(msg`Welcome!`)}>
        <Intro />
      </Wizard.Step>
      <Wizard.Step
        id="group-intro"
        title={_(msg`It all starts with your group`)}
      >
        <GroupSettingsIntro />
      </Wizard.Step>
      <Wizard.Step<OnboardingData>
        id="group-settings"
        title={_(msg`Group Settings`)}
        initialData={group}
        beforeNext={async ({data}) => {
          if (!data.name?.trim()) return false;
          try {
            if (onSaveGroup) await onSaveGroup(data);
            return true;
          } catch {
            return false;
          }
        }}
      >
        {({data, setData}) => (
          <GroupSettingsForm data={data} setData={setData} />
        )}
      </Wizard.Step>
      <Wizard.Step
        id="materials-intro"
        title={_(msg`Ready-made lesson materials`)}
      >
        <MaterialsIntro />
      </Wizard.Step>
      <Wizard.Step id="materials" title={_(msg`Strength Guide`)}>
        <Materials />
      </Wizard.Step>

      <Wizard.Step id="goal-demo" title={_(msg`Develop strengths`)}>
        {({next, setNextDisabled}) => (
          <GoalsDemo
            onDone={() => {
              next();
            }}
            onBusy={(busy) => {
              setNextDisabled(busy);
            }}
          />
        )}
      </Wizard.Step>

      <Wizard.Step<OnboardingData>
        overflowHidden
        id="games"
        title={_(msg`Strength Sprint`)}
      >
        <Games />
      </Wizard.Step>
      <Wizard.Step<CookieConsentData>
        id="cookie-consent"
        title={_(msg`Cookies`)}
        initialData={cookieConsents}
        beforeNext={async ({data}) => {
          try {
            if (onSaveCookieConsent) await onSaveCookieConsent(data);
            return true;
          } catch {
            return false;
          }
        }}
      >
        {({data, setData}) => <CookieConsent data={data} setData={setData} />}
      </Wizard.Step>
      <Wizard.Step id="done" title={_(msg`All done, great job!`)}>
        <Outro />
      </Wizard.Step>
    </Wizard>
  );
}
