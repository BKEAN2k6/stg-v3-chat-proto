'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  provideYourEmail: {
    'en-US': 'Provide your email address to get a sign-in link',
    'fi-FI': 'Anna sähköpostiosoitteesi saadaksesi kirjautumislinkki',
    'sv-SE': 'Ange din e-postadress för att få en inloggningslänk',
  },
  emailPlaceholder: {
    'en-US': 'Email',
    'fi-FI': 'Sähköposti',
    'sv-SE': 'E-post',
  },
  missingEmail: {
    'en-US': 'Fill in email',
    'fi-FI': 'Täytä sähköpostiosoite',
    'sv-SE': 'Fyll i e-post',
  },
  continue: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
  orText: {
    'en-US': 'or',
    'fi-FI': 'tai',
    'sv-SE': 'eller',
  },
  logIn: {
    'en-US': 'Go back to the login page',
    'fi-FI': 'Palaa kirjautumissivulle',
    'sv-SE': 'Gå till inloggningssidan',
  },
  userNotFound: {
    'en-US': 'User was not found.',
    'fi-FI': 'Käyttäjää ei löytynyt.',
    'sv-SE': 'Användaren hittades inte.',
  },
  validTokenExists: {
    'en-US': 'User already has a login token. Check your email.',
    'fi-FI':
      'Käyttäjälle on jo luotu kirjautumislinkki. Tarkasta sähköpostisi.',
    'sv-SE':
      'Användaren har redan en inloggningstoken. Kontrollera din e-post.',
  },
  unknownError: {
    'en-US': 'Failed to generate a login token. Try again later.',
    'fi-FI':
      'Kirjautumislinkin luominen epäonnistui. Yritä myöhemmin uudelleen.',
    'sv-SE':
      'Det gick inte att generera en inloggningstoken. Försök igen senare.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const EmailForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();

  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const doSendLoginLink = async (event: any) => {
    event.preventDefault();

    if (email.trim() === '') {
      toast(t('missingEmail', locale), {
        id: 'invalid-email',
      });
      return;
    }

    setIsLoading(true);
    try {
      const call = await fetch(PATHS.loginForgottenPasswordSendLoginLink, {
        method: 'POST',
        body: JSON.stringify({
          email,
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }
    } catch (error) {
      const message = (error as Error).message;
      console.log('message', message);
      setIsLoading(false);
      if (message === 'user-not-found') {
        toast.error(t('userNotFound', locale), {
          id: 'user-not-found',
        });
        return;
      }

      if (message === 'valid-login-token-exists') {
        toast.error(t('validTokenExists', locale), {
          id: 'valid-token-exists',
        });
        return;
      }

      // @TODO: this is probably on us if this fails... send to error tracking service
      toast.error(t('unknownError', locale), {
        id: 'unknown-error',
      });
      return;
    }

    router.push(PATHS.loginForgottenPasswordCheckYourEmail);
  };

  // Some browsers (like Firefox) seem to not trigger onChange if credentials
  // come auto-filled... Use useEffect to set values manually from pre-filled inputs.
  useEffect(() => {
    setEmail(emailInput.current?.value ?? '');
  }, []);

  return (
    <>
      <div className="p-4 sm:rounded-none">
        <h2 className="mb-4 mt-6 text-md font-bold text-white sm:mb-0 sm:ml-2 sm:mt-2 sm:text-lg sm:text-black">
          {t('provideYourEmail', locale)}
        </h2>
      </div>
      <div className="grow rounded-t-md bg-white p-6 sm:rounded-none">
        <form onSubmit={doSendLoginLink}>
          <div className="w-full">
            <input
              ref={emailInput}
              required
              className="mb-4 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-primary"
              type="text"
              placeholder={t('emailPlaceholder', locale)}
              id="email"
              value={email}
              maxLength={50}
              autoComplete="username"
              onChange={(event) => {
                handleEmailChange(event);
              }}
            />
            <div className="pb-4">
              <ButtonWithLoader
                type="submit"
                className="w-full rounded-full bg-primary p-2 font-normal text-white disabled:bg-primary-lighter-2"
                isLoading={isLoading}
                isDisabled={isLoading || email.trim() === ''}
              >
                {t('continue', locale)}
              </ButtonWithLoader>
            </div>
          </div>
        </form>
        <div className="relative mb-8 mt-4">
          <div className="absolute inset-x-0 mx-auto h-px w-3/4 bg-gray-300" />
          <div className="absolute inset-x-0 top-1/2 mx-auto w-10 -translate-y-1/2 bg-white px-2 text-center text-gray-400">
            {t('orText', locale)}
          </div>
        </div>
        <Link
          href="/login"
          className="mt-16 block text-center font-bold text-primary hover:underline"
        >
          {t('logIn', locale)}
        </Link>
      </div>
    </>
  );
};
