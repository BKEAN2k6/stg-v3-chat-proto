'use client';

import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  chooseStrengthText: {
    'en-US': 'Choose a strength you recognise in yourself',
    'fi-FI': 'Valitse vahvuus, jonka tunnistat itsessäsi',
    'sv-SE': 'Välj en styrka som du känner igen hos dig själv',
  },
  moveOnText: {
    'en-US': "Great! Let's move on...",
    'fi-FI': 'Mahtavaa! Jatketaan...',
    'sv-SE': 'Bra jobbat! Låt oss gå vidare...',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const CarouselInstructionText = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div className="mb-4 flex items-center justify-center px-8">
      <div className="text-center">
        <div className="h-[70px] sm:h-[90px]">
          <h1 className="my-10 w-full max-w-2xl text-md font-semibold sm:text-xl md:text-lg">
            {t('chooseStrengthText', locale)}
          </h1>
        </div>
      </div>
    </div>
  );
};
