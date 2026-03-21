import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {type StrengthSlug, StrengthTranslationMap} from '@/lib/strength-data';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';
import {FullScreenModal} from '@/components/atomic/molecules/FullScreenModal';
import {sp} from '@/lib/utils';

type Props = {
  readonly children: React.ReactNode;
  readonly params: {
    groupSlug: string;
    strength: StrengthSlug;
  };
};

const DashboardModalProfileStrengthDetailsStrengthLayout = (props: Props) => {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {children} = props;
  const {groupSlug, strength} = props.params;
  const returnPath = sp(PATHS.groupStrengths, {groupSlug});
  return (
    <FullScreenModal returnPath={returnPath}>
      <div className="min-safe-h-screen flex flex-col">
        <div className="flex w-full px-6 pb-4 pt-6">
          <div className="flex-none">
            <Link href={returnPath}>
              <ArrowRightIcon />
            </Link>
          </div>
          <div className="flex-1">
            <h1 className="text-center text-lg font-bold">
              {StrengthTranslationMap[strength][locale]}
            </h1>
          </div>
        </div>
        {children}
      </div>
    </FullScreenModal>
  );
};

export default DashboardModalProfileStrengthDetailsStrengthLayout;
