'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {DATA_API_URL, PATHS, PUBLIC_URL} from '@/constants.mjs';
import {type UserType} from '@/types/auth';
import {directusClientSideLogin} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {cookieDomain} from '@/lib/utils';
import useGlobal from '@/hooks/useGlobal';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  logInToStart: {
    'en-US': 'Log in to start seeing the good!',
    'fi-FI': 'Kirjaudu sisään ja aloita hyvän huomaaminen!',
    'sv-SE': 'Logga in för att börja se det goda!',
  },
  emailPlaceholder: {
    'en-US': 'Email',
    'fi-FI': 'Sähköposti',
    'sv-SE': 'E-post',
  },
  passwordPlaceholder: {
    'en-US': 'Password',
    'fi-FI': 'Salasana',
    'sv-SE': 'Lösenord',
  },
  missingEmail: {
    'en-US': 'Fill in email',
    'fi-FI': 'Täytä sähköpostiosoite',
    'sv-SE': 'Fyll i e-post',
  },
  missingPassword: {
    'en-US': 'Fill in password',
    'fi-FI': 'Täytä salasana',
    'sv-SE': 'Fyll i lösenord',
  },
  invalidCredentials: {
    'en-US': 'Invalid credentials',
    'fi-FI': 'Virheelliset tunnukset',
    'sv-SE': 'Ogiltiga uppgifter',
  },
  unknownError: {
    'en-US': 'Failed to log in. Try again later',
    'fi-FI': 'Sisäänkirjautuminen epäonnistui. Yritä myöhemmin uudelleen',
    'sv-SE': 'Inloggningen misslyckades. Försök igen senare',
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
  forgottenCredentials: {
    'en-US': 'Forgotten password?',
    'fi-FI': 'Unohtuiko salasana?',
    'sv-SE': 'Glömt lösenord?',
  },
  loginThroughSkolon: {
    'en-US': 'Log in through Skolon',
    'fi-FI': 'Kirjaudu Skolonin kautta',
    'sv-SE': 'Logga in via Skolon',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const LoginForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const {setGlobalState} = useGlobal();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle the password visibility state
  };

  const doLogin = async (event: any) => {
    event.preventDefault();
    // this might be a leftover from previous session...
    localStorage.removeItem('attemptedToFixSession');

    if (email.trim() === '') {
      toast(t('missingEmail', locale), {
        id: 'invalid-email',
      });

      return;
    }

    if (password.trim() === '') {
      toast(t('missingPassword', locale), {
        id: 'invalid-password',
      });

      return;
    }

    setIsLoading(true);
    try {
      const authCall = await directusClientSideLogin({email, password});
      setGlobalState({userAuthToken: authCall.access_token});
      const userType: UserType = 'dashboard-user';
      cookies.set('user_type', userType, {
        expires: 365,
        domain: cookieDomain(),
      });
    } catch (error) {
      setIsLoading(false);
      const message = (error as Error).message;
      if (
        message === 'Invalid user credentials.' ||
        message.includes('Invalid payload')
      ) {
        toast.error(t('invalidCredentials', locale), {
          id: 'invalid-credentials',
        });
        return;
      }

      // @TODO: this is probably on us if this fails... send to error tracking service
      toast.error(t('unknownError', locale), {
        id: 'unknown-error',
      });
      return;
    }

    router.push(PATHS.loginRedirect);
  };

  const publicURL = PUBLIC_URL;
  const dataApiURL = DATA_API_URL;
  const redirectURL = `${publicURL}/auth/oauth/skolon`;
  const signInThroughSkolonURL = `${dataApiURL}/auth/login/skolon?redirect=${encodeURIComponent(
    redirectURL,
  )}`;

  // Some browsers (like Firefox) seem to not trigger onChange if credentials
  // come auto-filled... Use useEffect to set values manually from pre-filled inputs.
  useEffect(() => {
    setEmail(emailInput.current?.value ?? '');
    setPassword(passwordInput.current?.value ?? '');
  }, []);

  return (
    <>
      <div className="p-4 sm:rounded-none">
        <h2 className="mb-4 mt-6 text-md font-bold text-white sm:mb-0 sm:ml-2 sm:mt-2 sm:text-lg sm:text-black">
          {t('logInToStart', locale)}
        </h2>
      </div>
      <div className="grow rounded-t-md bg-white p-6 sm:rounded-none">
        <form onSubmit={doLogin}>
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
            <div className="relative">
              <input
                ref={passwordInput}
                required
                className="mb-4 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-primary"
                type={isPasswordVisible ? 'text' : 'password'} // Dynamically set the type based on isPasswordVisible state
                placeholder={t('passwordPlaceholder', locale)}
                id="password"
                value={password}
                autoComplete="current-password"
                onChange={(event) => {
                  handlePasswordChange(event);
                }}
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {isPasswordVisible ? '🙈' : '👁'}
              </span>
            </div>
            <div className="pb-4">
              <ButtonWithLoader
                type="submit"
                className="w-full rounded-full bg-primary p-2 font-normal text-white disabled:bg-primary-lighter-2"
                isLoading={isLoading}
                isDisabled={
                  isLoading || email.trim() === '' || password.trim() === ''
                }
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
          href="/login/forgotten-password"
          className="mt-16 block text-center font-bold text-primary hover:underline"
        >
          {t('forgottenCredentials', locale)}
        </Link>
        <a
          href={signInThroughSkolonURL}
          className="mt-8 block text-center font-bold text-primary hover:underline"
        >
          {t('loginThroughSkolon', locale)}
        </a>
      </div>
    </>
  );
};
