import {type ReactNode, useState} from 'react';
import {motion} from 'framer-motion';
import useCarousel from './useCarousel';
import {cn} from '@/lib/utils';

const Checkmark = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50">
    <path fill="none" stroke="green" strokeWidth="4" d="m10 25 10 10 20-20" />
  </svg>
);

type CarouselItemProps = {
  readonly children: ReactNode;
  readonly index: number;
  readonly isVisible?: boolean;
  readonly isPlaceholder?: boolean;
  readonly onClick: () => void;
  readonly onClickPrevent?: () => boolean;
};

export const CarouselItem = ({
  children,
  index,
  isVisible,
  isPlaceholder,
  onClick,
  onClickPrevent,
}: CarouselItemProps) => {
  const {carouselState, setCarouselState} = useCarousel();
  const [newYCoord, setNewYCoord] = useState(0);
  const [newOpacity, setNewOpacity] = useState(1);
  const [selected, setSelected] = useState(false);
  const [animating, setAnimating] = useState(false);
  const handleClick = (event: any) => {
    event.preventDefault();
    if (onClickPrevent?.()) {
      return;
    }

    if (isVisible && !animating) {
      event.stopPropagation();
      setAnimating(true);
      // this temporarily disables overflow hidden on the container so that the
      // "up" animation effect is visible.
      setCarouselState({...carouselState, animatingAway: true});
      setNewYCoord(-100);
      setNewOpacity(0);
      setSelected(true);
      setTimeout(() => {
        setAnimating(false);
        onClick?.();
      }, 500);
    }
  };

  if (isPlaceholder) {
    // @TODO this needs to properly adapt to different screen sizes similarly to
    // UserAvatarAndName and StrengthIconAndName (those and this should probably
    // use some shared wrapper logic anyway...)
    return <div className="mb-8 h-[164px] w-[100px]" />;
  }

  return (
    <div
      key={index}
      className={cn([0, 1].includes(index) && 'mb-8', 'text-center')}
    >
      <div className="relative flex items-center justify-center">
        <motion.div
          initial={{y: 0, opacity: 1}}
          animate={{y: newYCoord, opacity: newOpacity}}
          transition={{
            type: 'tween',
            ease: 'anticipate',
            duration: 0.5,
          }}
          className={cn(selected && 'fixed')}
          onClick={handleClick}
        >
          {children}
        </motion.div>
        {selected && (
          <>
            <div className="opacity-20">{children}</div>
            <div className="absolute top-4 sm:top-6">
              <Checkmark />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
