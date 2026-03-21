'use client';

import {useEffect, useState} from 'react';
import {usePathname} from 'next/navigation';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {get} from '@/lib/utils';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useDashboard from '@/hooks/useDashboard';

const DEBUG = process.env.NODE_ENV === 'development';

export const DashboardAccessRecorder = () => {
  const {dashboardState} = useDashboard();
  const [firstUpdateDone, setFirstUpdateDone] = useState(false);
  const pathname = usePathname();

  const doUpdateLastDashboardAccess = async () => {
    const lastUpdate = localStorage.getItem('last_dashboard_access_update');
    const now = new Date();

    if (lastUpdate && now.getTime() - Number(lastUpdate) < 5 * 60 * 1000) {
      if (DEBUG) {
        console.log('UpdateLastDasboardAccess: update skipped');
      } // prettier-ignore

      return;
    }

    const directus = createClientSideDirectusClient();
    if (!dashboardState.userId || !dashboardState.userActiveOrganizationId) {
      if (DEBUG) {
        console.log('UpdateLastDasboardAccess: not enough data to update last_dashboard_access');
      } // prettier-ignore

      return;
    }

    try {
      await refreshAuthIfExpired();
      const orgLink = await directus.items('user_to_organization').readByQuery({
        fields: ['id'],
        filter: {
          _and: [
            {user: dashboardState.userId},
            {organization: dashboardState.userActiveOrganizationId},
          ],
        },
      });
      const orgLinkId: string = get(orgLink || {}, 'data[0].id') ?? '';
      await directus.items('user_to_organization').updateOne(orgLinkId, {
        last_dashboard_access: now,
      });
      localStorage.setItem(
        'last_dashboard_access_update',
        now.getTime().toString(),
      );
    } catch {
      if (DEBUG) {
        console.log('could not update last_dashboard_access');
      }
    }

    setFirstUpdateDone(true);
    if (DEBUG) {
      console.log('UpdateLastDasboardAccess: update done');
    } // prettier-ignore
  };

  useLegacyEffect(() => {
    setTimeout(() => {
      doUpdateLastDashboardAccess();
    }, 3000);
  }, []);

  useEffect(() => {
    if (firstUpdateDone) {
      doUpdateLastDashboardAccess();
    }
  }, [pathname]);

  return null;
};
