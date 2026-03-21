'use client';

import {useRouter} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useDashboard from '@/hooks/useDashboard';

export const StructureUpdateRedirect = () => {
  const {dashboardState} = useDashboard();
  const router = useRouter();

  useLegacyEffect(() => {
    if (dashboardState.useNov23StructureUpdate) {
      router.replace(PATHS.homeMoments);
    }
  }, []);

  return null;
};
