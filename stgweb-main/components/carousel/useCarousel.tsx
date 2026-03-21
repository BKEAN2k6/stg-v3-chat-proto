// Using this to make it so changing one item doesn't cause all of them to
// change, and unncessary rerenders... Not 100% sure if it's working as expected
// though...
import {useContextSelector} from 'use-context-selector';
import {CarouselContext} from './CarouselContext';

export default function useCarousel() {
  const animatingAway = useContextSelector(CarouselContext, context => context?.[0].animatingAway); // prettier-ignore
  const selectedStrengths = useContextSelector(CarouselContext, context => context?.[0].selectedStrengths); // prettier-ignore
  const selectedUserData = useContextSelector(CarouselContext, context => context?.[0].selectedUserData); // prettier-ignore
  const selectedStrengthSlug = useContextSelector(CarouselContext, context => context?.[0].selectedStrengthSlug); // prettier-ignore
  const setCarouselState = useContextSelector(CarouselContext, context => context?.[1]); // prettier-ignore

  if (!setCarouselState) {
    throw new Error(
      'This component must be used within a CarouselContextProvider',
    );
  }

  return {
    setCarouselState,
    carouselState: {
      animatingAway,
      selectedStrengths,
      selectedUserData,
      selectedStrengthSlug,
    },
    animatingAway,
    selectedStrengths,
    selectedUserData,
    selectedStrengthSlug,
  };
}
