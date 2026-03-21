import {Trans} from '@lingui/react/macro';
import {Button} from 'react-bootstrap';

type Properties = {
  readonly onConfirm: () => void;
};

export default function ConfirmOnboarding(properties: Properties) {
  const {onConfirm} = properties;

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
        </div>
      </div>
    </div>
  );
}
