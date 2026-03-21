'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {sp} from '../../_utils';
import {PATHS} from '@/constants.mjs';
import {refreshAuthIfExpired} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {
  latinAlphabetWithSpecials,
  numbers,
  spaceAndDash,
  validateAndNormalizeInput,
} from '@/lib/validation';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  groupNamePlaceholder: {
    'en-US': 'Group name',
    'fi-FI': 'Ryhmän nimi',
    'sv-SE': 'Gruppnamn',
  },
  letsGo: {
    'en-US': "Let's go",
    'fi-FI': 'Aloitetaan!',
    'sv-SE': 'Nu kör vi!',
  },
  invalidName: {
    'en-US': 'Invalid name',
    'fi-FI': 'Virheellinen nimi',
    'sv-SE': 'Ogiltigt namn',
  },
  failedToCreateGroup: {
    'en-US': 'Failed to create group',
    'fi-FI': 'Ryhmän luominen epäonnistui',
    'sv-SE': 'Det gick inte att skapa en grupp',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const CreateOrChooseGroupForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();

  const [groupName, setGroupName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${numbers}${spaceAndDash}`,
      ),
    );
  };

  const handleCreate = async (event: any) => {
    event.preventDefault();
    setIsLoading(true);
    let createCallResponse;
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch(PATHS.strengthSessionCreateGroupAndSession, {
        method: 'POST',
        body: JSON.stringify({
          name: groupName,
        }),
      });
      const body = await call.json();
      if (!call.ok) {
        throw new Error(body.message);
      }

      createCallResponse = body;
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'invalid-name') {
        toast.error(t('invalidName', locale));
      } else {
        toast.error(t('failedToCreateGroup', locale));
      }

      setIsLoading(false);
      return;
    }

    const sessionId = createCallResponse.strengthSessionId;
    const joinShortCode = createCallResponse.joinShortCode;
    router.replace(
      `${sp(PATHS.strengthSessionJoinView, sessionId)}?code=${joinShortCode}`,
    );
  };

  return (
    <form onSubmit={handleCreate}>
      <div className="mb-10 mt-5">
        <input
          autoFocus
          className="form-control mb-2 w-full rounded-md border p-5 text-center font-mono text-md"
          type="text"
          id="group-name"
          value={groupName}
          placeholder={t('groupNamePlaceholder', locale)}
          maxLength={50}
          onChange={(event) => {
            handleNameChange(event);
          }}
        />
      </div>
      <div className="flex justify-center">
        <ButtonWithLoader
          id="continue-button"
          type="submit"
          className="w-full max-w-xs py-3"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {t('letsGo', locale)}
        </ButtonWithLoader>
      </div>
    </form>
  );
};
