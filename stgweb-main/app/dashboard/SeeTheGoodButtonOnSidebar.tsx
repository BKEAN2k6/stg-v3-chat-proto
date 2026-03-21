'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {PaperplaneIcon} from '@/components/atomic/atoms/PaperplaneIcon';

const texts = {
  seeTheGood: {
    'en-US': 'See the good',
    'sv-SE': 'Se det goda',
    'fi-FI': 'Huomaa hyvä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const SeeTheGoodButtonOnSidebar = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [pathname]);

  return (
    <LinkButtonWithLoader
      id="intro-tour-step-see-the-good-desktop"
      href={`${PATHS.seeTheGoodModal}?return=${encodeURIComponent(pathname)}`}
      className="w-full bg-primary p-4 text-white"
      isLoading={isLoading}
      onClick={() => {
        setIsLoading(true);
      }}
    >
      <div className="flex items-center space-x-2 text-[12px]">
        <PaperplaneIcon color="#fff" />
        <span>{t('seeTheGood', locale)}</span>
      </div>
    </LinkButtonWithLoader>
  );
};
