import {getCookies} from 'next-client-cookies/server';
import {DashboardLayoutMain} from '../DashboardLayout';
import {SetV1LearnCookie} from './SetV1LearnCookie';
import {ToolList} from './ToolList';
import {StructureUpdateRedirect} from './StructureUpdateRedirect';
import {AnalyticsEventRecorder} from '@/app/dashboard/AnalyticsEventRecorder';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  libraryTitle: {
    'en-US': 'Library',
    'sv-SE': 'Bibliotek',
    'fi-FI': 'Kirjasto',
  },
  librarySubtitle: {
    'en-US': 'Ready for the new school year!',
    'sv-SE': 'Var redo för ett nytt skolår!',
    'fi-FI': 'Valmiina uuteen lukuvuoteen!',
  },
  libraryDescription1: {
    'en-US':
      'Here you will find tools to support you in learning and teaching positive pedagogy.',
    'sv-SE':
      'Här kan du hitta verktyg och läromaterial som hjälper dig att komma igång med att lära ut om styrkor, och med See the Good! metoden.',
    'fi-FI':
      'Täältä löydät työkaluja ja valmista oppimateriaalia, joiden avulla pääset näppärästi alkuun vahvuuksien opettamisessa sekä Huomaa hyvä! -menetelmässä.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const DashboardLibraryPage = () => {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  return (
    <>
      <DashboardLayoutMain hasSidebarsOnSide="left">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          {/* <div className="flex max-w-[980px] flex-col items-start gap-2"> */}
          <div className="flex max-w-3xl flex-col items-start gap-2">
            <h1 className="mb-4 text-xl font-bold">
              {t('libraryTitle', locale)}
            </h1>
            <h2 className="mb-2 text-lg font-bold">
              {t('librarySubtitle', locale)}
            </h2>
            <p className="mb-2 text-base">{t('libraryDescription1', locale)}</p>
          </div>
          <ToolList locale={locale} />
        </section>
      </DashboardLayoutMain>

      <SetV1LearnCookie />
      <StructureUpdateRedirect />
      <AnalyticsEventRecorder event="router:library_page_loaded" />
    </>
  );
};

export default DashboardLibraryPage;
