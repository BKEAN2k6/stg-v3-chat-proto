'use client';

import {useMemo} from 'react';
import {useCookies} from 'next-client-cookies';
import {getLocaleCode} from '@/lib/locale';
import useCarousel from '@/components/carousel/useCarousel';

const texts = {
  chooseStrengthText: {
    'en-US': 'Choose a strength that you recognized in that moment',
    'fi-FI':
      'Valitse ensimmäinen vahvuus, jota hyödynsit onnistuneessa tilanteessa.',
    'sv-SE': 'Välj en styrka som du kände igen i det ögonblicket',
  },
  thinkOfAnotherText: {
    'en-US': 'Think of another strength that you recognized',
    'fi-FI': 'Valitse nyt toinen vahvuus, jota hyödynsit tilanteessa.',
    'sv-SE': 'Tänk på en annan styrka som du kände igen',
  },
  chooseOneMoreText: {
    'en-US': 'Choose one more strength that you recognized',
    'fi-FI': 'Valitse vielä kolmas vahvuus, jota tarvitsit tilanteessa.',
    'sv-SE': 'Välj ännu en styrka som du kände igen',
  },
  moveOnText: {
    'en-US': "Great! Let's move on...",
    'fi-FI': 'Mahtavaa!',
    'sv-SE': 'Bra jobbat! Låt oss gå vidare...',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const CarouselInstructionText = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {selectedStrengths} = useCarousel();
  const selectedItemsCount = useMemo(
    () => selectedStrengths?.length ?? 0,
    [selectedStrengths?.length],
  );
  return (
    <div className="mb-4 flex items-center justify-center px-8">
      <div className="text-center">
        <div className="h-[70px] sm:h-[90px]">
          <h1 className="my-10 w-full max-w-2xl text-md font-semibold sm:text-xl md:text-lg">
            {selectedItemsCount === 0 && t('chooseStrengthText', locale)}
            {selectedItemsCount === 1 && t('thinkOfAnotherText', locale)}
            {selectedItemsCount === 2 && t('chooseOneMoreText', locale)}
            {selectedItemsCount === 3 && t('moveOnText', locale)}
          </h1>
        </div>
      </div>
    </div>
  );
};
