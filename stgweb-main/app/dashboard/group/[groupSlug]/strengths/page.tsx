import {getCookies} from 'next-client-cookies/server';
import {fetchProfileData} from '../_utils';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {StrengthProfile} from '@/components/StrengthProfile/StrengthProfile';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {sp} from '@/lib/utils';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';

const texts = {
  noMomentsCaption: {
    'en-US': 'Document strengths to make them visible',
    'sv-SE': 'Dokumentera styrkor för att göra dem synliga',
    'fi-FI': 'Dokumentoi vahvuuksia ja tee ne näkyväksi',
  },
  noMomentsParagraph1: {
    'en-US': 'See the good and make progress visible.',
    'sv-SE': 'Se det som är bra och gör framstegen synliga.',
    'fi-FI': 'Huomaa hyvää ja tee edistymisenne näkyväksi',
  },
  invalidData: {
    'en-US': 'Invalid data',
    'sv-SE': 'Ogiltiga data',
    'fi-FI': 'Virheellinen profiili',
  },
  seeTheGood: {
    'en-US': 'See the good',
    'sv-SE': 'Se det goda',
    'fi-FI': 'Huomaa hyvä',
  },
  startStrengthSprint: {
    'en-US': 'Start strength sprint',
    'sv-SE': 'Starta styrkesprint',
    'fi-FI': 'Aloita vahvuustuokio',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const getData = async (groupSlug: string) =>
  serverDataQueryWrapper(
    sp(PATHS.groupStrengths, {groupSlug}),
    async (directus) => fetchProfileData(directus, groupSlug),
  );

type Props = {
  params: {
    groupSlug: string;
  };
};

export default async function DashboardGroupGroupSlugStrengthsPage(
  props: Props,
) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {params} = props;
  const {groupSlug} = params;
  const data = await getData(groupSlug);
  if (!data) {
    return <div className="mx-auto w-full max-w-md text-center" />;
  }

  const {strengths, topStrengths} = data;

  if (!strengths?.length) {
    return (
      <div className="flex w-full flex-col items-center px-8 pt-4 text-center">
        <h2 className="mb-2 mt-6 text-lg font-bold">
          {t('noMomentsCaption', locale)}
        </h2>
        <p className="mb-2 text-base">{t('noMomentsParagraph1', locale)}</p>
        <div className="mt-8 flex flex-col space-y-6">
          <LinkButtonWithLoader
            className="border border-primary text-primary"
            href={sp(PATHS.groupMoments, {groupSlug})}
          >
            {t('seeTheGood', locale)}
          </LinkButtonWithLoader>
          <LinkButtonWithLoader
            className="border border-primary text-primary"
            href={sp(PATHS.groupTools, {groupSlug})}
          >
            {t('startStrengthSprint', locale)}
          </LinkButtonWithLoader>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4">
        <StrengthProfile
          strengths={strengths}
          topStrengths={topStrengths}
          target="group"
        />
      </div>
      <AnalyticsEventRecorder event="router:group_strengths_page_loaded" />
    </>
  );
}
