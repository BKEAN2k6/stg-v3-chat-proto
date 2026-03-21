'use client';

import {useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {type SeeTheGoodCarouselType} from './SeeTheGoodCarouselType';
import {PATHS} from '@/constants.mjs';
import {objectToUrlSafeBase64} from '@/lib/utils';
import useCarousel from '@/components/carousel/useCarousel';

type Props = {
  readonly type: SeeTheGoodCarouselType;
};

export const CarouselRedirect = ({type}: Props) => {
  const {selectedStrengthSlug, selectedUserData} = useCarousel();
  const searchParameters = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (type === 'user' && selectedUserData) {
      setTimeout(() => {
        const newQuery = new URLSearchParams({
          target: searchParameters.get('target')!,
          'target-data': objectToUrlSafeBase64(selectedUserData),
        });
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.push(`${PATHS.seeTheGoodModalPickStrength}?${newQuery}`);
      }, 500);
    }
  }, [type, selectedUserData, searchParameters, router]);

  useEffect(() => {
    if (type === 'strength' && selectedStrengthSlug) {
      setTimeout(() => {
        const newQuery = new URLSearchParams({
          target: searchParameters.get('target')!,
          'target-data': searchParameters.get('target-data')!,
          strength: selectedStrengthSlug as string,
        });

        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.push(`${PATHS.seeTheGoodModalCustomize}?${newQuery}`);
      }, 500);
    }
  }, [type, selectedStrengthSlug, searchParameters, router]);

  return null;
};
