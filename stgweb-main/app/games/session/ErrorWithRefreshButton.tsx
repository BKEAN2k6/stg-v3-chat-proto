'use client';

import {useState} from 'react';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import {delay, randomBetween} from '@/lib/utils';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';

const texts = {
  errorText: {
    'en-US': 'Something seems to have gone wrong!',
    'fi-FI': 'Jokin näyttää menneen pieleen!',
    'sv-SE': 'Något verkar ha gått fel!',
  },
  tryAgain: {
    'en-US': 'Try again',
    'fi-FI': 'Yritä uudelleen',
    'sv-SE': 'Försök igen',
  },
  tryingAgain: {
    'en-US': 'Trying again. Just a moment...',
    'fi-FI': 'Yritetään uudellen. Hetkinen...',
    'sv-SE': 'Försöker igen. Bara ett ögonblick...',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const ErrorWithRefreshButton = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isLoading, setIsLoading] = useState(false);

  const handleTryAgain = async () => {
    setIsLoading(true);
    await delay(randomBetween(3000, 7000));
    window.location.reload();
  };

  return (
    <FullHeightCentered>
      <div className="flex flex-col">
        <p className="mb-8">
          {t(isLoading ? 'tryingAgain' : 'errorText', locale)}
        </p>
        <ButtonWithLoader
          className="bg-primary text-white"
          isLoading={isLoading}
          onClick={handleTryAgain}
        >
          {t('tryAgain', locale)}
        </ButtonWithLoader>
      </div>
    </FullHeightCentered>
  );
};
