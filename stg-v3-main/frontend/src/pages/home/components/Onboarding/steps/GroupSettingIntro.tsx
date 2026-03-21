import {Trans} from '@lingui/react/macro';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

export default function GroupSettingsIntro() {
  return (
    <div className="p-4 pb-0">
      <p>
        <Trans>
          Everything in See the Good! happens in groups. We’ve created the first
          group for you and next you can adjust its settings.
        </Trans>
      </p>

      <p>
        <Trans>
          We recommend suitable content for your group based on the chosen age
          group and language. You can change these settings at any time.
        </Trans>
      </p>

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
          src="/animations/strengths/teamwork.json"
        />
      </div>
    </div>
  );
}
