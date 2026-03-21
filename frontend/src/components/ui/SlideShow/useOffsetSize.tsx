import {useRef, useState, useLayoutEffect} from 'react';

export default function useOffsetSize<T extends HTMLElement>() {
  const reference = useRef<T>(null);
  const [size, setSize] = useState({width: 0, height: 0});

  useLayoutEffect(() => {
    if (!reference.current) return;
    const node = reference.current;

    function measure() {
      setSize({
        width: node.offsetWidth,
        height: node.offsetHeight,
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    return () => {
      ro.disconnect();
    };
  }, []);

  return [reference, size] as const;
}
