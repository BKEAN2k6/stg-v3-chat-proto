import {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useCurrentUser} from '@/context/currentUserContext';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly onGroupUpdate: (group: any) => void;
  readonly isOpen: boolean;
  readonly handleClose: () => void;
  readonly group?: {
    readonly _id: string;
    readonly name: string;
    readonly description: string;
  };
};

export default function EditGroupModal(props: Props) {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();

  const {onGroupUpdate, group, isOpen, handleClose} = props;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!group) {
      setName('');
      setDescription('');
      return;
    }

    setName(group.name);
    setDescription(group.description);
  }, [group]);

  const handleSave = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const updatedGroup = await (group?._id
        ? api.updateGroup({id: group._id}, {name, description})
        : api.createCommunityGroup(
            {id: currentUser.selectedCommunity},
            {name, description},
          ));

      setName('');
      setDescription('');
      handleClose();
      onGroupUpdate(updatedGroup);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the group`),
      });
    }
  };

  return (
    <Modal show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {group?._id ? _(msg`Edit group`) : _(msg`Create group`)}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="group-name">
            <Form.Control
              required
              type="text"
              placeholder={_(msg`Enter name`)}
              value={name}
              maxLength={50}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="group-descriptiion">
            <Form.Control
              required
              type="text"
              placeholder={_(msg`Enter description`)}
              value={description}
              maxLength={500}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          <Trans>Close</Trans>
        </Button>
        <Button variant="primary" onClick={handleSave}>
          <Trans>Save Changes</Trans>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
