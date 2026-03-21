'use client';

import {CarouselRedirect} from './CarouselRedirect';
import {OnboardingStrengthCarousel} from './OnboardingStrengthCarousel';
import {CarouselContextProvider} from '@/components/carousel/CarouselContext';

type Parameters_ = {
  readonly items: any; // @TODO this could be typed
};

export const Carousel = ({items}: Parameters_) => (
  //
  <CarouselContextProvider>
    <OnboardingStrengthCarousel items={items} />
    <CarouselRedirect />
  </CarouselContextProvider>
);
