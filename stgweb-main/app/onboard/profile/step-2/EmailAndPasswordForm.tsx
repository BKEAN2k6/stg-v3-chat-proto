'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {
  atSignDotDashAndPlus,
  latinAlphabet,
  numbers,
  validateAndNormalizeInput,
  validateEmail,
  validatePassword,
} from '@/lib/validation';
import useAuth from '@/hooks/use-auth';
import {PasswordInput} from '@/components/PasswordInput';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  email: {
    'en-US': 'Email',
    'sv-SE': 'E-post',
    'fi-FI': 'Sähköposti',
  },
  password: {
    'en-US': 'Password',
    'sv-SE': 'Lösenord',
    'fi-FI': 'Salasana',
  },
  invalidEmail: {
    'en-US': 'Invalid email',
    'sv-SE': 'Ogiltig e-post',
    'fi-FI': 'Virheellinen sähköposti',
  },
  invalidPassword: {
    'en-US': 'Invalid password',
    'sv-SE': 'Ogiltigt lösenord',
    'fi-FI': 'Virheellinen salasana',
  },
  sameEmailAndPassword: {
    'en-US': 'Password cannot be the same as your email.',
    'sv-SE': 'Lösenordet kan inte vara samma som din e-post.',
    'fi-FI': 'Salasana ei voi olla sama kuin sähköpostiosoitteesi.',
  },
  existingEmail: {
    'en-US': 'Email address is already registered',
    'sv-SE': 'E-postadressen är redan registrerad',
    'fi-FI': 'Sähköpostiosoite on jo rekisteröity',
  },
  unknownError: {
    'en-US': 'Failed to save profile details. Try again later.',
    'sv-SE': 'Det gick inte att spara profiluppgifter. Försök igen senare.',
    'fi-FI':
      'Profiilitietojen tallentaminen epäonnistui. Yritä myöhemmin uudelleen.',
  },
  continueButton: {
    'en-US': 'Continue',
    'sv-SE': 'Fortsätt',
    'fi-FI': 'Jatka',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const EmailAndPasswordForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalidEmail(false);
    setErrorMessage('');
    setEmail(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabet}${numbers}${atSignDotDashAndPlus}`,
      ),
    );
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalidPassword(false);
    setErrorMessage('');
    setPassword(event.target.value);
  };

  const doSave = async (event: any) => {
    event.preventDefault();
    const directus = createClientSideDirectusClient();

    if (!validateEmail(email)) {
      const newErrorMessage = t('invalidEmail', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {id: 'invalid-email'});
      setIsInvalidEmail(true);
      return;
    }

    setIsInvalidEmail(false);

    if (!validatePassword(password)) {
      const newErrorMessage = t('invalidPassword', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {id: 'invalid-password'});
      setIsInvalidPassword(true);
      return;
    }

    if (email.trim() === password) {
      const newErrorMessage = t('sameEmailAndPassword', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {
        id: 'invalid-password-2',
      });
      setIsInvalidPassword(true);
      return;
    }

    setIsInvalidPassword(false);

    setIsLoading(true);
    try {
      const loggedInUserId = getLoggedInUserId() ?? '';
      await refreshAuthIfExpired();
      await directus.items('directus_users').updateOne(loggedInUserId, {
        email: email.trim().toLowerCase(),
        password,
        expires_at: null,
      });
    } catch (error) {
      setIsLoading(false);
      const message = (error as Error).message;
      if (
        message ===
        'Value for field "email" in collection "directus_users" has to be unique.'
      ) {
        const newErrorMessage = t('existingEmail', locale);
        setErrorMessage(newErrorMessage);
        toast.error(newErrorMessage, {
          style: {
            backgroundColor: 'hsl(var(--primary-lighter-1))',
            color: 'white',
          },
          className: 'bg-primary',
          id: 'existing-email',
        });
        return;
      }

      // @TODO: this is probably on us if this fails... send to error tracking service
      const newErrorMessage = t('unknownError', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {
        id: 'unknown-error',
      });
      return;
    }

    router.push(`${PATHS.profile}?tour=intro1`);
  };

  return (
    <form onSubmit={doSave}>
      <div className="mb-4 mt-5 flex max-w-md flex-col justify-center px-2 text-center">
        <input
          className={cn(
            'form-control mb-2 mr-4 h-12 w-full rounded border text-center font-mono text-md',
            isInvalidEmail && 'border-red-800',
          )}
          type="text"
          id="email"
          value={email}
          placeholder={t('email', locale)}
          maxLength={50}
          onChange={(event) => {
            handleEmailChange(event);
          }}
        />
        <PasswordInput
          isInvalidPassword={isInvalidPassword}
          password={password}
          handlePasswordChange={handlePasswordChange}
        />
      </div>
      <div className="mb-4 flex justify-center text-red-800">
        {errorMessage}
      </div>
      <div className="flex justify-center">
        <ButtonWithLoader
          type="submit"
          id="continue-button"
          className="w-full max-w-xs bg-primary p-2 text-white sm:p-4"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {t('continueButton', locale)}
        </ButtonWithLoader>
      </div>
    </form>
  );
};
