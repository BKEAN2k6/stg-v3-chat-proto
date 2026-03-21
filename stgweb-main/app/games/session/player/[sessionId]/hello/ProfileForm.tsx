'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {wsevent} from '../../../_utils';
import {NameInput} from './NameInput';
import {ColorInput} from './ColorInput';
import {AvatarInput} from './AvatarInput';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import useAuth from '@/hooks/use-auth';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {avatarColors, avatarSlugs} from '@/lib/avatar-data';

const texts = {
  namePlaceholder: {
    'en-US': 'Name',
    'fi-FI': 'Nimi',
    'sv-SE': 'Namn',
  },
  continueButton: {
    'en-US': "Let's go!",
    'fi-FI': 'Mennään!',
    'sv-SE': 'Nu kör vi!',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly sessionId: string;
};

export const ProfileForm = (props: Props) => {
  const {sessionId} = props;
  const {getLoggedInUserId} = useAuth();
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [color, setColor] = useState<string>(
    avatarColors.slice(0, 25)[Math.floor(Math.random() * 25)],
  );
  const [avatar, setAvatar] = useState<string>(
    avatarSlugs[Math.floor(Math.random() * 25)],
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    const directus = createClientSideDirectusClient();
    try {
      await refreshAuthIfExpired({force: true});
      const loggedInUserId = getLoggedInUserId() ?? '';
      await directus.items('directus_users').updateOne(loggedInUserId, {
        first_name: name?.trim(),
        color,
        avatar_slug: avatar,
      });
    } catch {
      setIsLoading(false);
      toast.error(t('saveFailed', locale), {
        id: 'unknown-error',
      });
      return;
    }

    await wsevent({
      sessionId,
      eventType: 'session_player_joined',
      lookupValue: getLoggedInUserId() ?? undefined,
    });
    router.push(
      PATHS.strengthSessionPlayerLobby.replace('[sessionId]', sessionId),
    );
  };

  return (
    <form
      className="mx-auto max-w-xs items-center justify-center"
      onSubmit={handleCreate}
    >
      <div className="m-2 mb-8">
        <NameInput name={name} setName={setName} />
      </div>
      <div className="m-2">
        <ColorInput color={color} setColor={setColor} isLoading={isLoading} />
      </div>
      <div className="m-2">
        <AvatarInput
          avatar={avatar}
          setAvatar={setAvatar}
          isLoading={isLoading}
        />
      </div>
      <div className="m-2 mt-10">
        <ButtonWithLoader
          id="continue-button"
          type="submit"
          className="w-full"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {t('continueButton', locale)}
        </ButtonWithLoader>
      </div>
    </form>
  );
};
