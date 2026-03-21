'use client';

// not perfectly composable, but a balance between reusing stuff and still being
// able to render this in the different contexts it is used (see "type")

import {CarouselRedirect} from './CarouselRedirect';
import {SeeTheGoodCarousel} from './SeeTheGoodCarousel';
import {type SeeTheGoodCarouselType} from './SeeTheGoodCarouselType';
import {CarouselContextProvider} from '@/components/carousel/CarouselContext';
import {type StrengthSlug} from '@/lib/strength-data';

type Parameters_ = {
  readonly type: SeeTheGoodCarouselType;
  readonly items: any; // @TODO could be specified
  readonly initialUserData?: any; // @TODO could be specified
  readonly initialStrengthSlug?: StrengthSlug;
};

export const Carousel = ({
  type,
  items,
  initialUserData,
  initialStrengthSlug,
}: Parameters_) => (
  //
  <CarouselContextProvider
    initialState={{
      selectedStrengthSlug: initialStrengthSlug,
      selectedUserData: initialUserData,
    }}
  >
    <SeeTheGoodCarousel items={items} type={type} />
    <CarouselRedirect type={type} />
  </CarouselContextProvider>
);
