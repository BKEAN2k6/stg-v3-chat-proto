import {getCookies} from 'next-client-cookies/server';
import {SetV1LearnCookie} from './v1-learn/SetV1LearnCookie';
import {ToolList} from './ToolList';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  tools: {
    'en-US': 'Tools',
    'sv-SE': 'Verktyg',
    'fi-FI': 'Työkalut',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export default async function DashboardHomeToolsPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  return (
    <div className="p-8">
      <div className="flex max-w-3xl flex-col items-start gap-2">
        <h1 className="mb-4 text-xl font-bold">{t('tools', locale)}</h1>
      </div>
      <ToolList locale={locale} />

      <SetV1LearnCookie />
      <AnalyticsEventRecorder event="router:home_tools_page_loaded" />
    </div>
  );
}
