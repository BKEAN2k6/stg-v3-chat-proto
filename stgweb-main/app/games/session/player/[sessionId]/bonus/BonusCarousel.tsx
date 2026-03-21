'use client';

import {useState} from 'react';
import {cn, groupArray} from '@/lib/utils';
import {CarouselItem} from '@/components/carousel2/CarouselItem';
import {CarouselItemList} from '@/components/carousel2/CarouselItemList';
import {CarouselPage} from '@/components/carousel2/CarouselPage';
import {CarouselSlider} from '@/components/carousel2/CarouselSlider';

export type SlideItem = {
  data: {
    id: string;
    name: string;
    color: string;
  };
  isPlaceholder?: boolean;
};

type Props = {
  readonly items: any;
  readonly onItemSelected: (id: string) => void;
};

export const BonusCarousel = (props: Props) => {
  const {items, onItemSelected} = props;
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selecting, setSelecting] = useState<boolean>(false);

  const groupedItems = groupArray(items, 4) as Array<{items: SlideItem[]}>;

  const handleStrengthSelected = async (item: SlideItem) => {
    setSelecting(true);
    setTimeout(() => {
      setSelecting(false);
    }, 1000);
    const id = item.data.id;
    setSelectedItems([...selectedItems, id]);
    onItemSelected?.(id);
  };

  return (
    <CarouselSlider
      itemCount={items.filter((x: any) => !x.isPlaceholder).length}
      className={cn(selectedItems?.length === 3 && 'pointer-events-none')}
    >
      {groupedItems.map((slideGroup, groupIndex) => (
        <CarouselPage
          key={slideGroup.items.map((item) => item.data.id).join('-')}
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
                  if (selecting) {
                    return true;
                  }

                  return selectedItems.length >= 3;
                }}
                onClick={() => {
                  handleStrengthSelected(item);
                }}
              >
                <div
                  className="flex w-full max-w-[360px] items-center justify-center rounded-md p-3"
                  style={{
                    backgroundColor: item.data.color,
                  }}
                >
                  <span className="text-lg font-bold">{item.data.name}</span>
                  {/* {JSON.stringify(selecting)} */}
                </div>
                {/* <StrengthIconAndName
                    slug={item.data.slug}
                    size="md"
                    textWrapperClassName="font-bold text-sm sm:text-sm md:text-md lg:text-md"
                  /> */}
              </CarouselItem>
            ))}
          </CarouselItemList>
        </CarouselPage>
      ))}
    </CarouselSlider>
  );
};
