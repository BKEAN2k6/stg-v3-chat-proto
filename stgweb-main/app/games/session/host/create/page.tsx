import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {CreateSessionWithGroup} from './CreateSessionWithGroup';
import {CreateSessionWithGeneratedGroup} from './CreateSessionWithGeneratedGroup';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {Varis} from '@/components/atomic/atoms/Varis';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  groupName: {
    'en-US': 'Group name',
    'fi-FI': 'Ryhmän nimi',
    'sv-SE': 'Gruppnamn',
  },
  groupNameHelp: {
    'en-US':
      'You should use for example the class identifier like "6B" to easily find this session later.',
    'fi-FI':
      'Käytä esimerkiksi luokan tunnusta (kuten 6B), löytääksesi session helposti myöhemmin',
    'sv-SE':
      'Du bör till exempel använda klassidentifieraren som "6B" för att enkelt hitta denna session senare.',
  },
  goBack: {
    'en-US': 'Go back',
    'fi-FI': 'Palaa takaisin',
    'sv-SE': 'Gå tillbaka',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  searchParams: {
    groupSlug: string;
  };
};

export default async function GamesSessionHostCreatePage(props: Props) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {searchParams} = props;
  const {groupSlug} = searchParams;

  return (
    <div className="min-safe-h-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen bg-primary-darker-1">
          <div className="flex flex-col items-center px-4">
            <div className="my-12 sm:my-24">
              <Varis color="#fdd662" height={64} width={64} />
            </div>
            <div className="flex w-full max-w-xs flex-col justify-center">
              {groupSlug ? (
                <CreateSessionWithGroup />
              ) : (
                <CreateSessionWithGeneratedGroup />
              )}
            </div>
            <Link
              href={PATHS.libraryRedirect}
              className="mb-16 mt-8 bg-primary-darker-1 text-xs font-bold text-white"
            >
              {t('goBack', locale)}
            </Link>
          </div>
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
