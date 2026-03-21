import {Dropdown, ButtonGroup, Button} from 'react-bootstrap';
import {ThreeDots} from 'react-bootstrap-icons';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {confirm} from '@/components/ui/confirm';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly postId: string;
  readonly onDelete: (postId: string) => void;
  readonly toggleEditing?: () => void;
  readonly isDeleteAllowed: boolean;
  readonly onClose?: () => void;
};

export default function PostTools(props: Props) {
  const {_} = useLingui();
  const {postId, isDeleteAllowed, onDelete, toggleEditing, onClose} = props;
  const toasts = useToasts();

  const handleMomentDelete = async () => {
    const confirmed = await confirm({
      title: _(msg`Remove moment`),
      text: _(
        msg`Are you sure you want to remove this moment. This can't be undone.`,
      ),
      confirm: _(msg`Yes, remove`),
      cancel: _(msg`No, cancel`),
    });

    if (!confirmed) {
      return;
    }

    try {
      await api.removePost({id: postId});
      onDelete(postId);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing the moment`),
      });
    }
  };

  if (!toggleEditing && !isDeleteAllowed) {
    return null;
  }

  const buttonStyle = {
    borderRadius: '5px',
    border: 'none',
  };

  const buttonClass = 'hide-icon bg-body-tertiary text-black-50';

  return (
    <Dropdown as={ButtonGroup}>
      <Dropdown.Toggle
        variant="secondary"
        className={buttonClass}
        style={buttonStyle}
      >
        <ThreeDots />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {toggleEditing && (
          <Dropdown.Item onClick={toggleEditing}>
            <Trans>Edit</Trans>
          </Dropdown.Item>
        )}
        {isDeleteAllowed && (
          <Dropdown.Item onClick={handleMomentDelete}>
            <Trans>Remove</Trans>
          </Dropdown.Item>
        )}
      </Dropdown.Menu>
      {onClose && (
        <Button
          variant="secondary"
          className={buttonClass}
          style={buttonStyle}
          onClick={onClose}
        >
          x
        </Button>
      )}
    </Dropdown>
  );
}
