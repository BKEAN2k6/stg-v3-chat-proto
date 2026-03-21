'use client';

import Image from 'next/image';
import {useCookies} from 'next-client-cookies';
import welcomeRewardCrow from '@/public/images/rewards/welcome-reward-crow.png';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  collectionTitle: {
    'en-US': 'Collection',
    'sv-SE': 'Samling',
    'fi-FI': 'Kokoelma',
  },
  // Add more translations as needed
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const RewardCollection = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <div>
      <div className="mb-4 flex justify-between">
        <h3 className="text-xs font-bold uppercase">
          {t('collectionTitle', locale)}
        </h3>
        {/* <Link href="#" className="text-xs">
          Show all
        </Link> */}
      </div>
      <div id="intro-tour-step-3" className="flex">
        <div className="w-1/3">
          <div className="pr-4">
            <Image src={welcomeRewardCrow} alt="welcome reward crow laughing" />
          </div>
        </div>
        {/* <div className="w-1/3">
          <div className="px-2">
            <Image src={welcomeRewardCrow} alt="welcome reward crow laughing" />
          </div>
        </div>
        <div className="w-1/3">
          <div className="pl-4">
            <Image src={welcomeRewardCrow} alt="welcome reward crow laughing" />
          </div>
        </div> */}
      </div>
    </div>
  );
};
