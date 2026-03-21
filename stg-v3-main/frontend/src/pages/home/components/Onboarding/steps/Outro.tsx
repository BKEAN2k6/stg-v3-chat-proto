import {Stack} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import StrengthTrophy from '@/components/ui/Trophy/StrengthTrophy.js';

export default function Outro() {
  return (
    <Stack className="align-items-stretch gap-4 flex-column flex-md-row p-4 pb-0">
      <div className="flex-grow-1">
        <p>
          <Trans>
            In this task, you used <b>curiosity</b>, <b>love of learning</b>,
            and <b>perseverance</b>. You’ve earned your first See the Good!
            badge!
          </Trans>
        </p>
        <p>
          <Trans>
            Now it’s your turn to continue the journey from strength to strength
            with your group!
          </Trans>
        </p>

        <p>
          <Trans>
            Invite your fellow teachers to see the good every single day of the
            year!
          </Trans>
        </p>

        <p>
          <b>
            <Trans>Thank you for being part of this!</Trans>
          </b>
        </p>
      </div>
      <div className="w-100 d-flex justify-content-center align-items-end">
        <div className="d-none d-md-block">
          <StrengthTrophy strength="selfRegulation" size={250} />{' '}
        </div>
        <div className="d-block d-md-none">
          <StrengthTrophy strength="selfRegulation" size={150} />
        </div>
      </div>
    </Stack>
  );
}
