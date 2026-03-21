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
import {
  latinAlphabetWithSpecials,
  spaceAndDash,
  validateAndNormalizeInput,
} from '@/lib/validation';
import useAuth from '@/hooks/use-auth';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const texts = {
  fillInYourName: {
    'en-US': 'Fill in your name',
    'fi-FI': 'Täytä nimesi',
    'sv-SE': 'Fyll i ditt namn',
  },
  firstNamePlaceholder: {
    'en-US': 'First name',
    'fi-FI': 'Etunimi',
    'sv-SE': 'Förnamn',
  },
  lastNamePlaceholder: {
    'en-US': 'Last name',
    'fi-FI': 'Sukunimi',
    'sv-SE': 'Efternamn',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
  saveFailed: {
    'en-US': 'Failed to save name. Try again later.',
    'fi-FI': 'Nimen tallennus epäonnistui. Yritä myöhemmin uudelleen.',
    'sv-SE': 'Misslyckades att spara namn. Försök igen senare.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const NameForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();

  const handleFirstNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setFirstName(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${spaceAndDash}`,
      ),
    );
  };

  const handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${spaceAndDash}`,
      ),
    );
  };

  const doSave = async (event: any) => {
    event.preventDefault();
    const directus = createClientSideDirectusClient();
    if (firstName?.trim() === '' || lastName?.trim() === '') {
      toast(t('fillInYourName', locale), {id: 'invalid-name'});
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUserId = getLoggedInUserId() ?? '';
      await refreshAuthIfExpired();
      await directus.items('directus_users').updateOne(loggedInUserId, {
        first_name: firstName?.trim(),
        last_name: lastName?.trim(),
      });
    } catch {
      setIsLoading(false);
      toast.error(t('saveFailed', locale), {
        id: 'unknown-error',
      });
      return;
    }

    router.push(PATHS.strengthsOnboardingStart);
  };

  return (
    <form onSubmit={doSave}>
      <div className="mb-10 mt-5 flex max-w-md flex-col justify-center px-2 text-center sm:flex-row">
        <input
          autoFocus
          className="form-control mb-2 mr-4 h-12 w-full rounded border text-center font-mono text-md"
          type="text"
          id="firstname"
          value={firstName}
          placeholder={t('firstNamePlaceholder', locale)}
          maxLength={50}
          onChange={(event) => {
            handleFirstNameChange(event);
          }}
        />
        <input
          className="form-control h-12 w-full rounded border text-center font-mono text-md"
          type="text"
          id="lastname"
          value={lastName}
          placeholder={t('lastNamePlaceholder', locale)}
          maxLength={50}
          onChange={(event) => {
            handleLastNameChange(event);
          }}
        />
      </div>
      <div className="flex justify-center">
        <ButtonWithLoader
          id="continue-button"
          type="submit"
          className="w-full max-w-xs p-2 sm:p-4"
          isLoading={isLoading}
          isDisabled={isLoading}
        >
          {t('continueButton', locale)}
        </ButtonWithLoader>
      </div>
    </form>
  );
};
