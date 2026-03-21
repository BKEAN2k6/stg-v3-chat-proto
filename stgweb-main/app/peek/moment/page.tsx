import {getCookies} from 'next-client-cookies/server';
import {MomentPage} from './MomentPage';
import {dbMomentToMomentCardData} from '@/lib/data-transformation';
import {getLocaleCode} from '@/lib/locale';
import {adminServerDataQueryWrapper} from '@/lib/server-only-utils';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const getMoment = async (token: string) =>
  adminServerDataQueryWrapper(async (directus) => {
    const momentQuery = await directus.items('swl_moment').readByQuery({
      fields: ['*', 'files.directus_files.*', 'strengths.*', 'created_by.*'],
      filter: {
        peek_access_token: {
          _eq: token,
        },
      },
      limit: 1,
      sort: ['-date_created'] as never,
    });
    // console.log(JSON.stringify(momentQuery, null, 2))
    const moment = momentQuery?.data?.[0];
    return {
      moment: dbMomentToMomentCardData(moment),
      hasBeenAccessed: Boolean(moment.peek_accessed_at),
    };
  });

export default async function ViewMomentTokenPage() {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const token = cookies.get('peek_access_token');

  // NOTE: if we make it here, the user is not logged in at all OR is logged in
  // with a user that doesn't have access to the moment in question

  // get moment data (use admin directus client)
  const data = await getMoment(token);
  const moment = data?.moment;
  const hasBeenAccessed = data?.hasBeenAccessed ?? false;

  if (!moment) {
    return (
      <div className="min-safe-h-screen flex items-center justify-center">
        failed to get moment
      </div>
    );
  }

  return (
    <div className="min-safe-h-screen w-screen">
      <PageTransitionWrapper>
        <div className="min-safe-h-screen flex items-center justify-center">
          <MomentPage
            moment={moment}
            peekAccessToken={token}
            hasBeenAccessed={hasBeenAccessed}
            locale={locale}
          />
        </div>
      </PageTransitionWrapper>
    </div>
  );
}
