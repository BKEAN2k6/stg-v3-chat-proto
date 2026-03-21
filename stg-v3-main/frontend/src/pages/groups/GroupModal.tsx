import {useState, useEffect, type SyntheticEvent} from 'react';
import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {Modal, Form, Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {type UserInfo} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';

type GroupModalProperties = {
  readonly isShown: boolean;
  readonly communityId: string;
  readonly onHide: () => void;
  readonly onSubmit: (
    name: string,
    description: string,
    owner: string,
  ) => Promise<void>;
  readonly initialName?: string;
  readonly initialDescription?: string;
  readonly initialOwnerId?: string;
};

export default function GroupModal({
  isShown,
  communityId,
  onHide,
  onSubmit,
  initialName = '',
  initialDescription = '',
  initialOwnerId = '',
}: GroupModalProperties) {
  const {_} = useLingui();
  const toasts = useToasts();
  const [groupName, setGroupName] = useState(initialName);
  const [groupDescription, setGroupDescription] = useState(initialDescription);
  const [ownerId, setOwnerId] = useState(initialOwnerId);
  const [members, setMembers] = useState<UserInfo[]>([]);

  useEffect(() => {
    setGroupName(initialName);
    setGroupDescription(initialDescription);
    setOwnerId(initialOwnerId);
  }, [initialName, initialDescription, initialOwnerId, isShown]);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const communityMembers = await api.getCommunityMembers({
          id: communityId,
        });
        communityMembers.sort(
          (a, b) =>
            a.firstName.localeCompare(b.firstName) ||
            a.lastName.localeCompare(b.lastName),
        );
        setMembers(communityMembers);
        if (!initialOwnerId && communityMembers.length > 0) {
          setOwnerId(communityMembers[0].id);
        }
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while creating the event`),
        });
      }
    }

    if (communityId && isShown) {
      void fetchMembers();
    }
  }, [communityId, isShown, initialOwnerId, toasts, _]);

  const handleSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit(groupName, groupDescription, ownerId);
  };

  return (
    <Modal show={isShown} onHide={onHide}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {initialName ? _(msg`Edit group`) : _(msg`Create group`)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>
              <Trans>Group name</Trans>
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={groupName}
              placeholder={_(msg`Enter group name`)}
              onChange={(event) => {
                setGroupName(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <Trans>Group description</Trans>
            </Form.Label>
            <Form.Control
              required
              type="text"
              value={groupDescription}
              placeholder={_(msg`Enter group description`)}
              onChange={(event) => {
                setGroupDescription(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>
              <Trans>Group owner</Trans>
            </Form.Label>
            <Form.Control
              as="select"
              value={ownerId}
              onChange={(event) => {
                setOwnerId(event.target.value);
              }}
            >
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <Trans>Close</Trans>
          </Button>
          <Button variant="primary" type="submit">
            <Trans>Save Changes</Trans>
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
