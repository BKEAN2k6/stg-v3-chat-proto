'use client';

import {useEffect, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import useCarousel from '../../../../components/carousel/useCarousel';
import {PATHS} from '@/constants.mjs';

export const CarouselRedirect = () => {
  const {selectedStrengths} = useCarousel();
  const router = useRouter();

  const selectedItemsCount = useMemo(
    () => selectedStrengths?.length ?? 0,
    [selectedStrengths?.length],
  );

  useEffect(() => {
    if (selectedItemsCount === 3) {
      setTimeout(() => {
        const strengthQuery = new URLSearchParams({
          strengths: selectedStrengths?.join(',') ?? '',
        });
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.push(`${PATHS.strengthsOnboardingStep4}?${strengthQuery}`);
      }, 1500);
    }
  }, [selectedItemsCount, selectedStrengths, router]);

  return null;
};
