'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';
import {FullScreenModal} from '@/components/atomic/molecules/FullScreenModal';

const texts = {
  inbox: {
    'en-US': 'Inbox',
    'sv-SE': 'Inkorg',
    'fi-FI': 'Viestit',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly children: React.ReactNode;
};

const DashboardModalProfileInboxLayout = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {children} = props;
  const returnPath = PATHS.profile;
  const pathname = usePathname();
  return (
    <FullScreenModal returnPath={returnPath}>
      <div className="min-safe-h-screen flex flex-col">
        {pathname === PATHS.inbox && (
          <div className="flex w-full px-6 pb-4 pt-6">
            <div className="flex-none">
              <Link href={returnPath}>
                <ArrowRightIcon />
              </Link>
            </div>
            <div className="flex-1">
              <h1 className="text-center text-lg font-bold">
                {t('inbox', locale)}
              </h1>
            </div>
          </div>
        )}
        {children}
      </div>
    </FullScreenModal>
  );
};

export default DashboardModalProfileInboxLayout;
