import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Button} from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import {useLingui} from '@lingui/react';
import {useState} from 'react';
import TimezoneSelect from 'react-timezone-select';
import {useQueryClient} from '@tanstack/react-query';
import {useUpdateCommunityMutation} from '@client/ApiHooks.js';
import {useToasts} from '@/components/toasts/index.js';

type Properties = {
  readonly communityId: string;
  readonly communityName: string;
  readonly communityDescription: string;
  readonly communityTimezone: string;
  readonly onUpdated?: () => Promise<void> | void;
};

export default function CommunityDetails(properties: Properties) {
  const {
    communityId,
    communityName,
    communityDescription,
    communityTimezone,
    onUpdated,
  } = properties;
  const {_} = useLingui();
  const toasts = useToasts();
  const [name, setName] = useState<string>(communityName);
  const [description, setDescription] = useState<string>(communityDescription);
  const [timezone, setTimezone] = useState<string>(communityTimezone);
  const updateCommunity = useUpdateCommunityMutation();
  const queryClient = useQueryClient();

  const handleUpdate = async () => {
    try {
      const updatedCommunity = await updateCommunity.mutateAsync({
        pathParameters: {id: communityId},
        payload: {
          name,
          description,
          timezone,
        },
      });

      setName(updatedCommunity.name);
      setDescription(updatedCommunity.description);
      await queryClient.invalidateQueries({queryKey: ['billingGroup']});
      await onUpdated?.();
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
          required
          type="text"
          placeholder="Name"
          value={name}
          maxLength={50}
          onBlur={() => {
            setName(name.trim());
          }}
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
          required
          type="text"
          placeholder="Description"
          value={description}
          maxLength={500}
          onBlur={() => {
            setName(name.trim());
          }}
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
