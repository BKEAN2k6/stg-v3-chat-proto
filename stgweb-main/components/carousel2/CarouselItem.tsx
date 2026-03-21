import {type ReactNode, useState} from 'react';
import {motion} from 'framer-motion';
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
  const [newYCoord, setNewYCoord] = useState(0);
  const [newOpacity, setNewOpacity] = useState(1);
  const [selected, setSelected] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hidden, setHidden] = useState(false);
  const handleClick = (event: any) => {
    event.preventDefault();
    if (onClickPrevent?.()) {
      return;
    }

    if (isVisible && !animating) {
      event.stopPropagation();
      setAnimating(true);
      setNewYCoord(-100);
      setNewOpacity(0);
      setSelected(true);
      setTimeout(() => {
        setAnimating(false);
        setHidden(true);
        onClick?.();
      }, 500);
    }
  };

  if (isPlaceholder) {
    // @TODO this needs to properly adapt to different screen sizes similarly to
    // UserAvatarAndName and StrengthIconAndName (those and this should probably
    // use some shared wrapper logic anyway...)
    return null;
  }

  const wrapperClasses = 'flex w-full justify-center';
  return (
    <div
      // className={cn([0, 1].includes(index) && "mb-8", "text-center")}
      key={index}
      className="w-full"
    >
      <div className="relative flex w-full items-center justify-center">
        {!hidden && (
          <motion.div
            initial={{y: 0, opacity: 1}}
            animate={{y: newYCoord, opacity: newOpacity}}
            transition={{
              type: 'tween',
              ease: 'anticipate',
              duration: 0.5,
            }}
            className={cn(wrapperClasses, selected && 'absolute')}
            onClick={handleClick}
          >
            {children}
          </motion.div>
        )}
        {selected && (
          <>
            <div className={cn(wrapperClasses, 'opacity-20')}>{children}</div>
            <div className="absolute">
              <Checkmark />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
