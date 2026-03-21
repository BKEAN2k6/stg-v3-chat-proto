import {type ReactNode} from 'react';
import {motion} from 'framer-motion';

type FadeInAndOutProps = {
  readonly children: ReactNode;
  readonly className?: string;
};

export const FadeInAndOut = (props: FadeInAndOutProps) => {
  const {className, children} = props;
  return (
    <motion.div
      initial={{opacity: 0}}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
