import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Form} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {type Dispatch, type SetStateAction} from 'react';
import {type CookieConsentData} from '../OnboardingModal.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

export default function CookieConsent({
  data,
  setData,
}: {
  readonly data: CookieConsentData;
  readonly setData: Dispatch<SetStateAction<CookieConsentData>>;
}) {
  const {_} = useLingui();

  return (
    <div data-prevent-scrolling className="p-4 pb-0">
      <p>
        <Trans>
          We use{' '}
          <a href="https://vimeo.com" target="_blank" rel="noreferrer">
            Vimeo
          </a>{' '}
          to host videos on our site. To view videos, you need to enable Vimeo
          cookies. You can later update this setting in your profile.
        </Trans>
      </p>

      <Form.Check
        type="checkbox"
        label={_(msg`Allow Vimeo cookies`)}
        checked={data.vimeo}
        onChange={async (event) => {
          setData({...data, vimeo: event.target.checked});
        }}
      />
      <Form.Text />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <SimpleLottiePlayer
          autoplay
          loop
          style={{height: 240}}
          src="/animations/strengths/loveOfLearning.json"
        />
      </div>
    </div>
  );
}
