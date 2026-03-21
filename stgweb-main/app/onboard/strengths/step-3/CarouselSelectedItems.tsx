'use client';

import {useEffect, useMemo, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {type StrengthSlug} from '@/lib/strength-data';
import {cn} from '@/lib/utils';
import {StrengthIconAndName} from '@/components/atomic/molecules/StrengthIconAndName';
import useCarousel from '@/components/carousel/useCarousel';
import Confetti1 from '@/components/draft/confetti-1';
import useElementPosition from '@/components/draft/use-element-position';

const wrapperClasses = cn(
  'items-center',
  'max-w-[60px]',
  'md:max-w-[70px]',
  'lg:max-w-[80px]',
  // same as the strength-images...
  'h-[60px] w-[60px]',
  'md:h-[70px] md:w-[70px]',
  'lg:h-[80px] lg:w-[80px]',
);

const SelectedItemPlaceholder = () => (
  <div className={wrapperClasses}>
    <div className="box-border h-full rounded-full border-2 border-dashed border-gray-300" />
  </div>
);

type SelectedItemProps = {
  readonly slug: StrengthSlug;
  readonly isVisible?: boolean;
};

const SelectedItem = ({slug, isVisible}: SelectedItemProps) => {
  const {position, elementRef} = useElementPosition();
  const [shouldPop, setShouldPop] = useState(false);
  useEffect(() => {
    setShouldPop(true);
  }, []);
  return (
    <div ref={elementRef} className={wrapperClasses}>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{opacity: 0, scale: 0}}
            animate={{opacity: 1, scale: 1}}
            exit={{opacity: 0, scale: 0}}
            transition={{duration: 0.3, ease: 'backInOut'}}
          >
            <StrengthIconAndName
              slug={slug}
              size="sm"
              textWrapperClassName="text-xs sm:text-sm md:text-sm lg:text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {shouldPop && <Confetti1 x={position.x / 100} y={position.y / 100} />}
    </div>
  );
};

export const CarouselSelectedItems = () => {
  const {selectedStrengths} = useCarousel();

  const selectedItems = useMemo(
    () => selectedStrengths ?? [],
    [selectedStrengths],
  );

  const placeholdersNeeded = Array.from(
    Array.from({length: 3 - selectedItems.length}),
  );

  return (
    <div className="mt-6 flex h-24 justify-center space-x-4 sm:mt-20 md:h-28 lg:h-32">
      {selectedItems.map((slug) => (
        <SelectedItem key={slug} isVisible slug={slug} />
      ))}
      {placeholdersNeeded.map((_, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <SelectedItemPlaceholder key={`placeholder-item-${index}`} />
      ))}
    </div>
  );
};
