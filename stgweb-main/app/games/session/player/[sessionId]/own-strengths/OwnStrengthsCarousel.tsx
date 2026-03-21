'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {sp} from '../../../_utils';
import {CarouselInstructionText} from './CarouselInstructionText';
import {PATHS} from '@/constants.mjs';
import {type StrengthSlug} from '@/lib/strength-data';
import {cn, groupArray} from '@/lib/utils';
import {StrengthIconNameAndExample} from '@/components/atomic/molecules/StrengthIconNameAndExample';
import {CarouselItem} from '@/components/carousel2/CarouselItem';
import {CarouselItemList} from '@/components/carousel2/CarouselItemList';
import {CarouselPage} from '@/components/carousel2/CarouselPage';
import {CarouselSlider} from '@/components/carousel2/CarouselSlider';

type SlideItem = {
  data: {
    slug: StrengthSlug;
  };
  isPlaceholder?: boolean;
};

type Parameters_ = {
  readonly items: any;
  readonly sessionId: string;
};

export const OwnStrengthsCarousel = ({items, sessionId}: Parameters_) => {
  const [selectedStrengths, setSelectedStrengths] = useState<StrengthSlug[]>(
    [],
  );
  const [selecting, setSelecting] = useState<boolean>(false);
  const router = useRouter();

  const groupedItems = groupArray(items, 3) as Array<{items: SlideItem[]}>;

  const handleStrengthSelected = async (item: SlideItem) => {
    setSelecting(true);
    setTimeout(() => {
      setSelecting(false);
    }, 1000);
    const slug = item.data.slug;
    setSelectedStrengths([...selectedStrengths, slug]);
  };

  useEffect(() => {
    if (selectedStrengths?.length === 1) {
      const route = sp(
        PATHS.strengthSessionPlayerOwnStrengthsComplete,
        sessionId,
      );
      router.push(`${route}?strength=${selectedStrengths[0]}`);
    }
  }, [router, sessionId, selectedStrengths]);

  return (
    <>
      <CarouselInstructionText />
      <div className="h-20" />
      <CarouselSlider
        itemCount={items.filter((x: any) => !x.isPlaceholder).length}
        className={cn(selectedStrengths?.length === 1 && 'pointer-events-none')}
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
                    if (selecting) {
                      return true;
                    }

                    return selectedStrengths.length >= 3;
                  }}
                  onClick={() => {
                    handleStrengthSelected(item);
                  }}
                >
                  <div className="w-full max-w-[360px]">
                    <StrengthIconNameAndExample slug={item.data.slug} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselItemList>
          </CarouselPage>
        ))}
      </CarouselSlider>
    </>
  );
};
