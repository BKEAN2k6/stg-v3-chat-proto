'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {ShortCodeInput} from './ShortCodeInput';
import {PATHS, SUPPORT_EMAIL} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

const joinPath = (shortCode: string) =>
  `${PATHS.joinOrganizationStart}/${shortCode}?t=${Date.now()}`;

const texts = {
  codeError: {
    'en-US': `Unknown error. Please contact support at ${SUPPORT_EMAIL}`,
    'fi-FI': `Tuntematon virhe. Ota yhteyttä tukeen osoitteessa ${SUPPORT_EMAIL}`,
    'sv-SE': `Okänt fel. Kontakta supporten på ${SUPPORT_EMAIL}`,
  },
  invalidCode: {
    'en-US': 'Invalid code',
    'fi-FI': 'Virheellinen koodi',
    'sv-SE': 'Ogiltig kod',
  },
  inactiveCode: {
    'en-US': 'The code provided is not active',
    'fi-FI': 'Annettu koodi ei ole aktiivinen',
    'sv-SE': 'Den angivna koden är inte aktiv',
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

export const SignUpShortCodeForm = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [loading, setLoading] = useState(false);
  const [shortCode, setShortCode] = useState<string[]>(
    Array.from<string>({length: 6}).fill(''),
  );
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useRouter();
  const searchParameters = useSearchParams();

  const error = searchParameters.get('error');
  const time = searchParameters.get('t');

  const doSubmit = (code: string) => {
    setLoading(true);
    router.push(joinPath(code));
  };

  const onCodeChange = (newCode: string[]) => {
    setShortCode(newCode);
    setErrorMessage('');
    if (newCode.every((char) => !Number.isNaN(char) && char !== '')) {
      doSubmit(newCode.join(''));
    }
  };

  const doMaybeShowError = () => {
    if (error) {
      let errorText;

      switch (error) {
        case 'not-found': {
          errorText = t('invalidCode', locale);
          break;
        }

        case 'code-expired': {
          errorText = t('inactiveCode', locale);
          break;
        }

        default: {
          errorText = t('codeError', locale);
        }
      }

      toast.error(errorText, {id: 'error'});
      setErrorMessage(errorText);
    }
  };

  useEffect(() => {
    setLoading(false);
    doMaybeShowError();
  }, [time, error]);

  useEffect(() => {
    setTimeout(() => {
      doMaybeShowError();
    }, 1);
  }, []);

  return (
    <div>
      <div>
        <ShortCodeInput shortCode={shortCode} onCodeChange={onCodeChange} />
      </div>
      {errorMessage && (
        <div className="mt-4 text-center text-red-300">{errorMessage}</div>
      )}
      <div className="mt-6 flex justify-center">
        <ButtonWithLoader
          isDisabled={loading || shortCode.length !== 6}
          isLoading={loading}
          className="w-full max-w-xs p-2 sm:p-4"
          onClick={() => {
            doSubmit(shortCode.join(''));
          }}
        >
          {t('continueButton', locale)}
        </ButtonWithLoader>
      </div>
    </div>
  );
};
