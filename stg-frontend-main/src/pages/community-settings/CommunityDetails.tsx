import {Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {useLingui} from '@lingui/react';
import {Trans, msg} from '@lingui/macro';
import {useState} from 'react';
import TimezoneSelect from 'react-timezone-select';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly communityId: string;
  readonly communityName: string;
  readonly communityDescription: string;
  readonly communityTimezone: string;
};

export default function CommunityDetails(props: Props) {
  const {communityId, communityName, communityDescription, communityTimezone} =
    props;
  const {_} = useLingui();
  const toasts = useToasts();
  const [name, setName] = useState<string>(communityName);
  const [description, setDescription] = useState<string>(communityDescription);
  const [timezone, setTimezone] = useState<string>(communityTimezone);

  const handleUpdate = async () => {
    try {
      const updatedCommunity = await api.updateCommunity(
        {id: communityId},
        {
          name: name.trim(),
          description: description.trim(),
          timezone,
        },
      );

      setName(updatedCommunity.name);
      setDescription(updatedCommunity.description);
      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Community details updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while updating the community`),
      });
    }
  };

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        void handleUpdate();
      }}
    >
      <Form.Group className="mb-3" controlId="name">
        <Form.Label column sm="2">
          <Trans>Community Name</Trans>
        </Form.Label>

        <Form.Control
          type="text"
          placeholder="Name"
          value={name}
          maxLength={50}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="description">
        <Form.Label column sm="2">
          <Trans>Community description</Trans>
        </Form.Label>

        <Form.Control
          type="text"
          placeholder="Description"
          value={description}
          maxLength={500}
          onChange={(event) => {
            setDescription(event.target.value);
          }}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="timezone">
        <Form.Label column sm="2">
          <Trans>Timezone</Trans>
        </Form.Label>
        <TimezoneSelect
          value={timezone}
          onChange={({value}) => {
            setTimezone(value);
          }}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="float-end">
        Save
      </Button>
    </Form>
  );
}
