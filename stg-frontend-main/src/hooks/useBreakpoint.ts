import {useState, useEffect} from 'react';
import {useWindowSize} from 'react-use';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

// NOTE: make sure these match $grid-breakpoints in index.scss
const resolveBreakpoint = (width: number) => {
  if (width < 390) {
    return 'xs';
  }

  if (width >= 390 && width < 576) {
    return 'sm';
  }

  if (width >= 576 && width < 838) {
    return 'md';
  }

  if (width >= 838 && width < 992) {
    return 'lg';
  }

  if (width >= 992 && width < 1140) {
    return 'xl';
  }

  return 'xxl';
};

export default function useBreakpoint() {
  const [size, setSize] = useState(() => resolveBreakpoint(window.innerWidth));

  const {width} = useWindowSize();

  useEffect(() => {
    setSize(resolveBreakpoint(width));
  }, [width]);

  return size;
}
