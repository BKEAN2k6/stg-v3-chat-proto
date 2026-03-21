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
      'mx-auto grid w-full grid-cols-1 place-items-center space-y-4',
    )}
  >
    {children?.map((child: any) =>
      cloneElement(child, {
        isVisible: isPageVisible,
      }),
    )}
  </div>
);
