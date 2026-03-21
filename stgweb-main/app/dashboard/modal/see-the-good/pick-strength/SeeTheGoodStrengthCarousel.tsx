'use client';

import {Carousel} from '../Carousel';

type Parameters_ = {
  readonly items: any; // @TODO could be typed
  readonly initialUserData?: any; // @TODO could be typed
};

export const SeeTheGoodStrengthCarousel = ({
  items,
  initialUserData,
}: Parameters_) => (
  <Carousel type="strength" items={items} initialUserData={initialUserData} />
);
