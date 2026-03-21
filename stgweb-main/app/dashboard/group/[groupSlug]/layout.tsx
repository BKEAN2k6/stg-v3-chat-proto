import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {DashboardLayoutMain} from '../../DashboardLayout';
import {GroupHeader} from './GroupHeader';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import {PATHS} from '@/constants.mjs';
import {sp} from '@/lib/utils';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  groupNotFound: {
    'en-US': 'Group not found',
    'sv-SE': 'Gruppen hittades inte',
    'fi-FI': 'Ryhmää ei löytynyt',
  },
  goBack: {
    'en-US': 'Go back',
    'sv-SE': 'Gå tillbaka',
    'fi-FI': 'Palaa takaisin',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  children: React.ReactNode;
  params: {
    groupSlug: string;
  };
};

const getData = async (groupSlug: string) =>
  serverDataQueryWrapper(sp(PATHS.group, {groupSlug}), async (directus) => {
    const groupQuery = await directus.items('group').readByQuery({
      filter: {
        slug: {
          _eq: groupSlug,
        },
      },
      fields: ['id', 'name', 'avatar', 'color'],
    });
    const group = groupQuery.data?.[0];
    if (!group) return undefined;
    return {
      name: group.name,
      color: group.color,
      avatar: group.avatar,
    };
  });

export default async function DashboardHomeGroupGroupSlugLayout(props: Props) {
  const {children, params} = props;
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const groupData = await getData(params.groupSlug);

  if (!groupData) {
    return (
      <DashboardLayoutMain hasSidebarsOnSide="left">
        <div className="flex flex-col items-center justify-center pt-24">
          <h1 className="text-xl font-bold">{t('groupNotFound', locale)}</h1>
          <Link href={PATHS.home} className="mt-2 text-primary">
            {t('goBack', locale)}
          </Link>
        </div>
      </DashboardLayoutMain>
    );
  }

  return (
    <DashboardLayoutMain hasSidebarsOnSide="both">
      <section className="flex justify-center">
        <div className="flex w-full flex-col items-start gap-2 sm:min-w-[520px] sm:max-w-[640px]">
          <GroupHeader groupData={groupData} />
          <div className="w-full pb-8 pt-4">{children}</div>
        </div>
      </section>
    </DashboardLayoutMain>
  );
}
