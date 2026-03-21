import {Button} from 'react-bootstrap';
import {Trans} from '@lingui/macro';

type Props = {
  readonly onConfirm: () => void;
};

export default function ConfirmJoin(props: Props) {
  const {onConfirm} = props;

  return (
    <div className="w-100 text-center">
      <div className="text-start w-100 m-auto mb-5">
        <h1 className="display-6 my-5 text-center">
          <Trans>Confirm that you want to join the community.</Trans>
        </h1>
      </div>
      <Button style={{width: 150}} className="mb-3" onClick={onConfirm}>
        <Trans>Confirm</Trans>
      </Button>
    </div>
  );
}
