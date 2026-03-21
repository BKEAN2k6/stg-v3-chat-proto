import {useState} from 'react';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useToasts} from '@/components/toasts';
import {useCurrentUser} from '@/context/currentUserContext';
import {type UpdateCommunityAvatarResponse} from '@/api/ApiTypes';
import {colorFromId} from '@/helpers/avatars';
import AvatarInput from '@/components/ui/AvatarInput';
import api from '@/api/ApiClient';

type Props = {
  readonly communityId: string;
  readonly communityAvatar: string;
  readonly communityName: string;
};

export default function CommunityAvatar(props: Props) {
  const {_} = useLingui();
  const {communityId, communityAvatar, communityName} = props;
  const [avatar, setAvatar] = useState<string>(communityAvatar);
  const {currentUser, setCurrentUser} = useCurrentUser();
  const toasts = useToasts();

  const handleAvatarSave = async (image: Blob) => {
    try {
      if (!currentUser) throw new Error('No user set');
      const response = await fetch(
        `/api/v1/communities/${communityId}/avatar`,
        {
          method: 'POST',
          headers: {
            'Content-Type': image.type,
          },
          body: image,
        },
      );

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const {avatar} = (await response.json()) as UpdateCommunityAvatarResponse;
      setAvatar(avatar);

      if (
        !currentUser.communities.some(
          (community) => community._id === communityId,
        )
      ) {
        return;
      }

      const updatedUserCommunities = currentUser.communities.map(
        (community) => {
          if (community._id === communityId) {
            return {...community, avatar};
          }

          return community;
        },
      );

      setCurrentUser({...currentUser, communities: updatedUserCommunities});
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
    if (!currentUser) throw new Error('No user set');

    try {
      const updatedCommunity = await api.updateCommunity(
        {id: communityId},
        {
          avatar: '',
        },
      );

      setAvatar('');

      if (
        !currentUser.communities.some(
          (community) => community._id === communityId,
        )
      ) {
        return;
      }

      const updatedUserCommunities = currentUser.communities.map(
        (community) => {
          if (community._id === communityId) {
            return {...community, ...updatedCommunity};
          }

          return community;
        },
      );

      setCurrentUser({...currentUser, communities: updatedUserCommunities});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the community`),
      });
    }
  };

  return (
    <>
      <p>
        <Trans>Avatar</Trans>
      </p>

      <AvatarInput
        name={communityName}
        color={colorFromId(communityId)}
        existingAvatar={avatar}
        onSave={handleAvatarSave}
        onDelete={handleAvatarDelete}
      />
    </>
  );
}
