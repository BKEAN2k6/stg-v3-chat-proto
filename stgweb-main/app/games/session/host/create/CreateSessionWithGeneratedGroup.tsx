'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {sp} from '../../_utils';
import {PATHS} from '@/constants.mjs';
import {refreshAuthIfExpired} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {Loader} from '@/components/atomic/atoms/Loader';
import useLegacyEffect from '@/hooks/use-legacy-effect';

const texts = {
  failedToCreateSprint: {
    'en-US': 'Failed to create sprint',
    'fi-FI': 'Tuokion luominen epäonnistui',
    'sv-SE': 'Det gick inte att skapa en sprint',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const CreateSessionWithGeneratedGroup = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const handleCreate = async () => {
    let createCallResponse;
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch(PATHS.strengthSessionCreateGroupAndSession, {
        method: 'POST',
        body: JSON.stringify({
          name: new Date().toISOString(),
        }),
      });
      const body = await call.json();
      if (!call.ok) {
        throw new Error(body.message);
      }

      createCallResponse = body;
    } catch {
      setIsLoading(false);
      toast.error(t('failedToCreateSprint', locale));

      return;
    }

    const sessionId = createCallResponse.strengthSessionId;
    const joinShortCode = createCallResponse.joinShortCode;
    router.replace(
      `${sp(PATHS.strengthSessionJoinView, sessionId)}?code=${joinShortCode}`,
    );
  };

  useLegacyEffect(() => {
    handleCreate();
  }, []);

  return <div className="flex justify-center">{isLoading && <Loader />}</div>;
};
