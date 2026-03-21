'use client';

import {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {validatePassword} from '@/lib/validation';
import useAuth from '@/hooks/use-auth';
import {PasswordInput} from '@/components/PasswordInput';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

// NOTE: there is nearly identical form at /password-reset. If something
// fundamental here changes, make sure to reflect those in other places as well.

const texts = {
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
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const PasswordForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const searchParameters = useSearchParams();
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();

  const email = searchParameters.get('e');

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInvalidPassword(false);
    setErrorMessage('');
    setPassword(event.target.value);
  };

  const doSave = async (event: any) => {
    event.preventDefault();
    const directus = createClientSideDirectusClient();

    if (!validatePassword(password)) {
      const newErrorMessage = t('invalidPassword', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {id: 'invalid-password'});
      setIsInvalidPassword(true);
      return;
    }

    setIsInvalidPassword(false);

    setIsLoading(true);
    try {
      const loggedInUserId = getLoggedInUserId() ?? '';
      await refreshAuthIfExpired();
      await directus.items('directus_users').updateOne(loggedInUserId, {
        password,
      });
    } catch {
      setIsLoading(false);
      const newErrorMessage = t('saveFailed', locale);
      setErrorMessage(newErrorMessage);
      toast.error(newErrorMessage, {
        id: 'unknown-error',
      });
      return;
    }

    const role = searchParameters.get('r');
    if (role === 'member') {
      router.push(PATHS.strengthsOnboardingStart);
    } else {
      router.push(PATHS.profile);
    }
  };

  return (
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
  );
};
