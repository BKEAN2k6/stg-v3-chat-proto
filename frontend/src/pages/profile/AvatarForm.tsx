import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {
  type GetMeResponse,
  type UpdateMeAvatarResponse,
} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import AvatarInput from '@/components/ui/AvatarInput.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';

type Properties = {
  readonly currentUser: GetMeResponse;
  readonly setCurrentUser: (user: GetMeResponse) => void;
};

export default function AvatarForm(properties: Properties) {
  const {_} = useLingui();
  const {currentUser, setCurrentUser} = properties;
  const toasts = useToasts();

  const handleAvatarSave = async (image: Blob) => {
    try {
      const response = await fetch(`/api/v1/users/me/avatar`, {
        method: 'POST',
        headers: {
          'Content-Type': image.type,
        },
        body: image,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const {avatar} = (await response.json()) as UpdateMeAvatarResponse;

      setCurrentUser({...currentUser, avatar});

      toasts.success({
        header: _(msg`Success!`),
        body: _(msg`Avatar image updated`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while uploading your image`),
      });
    }
  };

  const handleAvatarDelete = async () => {
    try {
      const updatedUser = await api.updateMe({
        avatar: '',
      });

      setCurrentUser({...currentUser, ...updatedUser});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the user`),
      });
    }
  };

  return (
    <>
      <p>
        <Trans>Avatar</Trans>
      </p>
      <AvatarInput
        name={formatName(currentUser)}
        color={colorFromId(currentUser.id)}
        existingAvatar={currentUser.avatar}
        onSave={handleAvatarSave}
        onDelete={handleAvatarDelete}
      />
    </>
  );
}
