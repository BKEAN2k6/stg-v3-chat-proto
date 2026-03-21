import {type ReactNode, useState} from 'react';
import {createContext} from 'use-context-selector';
import {type StrengthSlug} from '@/lib/strength-data';

type CarouselState = {
  animatingAway?: boolean;
  // this one is used with the onboarding carousel
  selectedStrengths?: StrengthSlug[];
  // these are used with the onboarding carousel
  selectedUserData?: any; // @TODO this could be typed
  selectedStrengthSlug?: StrengthSlug;
};

export type CarouselContextType = [
  CarouselState,
  React.Dispatch<React.SetStateAction<CarouselState>>,
];

export const CarouselContext = createContext<CarouselContextType | undefined>(
  undefined,
);

type Props = {
  readonly children: ReactNode;
  readonly initialState?: CarouselState;
};

export const CarouselContextProvider = ({
  children,
  initialState = {},
}: Props) => (
  // eslint-disable-next-line react/hook-use-state
  <CarouselContext.Provider value={useState<CarouselState>(initialState)}>
    {children}
  </CarouselContext.Provider>
);
