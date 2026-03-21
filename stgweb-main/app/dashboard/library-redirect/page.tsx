'use client';

import {useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import useDashboard from '@/hooks/useDashboard';
import useLegacyEffect from '@/hooks/use-legacy-effect';

export default async function DashboardGroupPage() {
  const {dashboardState} = useDashboard();
  const router = useRouter();
  useLegacyEffect(() => {
    if (dashboardState.useNov23StructureUpdate) {
      router.replace(PATHS.homeTools);
    } else {
      router.replace(PATHS.library);
    }
  }, []);
  return null;
}
