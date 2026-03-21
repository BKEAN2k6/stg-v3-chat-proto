import {Trans, msg} from '@lingui/macro';
import {Button} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import RegisterFormHeading from './RefisterFormHeading';
import {useToasts} from '@/components/toasts';
import AvatarInput from '@/components/ui/AvatarInput';
import {colorFromId, formatName} from '@/helpers/avatars';

type Props = {
  readonly firstName: string;
  readonly lastName: string;
  readonly onComplete: () => void;
};

export default function RegisterAvatar(props: Props) {
  const {_} = useLingui();
  const {firstName, lastName, onComplete} = props;
  const toasts = useToasts();

  const handleSaveAvatar = async (image: Blob) => {
    try {
      const response = await fetch(`/api/v1/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'image/jpeg',
        },
        body: image,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      onComplete();
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong.`),
      });
    }
  };

  return (
    <div className="w-100 text-center">
      <RegisterFormHeading
        title={_(msg`Add your image so others can recognize you`)}
      />
      <AvatarInput
        className="mb-5"
        name={formatName({firstName, lastName})}
        color={colorFromId(firstName)}
        onSave={handleSaveAvatar}
      />

      <Button variant="link" onClick={onComplete}>
        <Trans>Skip</Trans>
      </Button>
    </div>
  );
}
