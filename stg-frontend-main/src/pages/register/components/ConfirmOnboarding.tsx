import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';

type Props = {
  readonly onConfirm: () => void;
  readonly onSkip: () => void;
};

export default function ConfirmOnboarding(props: Props) {
  const {onConfirm, onSkip} = props;

  return (
    <div className="w-100 text-center">
      <div className="text-start w-100 m-auto mb-5">
        <h1 className="display-6 my-5 text-center">
          <Trans>You are already a member of this community.</Trans>
        </h1>
        <div
          className="d-flex flex-column justify-content-center align-items-center w-100 m-auto mb-5"
          style={{maxWidth: 300}}
        >
          <Button style={{width: 150}} className="mb-3" onClick={onConfirm}>
            <Trans>Continue</Trans>
          </Button>
          <Button
            variant="link"
            style={{width: 150}}
            className="mb-3"
            onClick={() => {
              onSkip();
            }}
          >
            <Trans>Skip onboarding</Trans>
          </Button>
        </div>
      </div>
    </div>
  );
}
