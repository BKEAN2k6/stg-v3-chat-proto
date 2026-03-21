import {useEffect, useRef, useState} from 'react';

const useElementPosition = () => {
  const elementRef: any = useRef(null);
  const [position, setPosition] = useState({x: 0, y: 0});

  const updatePosition = () => {
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect() as DOMRect;
      const x = (rect.left + rect.right) / 2 / window.innerWidth;
      const y = (rect.top + rect.bottom) / 2 / window.innerHeight;
      setPosition({x: x * 100, y: y * 100});
    }
  };

  useEffect(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  return {position, elementRef};
};

export default useElementPosition;
