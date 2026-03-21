import Image from 'next/image';
import {getCookies} from 'next-client-cookies/server';
import {fetchInboxMoments} from '../../modal/profile/inbox/_utils';
import {InboxList} from './InboxList';
import {PATHS} from '@/constants.mjs';
import inboxCrow from '@/public/images/misc/inbox-crow.jpg';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';

const texts = {
  inbox: {
    'en-US': 'Inbox',
    'sv-SE': 'Inkorg',
    'fi-FI': 'Viestit',
  },
  nothingHereYet: {
    'en-US':
      'Nothing here yet! Your received strength feedback will show up here.',
    'sv-SE':
      'Inget här ännu! Din mottagna styrkefeedback kommer att visas här.',
    'fi-FI':
      'Ei vielä mitään täällä! Saamasi vahvuuspalautteet tulevat näkyviin tälle sivulle.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PATH = PATHS.inbox;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) => fetchInboxMoments(directus));

export default async function DashboardInboxPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const moments = (await getData()) || [];
  return (
    <>
      <div className="w-full">
        <h1 className="mb-4 text-xl font-bold">{t('inbox', locale)}</h1>
        {/* here's an example of using locale for components that are not
          client-components. We need to read to cookies on the page component
          here, and pass it on as a prop to the non-client component */}
        {moments.length > 0 ? (
          <InboxList moments={moments} locale={locale} />
        ) : (
          <>
            <p className="text-base">{t('nothingHereYet', locale)}</p>
            <Image src={inboxCrow} alt="Crow" width={480} />
          </>
        )}
      </div>
      <AnalyticsEventRecorder event="router:inbox_page_loaded" />
    </>
  );
}
