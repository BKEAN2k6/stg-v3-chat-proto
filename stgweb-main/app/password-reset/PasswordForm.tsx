'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {directusClientSideLogin} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {validatePassword} from '@/lib/validation';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useGlobal from '@/hooks/useGlobal';
import {PasswordInput} from '@/components/PasswordInput';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {Loader} from '@/components/atomic/atoms/Loader';

// NOTE: there is nearly identical form at /start/user. If something fundamental
// here changes, make sure to reflect those in other places as well.

const texts = {
  resetPasswordTitle: {
    'en-US': 'Update your account password',
    'fi-FI': 'Päivitä tilisi salasana',
    'sv-SE': 'Uppdatera lösenordet för ditt konto',
  },
  emailPlaceholder: {
    'en-US': 'Email',
    'fi-FI': 'Sähköposti',
    'sv-SE': 'E-post',
  },
  invalidPassword: {
    'en-US': 'Invalid password',
    'fi-FI': 'Virheellinen salasana',
    'sv-SE': 'Ogiltigt lösenord',
  },
  saveFailed: {
    'en-US': 'Failed to save profile details. Try again later.',
    'fi-FI':
      'Profiilitietojen tallennus epäonnistui. Yritä myöhemmin uudelleen.',
    'sv-SE': 'Misslyckades att spara profiluppgifter. Försök igen senare.',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
  userNotFound: {
    'en-US': 'User was not found.',
    'fi-FI': 'Käyttäjää ei löytynyt.',
    'sv-SE': 'Användaren hittades inte.',
  },
  tryAgain: {
    'en-US': 'Try again',
    'fi-FI': 'Yritä uudelleen',
    'sv-SE': 'Försök igen',
  },
  goBackToStart: {
    'en-US': 'Go back to start',
    'fi-FI': 'Palaa aloitussivulle',
    'sv-SE': 'Gå tillbaka till start',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const PasswordForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const searchParameters = useSearchParams();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string>('');
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [allowTryAgain, setAllowTryAgain] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const router = useRouter();

  const {setGlobalState} = useGlobal();

  const token = searchParameters.get('token');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalidPassword(false);
    setErrorMessage('');
    setPassword(event.target.value);
  };

  const doSave = async (event: any) => {
    event.preventDefault();

    if (!validatePassword(password)) {
      const newErrorMessage = t('invalidPassword', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {id: 'invalid-password'});
      setIsInvalidPassword(true);
      return;
    }

    setIsInvalidPassword(false);

    setIsLoading(true);

    // call the password reset action with the token and a new password
    try {
      const call = await fetch(PATHS.passwordResetResetPassword, {
        method: 'POST',
        body: JSON.stringify({
          token,
          password,
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }
    } catch {
      setIsLoading(false);
      setAllowTryAgain(true);
      const newErrorMessage = t('saveFailed', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {
        id: 'unknown-error',
      });
      return;
    }

    // log the user in with the new password
    try {
      const authCall = await directusClientSideLogin({
        email: email ?? '',
        password,
      });
      setGlobalState({userAuthToken: authCall.access_token});
    } catch (error) {
      setIsLoading(false);
      const message = (error as Error).message;
      if (message === 'Invalid user credentials.') {
        toast.error(t('invalidCredentials', locale), {
          id: 'invalid-credentials',
        });
        return;
      }

      console.error((error as Error).message);
      toast.error(t('unknownError', locale), {
        id: 'unknown-error',
      });
      return;
    }

    router.push(PATHS.community);
  };

  useLegacyEffect(() => {
    const run = async () => {
      try {
        const call = await fetch(PATHS.passwordResetCheckToken, {
          method: 'POST',
          body: JSON.stringify({
            token,
          }),
        });
        if (!call.ok) {
          setErrorMessage(t('userNotFound', locale));
        }

        const body = await call.json();
        setEmail(body.userEmail);
      } catch {
        setErrorMessage(t('userNotFound', locale));
      }

      setIsCheckingToken(false);
    };

    run();
  }, []);

  if (isCheckingToken) {
    return (
      <div className="mt-8 flex w-full justify-center">
        <Loader />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mt-8 flex w-full justify-center">
        <div>
          <p className="mb-8 text-md text-white">{errorMessage}</p>
          {allowTryAgain && (
            <>
              <a
                href="#"
                className=" text-white underline"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.reload();
                }}
              >
                {t('tryAgain', locale)}
              </a>
              <br />
              <br />
            </>
          )}
          <a href="/" className="text-white underline">
            {t('goBackToStart', locale)}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="mt-10 w-full max-w-2xl text-lg font-semibold text-white sm:text-xl">
        {t('resetPasswordTitle', locale)}
      </h1>
      <form onSubmit={doSave}>
        <div className="mb-4 mt-5 flex max-w-md flex-col justify-center px-2 text-center">
          {email && (
            <input
              disabled
              className="form-control mb-2 mr-4 h-12 w-full rounded border text-center font-mono text-md"
              type="text"
              id="email"
              value={email}
              placeholder={t('emailPlaceholder', locale)}
            />
          )}
          <PasswordInput
            isInvalidPassword={isInvalidPassword}
            password={password}
            handlePasswordChange={handlePasswordChange}
            passwordInstructionsClassName="text-white"
            passwordCheckValidClassName="text-green-300"
            passwordCheckInvalidClassName="text-red-300"
          />
        </div>
        <div className="mb-4 flex justify-center text-red-300">
          {errorMessage}
        </div>
        <div className="flex justify-center">
          <ButtonWithLoader
            type="submit"
            className="w-full max-w-xs bg-white p-2 text-primary sm:p-4"
            isLoading={isLoading}
            isDisabled={isLoading}
          >
            {t('continueButton', locale)}
          </ButtonWithLoader>
        </div>
      </form>
    </>
  );
};
