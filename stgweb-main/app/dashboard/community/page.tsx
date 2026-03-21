import {getCookies} from 'next-client-cookies/server';
import {DashboardLayoutMain} from '../DashboardLayout';
import {Heading} from './Heading';
import {MomentList} from './MomentList';
import {fetchCommunityMoments} from './_utils';
import {StructureUpdateRedirect} from './StructureUpdateRedirect';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PATHS} from '@/constants.mjs';

const texts = {
  communitySubtitle: {
    'en-US': 'Why is the page empty?',
    'sv-SE': 'Varför finns här ingenting?',
    'fi-FI': 'Miksi sivu on tyhjä?',
  },
  communityDescription1: {
    'en-US':
      'Here you will find the strengths seen and shared around your whole community.',
    'sv-SE':
      'Här i din skolgemenskap (i ditt skolteam) hittar du de individuella eller gemensamma styrkor som ni har identifierat.',
    'fi-FI':
      'Täältä löydät kouluyhteisössäsi ja sen jäsenissä huomatut ja yhteisesti jaetut vahvuudet.',
  },
  communityDescription2: {
    'en-US':
      'We do not have enough data on your school yet, but check back here after a while to see what has been happening.',
    'sv-SE':
      'Vi har inte tillräckligt med data från din skola. Titta in lite senare, du kanske märker hur mycket fina saker som händer i din skola.',
    'fi-FI':
      'Meillä ei ole vielä riittävästi dataa koulustasi. Tule kuitenkin kurkistamaan pian uudelleen!  Voit huomata, mitä kaikkea hyvää koulussasi on tapahtunut.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const PATH = PATHS.community;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) =>
    fetchCommunityMoments(directus),
  );

export default async function DashboardCommunityPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const moments = await getData();
  return (
    <>
      <DashboardLayoutMain hasSidebarsOnSide="left">
        <section className="grid items-center gap-6 pb-8 pt-6 sm:px-8 lg:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <Heading locale={locale} />
            {moments?.length ? (
              <MomentList moments={moments} />
            ) : (
              <div className="px-8 pt-4">
                <h2 className="mb-2 mt-6 text-lg font-bold">
                  {t('communitySubtitle', locale)}
                </h2>
                <p className="mb-2 text-base">
                  {t('communityDescription1', locale)}
                </p>
                <p className="mb-2 text-base">
                  {t('communityDescription2', locale)}
                </p>
              </div>
            )}
          </div>
        </section>
      </DashboardLayoutMain>
      <StructureUpdateRedirect />
      <AnalyticsEventRecorder event="router:community_page_loaded" />
    </>
  );
}
