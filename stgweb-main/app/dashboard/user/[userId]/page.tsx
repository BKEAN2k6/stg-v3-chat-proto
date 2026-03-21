import {getCookies} from 'next-client-cookies/server';
import {UserProfilePage} from './UserProfilePage';
import {fetchUserData} from './_utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {getLocaleCode} from '@/lib/locale';
import {sp} from '@/lib/utils';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PATHS} from '@/constants.mjs';

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
  params: {
    userId: string;
  };
};

export default async function DashboardHomeMomentsPage(props: Props) {
  const {params} = props;
  const {userId} = params;
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const userData = await getData(userId);
  if (!userData) {
    return <>{t('userNotFound', locale)}</>;
  }

  return (
    <>
      <UserProfilePage user={userData} />
      <AnalyticsEventRecorder event="router:user_page_loaded" />
    </>
  );
}
