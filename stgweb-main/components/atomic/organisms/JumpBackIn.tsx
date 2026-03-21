'use client';

import Image from 'next/image';
import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import {LargerThanIcon} from '../atoms/LargerThanIcon';
import {PATHS} from '@/constants.mjs';
import lightning from '@/public/images/icons/lightning.png';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  jumpBackIn: {
    'en-US': 'Jump back in',
    'sv-SE': 'Hoppa tillbaka in',
    'fi-FI': 'Palaa takaisin',
  },
  noOngoingTools: {
    'en-US': 'No ongoing tools',
    'sv-SE': 'Inga pågående verktyg',
    'fi-FI': 'Ei käynnissä olevia työkaluja',
  },
  startNewTool: {
    'en-US': 'Start a new tool',
    'sv-SE': 'Starta ett nytt verktyg',
    'fi-FI': 'Käynnistä uusi työkalu',
  },
  // Add more translations as needed
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const JumpBackIn = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <Link href={PATHS.library} className="block">
      <h3 className="text-xs font-bold uppercase">{t('jumpBackIn', locale)}</h3>
      <div
        id="intro-tour-step-2"
        className="mt-4 flex items-center justify-between rounded-lg bg-[#fff4d1] p-4"
      >
        <div>
          <Image src={lightning} width={40} alt="lightning icon" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold">{t('noOngoingTools', locale)}</span>
          <span>{t('startNewTool', locale)}</span>
        </div>
        <div>
          <LargerThanIcon className="h-5 w-5" />
        </div>
      </div>
    </Link>
  );
};
