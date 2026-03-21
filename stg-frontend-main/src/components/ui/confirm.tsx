import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import {confirmable, createConfirmation} from 'react-confirm';

type ConfirmProps = {
  readonly show: boolean; // eslint-disable-line react/boolean-prop-naming
  readonly titleText: string;
  readonly confirmation: string;
  readonly cancelButtonText: string;
  readonly confirmButtonText: string;
  readonly confirmVariant?: string;
  readonly cancelVariant?: string;
  readonly proceed: (confirmed: boolean) => void;
};

function Confirmation({
  show,
  titleText,
  confirmation: confirmText,
  cancelButtonText,
  confirmButtonText,
  confirmVariant,
  cancelVariant,
  proceed,
}: ConfirmProps) {
  return (
    <Modal
      centered
      show={show}
      className="px-4"
      onHide={() => {
        proceed(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{titleText}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{confirmText}</Modal.Body>
      <Modal.Footer className="justify-content-end">
        <>
          <Button
            variant={confirmVariant ?? 'primary'}
            onClick={() => {
              proceed(true);
            }}
          >
            {confirmButtonText}
          </Button>
          <Button
            variant={cancelVariant ?? 'outline-secondary'}
            onClick={() => {
              proceed(false);
            }}
          >
            {cancelButtonText}
          </Button>
        </>
      </Modal.Footer>
    </Modal>
  );
}

const ConfirmableConfirmation = confirmable(Confirmation);

const defaultConfirmation = createConfirmation(ConfirmableConfirmation);

type ConfirmOptions = {
  readonly title: string;
  readonly text: string;
  readonly cancel: string;
  readonly confirm: string;
  readonly cancelVariant?: string;
  readonly confirmVariant?: string;
};

export async function confirm({
  title,
  text,
  cancel,
  confirm,
  cancelVariant,
  confirmVariant,
}: ConfirmOptions) {
  return defaultConfirmation({
    titleText: title,
    confirmation: text,
    cancelButtonText: cancel,
    confirmButtonText: confirm,
    cancelVariant,
    confirmVariant,
  } as ConfirmProps);
}
