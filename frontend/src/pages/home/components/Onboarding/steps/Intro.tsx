import {Trans} from '@lingui/react/macro';
import {Stack} from 'react-bootstrap';

export default function Intro() {
  return (
    <Stack className="align-items-stretch gap-4 flex-column flex-md-row p-4 pb-0 h-100">
      <div className="flex-grow-1 h-100">
        <p>
          <Trans>
            A warm welcome to the <b>See the Good!</b> service. We’re glad to
            have you on board!
          </Trans>
        </p>
        <p>
          <Trans>
            <b>See the Good!</b> is a positive pedagogy method that offers tools
            for strengthening character strengths as well as social and
            emotional skills.
          </Trans>
        </p>

        <p>
          <Trans>
            The method supports students’ wellbeing and learning, helps build a
            positive school culture, and reduces bullying.
          </Trans>
        </p>

        <p>
          <b>
            <Trans>Let’s start by going through a few basics!</Trans>
          </b>
        </p>
      </div>
      <div className="w-100 d-none d-md-flex justify-content-center align-items-end">
        <img
          src="/images/onboarding/coach-and-varis.png"
          style={{width: 250}}
        />
      </div>
    </Stack>
  );
}
