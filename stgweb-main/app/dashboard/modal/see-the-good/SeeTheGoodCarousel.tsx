'use client';

import {type SeeTheGoodCarouselType} from './SeeTheGoodCarouselType';
import {SeeTheGoodSelectedItems} from './CarouselSelectedItems';
import {type StrengthSlug} from '@/lib/strength-data';
import {cn, groupArray} from '@/lib/utils';
import {StrengthIconAndName} from '@/components/atomic/molecules/StrengthIconAndName';
import {UserAvatarAndName} from '@/components/atomic/molecules/UserAvatarAndName';
import {type StrengthPieChartItem} from '@/components/atomic/organisms/StrengthPieChart';
import {CarouselItem} from '@/components/carousel/CarouselItem';
import {CarouselItemList} from '@/components/carousel/CarouselItemList';
import {CarouselPage} from '@/components/carousel/CarouselPage';
import {CarouselSlider} from '@/components/carousel/CarouselSlider';
import useCarousel from '@/components/carousel/useCarousel';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

export type SlideItem = {
  data: {
    name?: string;
    slug?: string;
    swlId?: string;
    avatar?: string;
    avatarSlug?: string;
    color?: string;
    topStrengths: StrengthPieChartItem[];
  };
  isPlaceholder?: boolean;
};

type Parameters_ = {
  readonly type: SeeTheGoodCarouselType;
  readonly items: SlideItem[];
};

export const SeeTheGoodCarousel = ({type, items}: Parameters_) => {
  const {
    carouselState,
    selectedStrengthSlug,
    selectedUserData,
    setCarouselState,
  } = useCarousel();

  const groupedItems = groupArray(items, 4) as Array<{items: SlideItem[]}>;

  return (
    <>
      <SeeTheGoodSelectedItems />
      <PageTransitionWrapper>
        <CarouselSlider
          itemCount={items.filter((x: any) => !x.isPlaceholder).length}
          className={cn(
            type === 'user' && selectedUserData && 'pointer-events-none',
            // type === "group" && selectedGroupData && "pointer-events-none",
            type === 'strength' &&
              selectedStrengthSlug &&
              'pointer-events-none',
          )}
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
                    isPlaceholder={item.isPlaceholder}
                    onClickPrevent={() => {
                      if (type === 'user') {
                        return selectedUserData;
                      }

                      if (type === 'strength') {
                        return selectedStrengthSlug;
                      }

                      return false;
                    }}
                    onClick={() => {
                      if (type === 'strength') {
                        setCarouselState({
                          ...carouselState,
                          animatingAway: false,
                          selectedStrengthSlug: item.data.slug as StrengthSlug,
                        });
                      } else {
                        setCarouselState({
                          ...carouselState,
                          animatingAway: false,
                          selectedUserData: item.data,
                        });
                      }
                    }}
                  >
                    {type === 'strength' && (
                      <StrengthIconAndName
                        slug={item.data.slug as StrengthSlug}
                        size="md"
                        textWrapperClassName="font-bold text-sm sm:text-sm md:text-md lg:text-md"
                      />
                    )}
                    {type === 'user' && (
                      <UserAvatarAndName
                        name={item.data.name ?? ''}
                        avatarFileId={item.data.avatar}
                        avatarSlug={item.data.avatarSlug}
                        color={item.data.color}
                        strengths={item.data.topStrengths}
                        size="md"
                        textWrapperClassName="font-bold text-sm sm:text-sm md:text-md lg:text-md"
                      />
                    )}
                  </CarouselItem>
                ))}
              </CarouselItemList>
            </CarouselPage>
          ))}
        </CarouselSlider>
      </PageTransitionWrapper>
    </>
  );
};
