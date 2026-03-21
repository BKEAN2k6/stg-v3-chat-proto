import {Trans} from '@lingui/react/macro';
import {Stack} from 'react-bootstrap';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

export default function MaterialsIntro() {
  return (
    <Stack className="align-items-start gap-4 flex-column flex-md-row p-4 pb-0">
      <div className="flex-grow-1">
        <p>
          <Trans>
            The lesson materials help you teach character strengths and social
            and emotional skills to your group. Each strength includes four
            lessons: <strong>Start</strong>, <strong>Speak</strong>,{' '}
            <strong>Act</strong>, and <strong>Assess</strong>.
          </Trans>
        </p>
        <p>
          <Trans>
            It’s best to go through the lessons in order, but you can always
            revisit previous ones. The strengths have a default order, which you
            can adjust if you wish.
          </Trans>
        </p>
        <p>
          <Trans>
            A good rhythm is one lesson per week, but you can move faster or
            slower to suit your schedule.
          </Trans>
        </p>
        <p>
          <Trans>
            We’ll always recommend the next lesson on your home page, but you
            can find all lesson materials in the main menu under <b>Teach</b>.
          </Trans>
        </p>
      </div>
      <div className="w-100 d-none d-md-flex justify-content-center">
        <SimpleLottiePlayer
          loop
          autoplay
          src="/animations/strengths/selfRegulation.json"
          style={{width: 200}}
        />
      </div>
    </Stack>
  );
}
