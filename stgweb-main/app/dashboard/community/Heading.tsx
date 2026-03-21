'use client';

import Link from 'next/link';
import useDashboard from '@/hooks/useDashboard';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {type LocaleCode} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';

const texts = {
  changeOrganization: {
    'en-US': 'Change organization',
    'sv-SE': 'Byt organisation',
    'fi-FI': 'Vaihda organisaatiota',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly locale: LocaleCode;
};

export const Heading = (props: Props) => {
  const {locale} = props;
  const {dashboardState} = useDashboard();
  const orgCount = dashboardState.userOrganizationCount ?? 1;

  if (!dashboardState.userActiveOrganizationName) {
    return null;
  }

  return (
    <div className="flex flex-row items-center space-x-4 px-4 sm:px-0">
      <Avatar size={80} name={dashboardState.userActiveOrganizationName} />
      <div className="flex flex-col">
        <h1 className="text-md font-bold">
          {dashboardState.userActiveOrganizationName}
        </h1>
        {orgCount > 1 && (
          <Link href={PATHS.organizationPicker} className="text-gray-500">
            {t('changeOrganization', locale)}
          </Link>
        )}
      </div>
    </div>
  );
};
