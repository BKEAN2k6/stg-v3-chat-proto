import {useState} from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import TimezoneSelect from 'react-timezone-select';
import {type CreateCommunityResponse} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly onCommunityCreate: (community: CreateCommunityResponse) => void;
  readonly isOpen: boolean;
  readonly handleClose: () => void;
};

export default function CreateCommunityModal(props: Props) {
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();

  const {onCommunityCreate, isOpen, handleClose} = props;
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'fi' | 'sv'>('en');
  const [timezone, setTimezone] = useState<string>('Etc/GMT');

  const handleSave = async () => {
    if (!currentUser) {
      return;
    }

    try {
      const community = await api.createCommunity({
        name: name.trim(),
        description: description.trim(),
        language,
        timezone,
      });
      handleClose();
      onCommunityCreate(community);
      setName('');
      setDescription('');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while saving the community',
      });
    }
  };

  return (
    <Modal show={isOpen} className="px-4" onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create community</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="community-name" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter name"
              value={name}
              maxLength={50}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="community-descriptiion" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter description"
              value={description}
              maxLength={500}
              onChange={(event) => {
                setDescription(event.target.value);
              }}
            />
          </Form.Group>
          <Form.Group controlId="community-language" className="mb-3">
            <Form.Label>Language</Form.Label>
            <Form.Control
              as="select"
              value={language}
              onChange={(event) => {
                setLanguage(event.target.value as 'en' | 'fi' | 'sv');
              }}
            >
              <option value="en">English</option>
              <option value="fi">Finnish</option>
              <option value="sv">Swedish</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="community-timezone" className="mb-3">
            <Form.Label>Timezone</Form.Label>
            <TimezoneSelect
              value={timezone}
              onChange={({value}) => {
                setTimezone(value);
              }}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Create
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
