'use client';

import {type ReactNode} from 'react';
import {useWindowSize} from 'react-use';
import {cn} from '@/lib/utils';

type Props = {
  readonly children: ReactNode;
  readonly className?: string;
  readonly requiredHeight?: number;
};

// since centering items with a flexbox can cause serious usability issues in
// screens without enough height, this wrapper helps deal with that
export const FullHeightCentered = (props: Props) => {
  const {children, className, requiredHeight = 420} = props;
  const {height: windowHeight} = useWindowSize();
  return (
    <div
      className={cn(
        'min-safe-h-screen flex justify-center',
        windowHeight > requiredHeight && 'items-center',
        className,
      )}
    >
      {children}
    </div>
  );
};
