import Image from 'next/image';
import {getCookies} from 'next-client-cookies/server';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import lightning from '@/public/images/icons/lightning.png';
import {getLocaleCode} from '@/lib/locale';
import {LargerThanIcon} from '@/components/atomic/atoms/LargerThanIcon';
import {PATHS} from '@/constants.mjs';

const texts = {
  strengthSprintTitle: {
    'en-US': 'Strength sprint',
    'sv-SE': 'Styrkesprint',
    'fi-FI': 'Vahvuustuokio',
  },
  strengthSprintSubtitle: {
    'en-US': 'Start',
    'sv-SE': 'Starta',
    'fi-FI': 'Käynnistä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  params: {
    groupSlug: string;
  };
};

export default async function DashboardGroupGroupSlugToolsPage(props: Props) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {params} = props;
  const {groupSlug} = params;
  return (
    <div className="p-8">
      <a
        href={`${PATHS.strengthSessionCreate}?groupSlug=${groupSlug}`}
        className="flex items-center justify-between rounded-lg bg-[#fff4d1] p-4"
      >
        <div>
          <Image src={lightning} width={40} alt="lightning icon" />
        </div>
        <div className="ml-4 flex w-full flex-col">
          <span className="font-bold">{t('strengthSprintTitle', locale)}</span>
          <span>{t('strengthSprintSubtitle', locale)}</span>
        </div>
        <div>
          <LargerThanIcon className="h-5 w-5" />
        </div>
      </a>
      <AnalyticsEventRecorder event="router:group_tools_page_loaded" />
    </div>
  );
}
