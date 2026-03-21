'use client';

import {motion} from 'framer-motion';
import {cn} from '@/lib/utils';

type ButtonProps = {
  readonly type: 'prev' | 'next';
  readonly isVisible: boolean;
  readonly onClick: () => void;
};

export const SliderButton = (props: ButtonProps) => {
  const {type, isVisible, onClick} = props;
  return (
    <motion.button
      className={cn(
        type === 'prev' && 'left-0',
        type === 'next' && 'right-0',
        'absolute top-[-210px] z-10 hidden h-16 w-16 -translate-y-1/2 cursor-pointer items-center justify-center text-black hover:opacity-100 focus:outline-none sm:opacity-[0.3] md:flex',
      )}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={{
        hidden: {opacity: 0},
        visible: {opacity: 1},
      }}
      onClick={onClick}
    >
      {type === 'prev' && <PreviousButtonSvg />}
      {type === 'next' && <NextButtonSvg />}
    </motion.button>
  );
};

const PreviousButtonSvg = () => (
  <svg
    className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#7755C9" />
    <path
      d="M22.8125 14.375L17.1875 20L22.8125 25.625"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NextButtonSvg = () => (
  <svg
    className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px]"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="#7755C9" />
    <path
      d="M17.1875 14.375L22.8125 20L17.1875 25.625"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
