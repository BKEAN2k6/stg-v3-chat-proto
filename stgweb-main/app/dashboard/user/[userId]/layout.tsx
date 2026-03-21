import {getCookies} from 'next-client-cookies/server';
import {DashboardLayoutMain} from '../../DashboardLayout';
import {UserHeader} from './UserHeader';
import {fetchUserData} from './_utils';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PATHS} from '@/constants.mjs';
import {sp} from '@/lib/utils';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  userNotFound: {
    'en-US': 'User not found',
    'sv-SE': 'Användaren hittades inte',
    'fi-FI': 'Käyttäjää ei löytynyt',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const getData = async (userId: string) =>
  serverDataQueryWrapper(sp(PATHS.user, {userId}), async (directus) =>
    fetchUserData(directus, userId),
  );

type Props = {
  children: React.ReactNode;
  params: {
    userId: string;
  };
};

export default async function DashboardHomeLayout(props: Props) {
  const {children, params} = props;
  const {userId} = params;
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const userData = await getData(userId);
  if (!userData) {
    return <>{t('userNotFound', locale)}</>;
  }

  return (
    <DashboardLayoutMain hasSidebarsOnSide="left">
      <section className="flex justify-center">
        <div className="flex w-full flex-col items-start gap-2 sm:min-w-[520px] sm:max-w-[640px]">
          <UserHeader user={userData} />
          <div className="w-full p-8">{children}</div>
        </div>
      </section>
    </DashboardLayoutMain>
  );
}
