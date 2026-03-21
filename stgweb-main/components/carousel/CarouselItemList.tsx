import {type ReactNode, cloneElement} from 'react';
import {cn} from '@/lib/utils';

type CarouselItemListProps = {
  readonly children: ReactNode[];
  readonly isPageVisible?: boolean;
};

export const CarouselItemList = ({
  children,
  isPageVisible,
}: CarouselItemListProps) => (
  <div
    className={cn(
      isPageVisible && 'md:w-[360px]',
      'mx-auto grid w-full grid-cols-2 place-items-center transition-[width] duration-300',
    )}
  >
    {children?.map((child: any) =>
      cloneElement(child, {
        isVisible: isPageVisible,
      }),
    )}
  </div>
);
