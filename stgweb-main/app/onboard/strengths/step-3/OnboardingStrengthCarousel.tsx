'use client';

import {CarouselInstructionText} from './CarouselInstructionText';
import {CarouselSelectedItems} from './CarouselSelectedItems';
import {type StrengthSlug} from '@/lib/strength-data';
import {cn, groupArray} from '@/lib/utils';
import {StrengthIconAndName} from '@/components/atomic/molecules/StrengthIconAndName';
import {CarouselItem} from '@/components/carousel/CarouselItem';
import {CarouselItemList} from '@/components/carousel/CarouselItemList';
import {CarouselPage} from '@/components/carousel/CarouselPage';
import {CarouselSlider} from '@/components/carousel/CarouselSlider';
import useCarousel from '@/components/carousel/useCarousel';

type SlideItem = {
  data: {
    slug: StrengthSlug;
  };
  isPlaceholder?: boolean;
};

type Parameters_ = {
  readonly items: any; // @TODO this could be typed
};

export const OnboardingStrengthCarousel = ({items}: Parameters_) => {
  const {carouselState, selectedStrengths, setCarouselState} = useCarousel();

  const groupedItems = groupArray(items, 4) as Array<{items: SlideItem[]}>;

  return (
    <>
      <CarouselSelectedItems />
      <CarouselInstructionText />
      <CarouselSlider
        itemCount={items.filter((x: any) => !x.isPlaceholder).length}
        className={cn(selectedStrengths?.length === 3 && 'pointer-events-none')}
      >
        {groupedItems.map((slideGroup, groupIndex) => (
          <CarouselPage
            key={slideGroup.items.map((item) => item.data.slug).join('-')}
            index={groupIndex}
          >
            <CarouselItemList>
              {slideGroup.items.map((item, itemIndex) => (
                <CarouselItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${itemIndex}`}
                  index={itemIndex}
                  onClickPrevent={() => {
                    if (selectedStrengths) {
                      return selectedStrengths.length >= 3;
                    }

                    return false;
                  }}
                  onClick={() => {
                    const newState = {
                      animatingAway: false,
                      selectedStrengths: selectedStrengths ?? [],
                    };
                    newState.selectedStrengths?.push(item.data.slug);
                    setCarouselState({...carouselState, ...newState});
                  }}
                >
                  <StrengthIconAndName
                    slug={item.data.slug}
                    size="md"
                    textWrapperClassName="font-bold text-sm sm:text-sm md:text-md lg:text-md"
                  />
                </CarouselItem>
              ))}
            </CarouselItemList>
          </CarouselPage>
        ))}
      </CarouselSlider>
    </>
  );
};
