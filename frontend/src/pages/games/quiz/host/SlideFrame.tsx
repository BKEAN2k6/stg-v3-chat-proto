import React, {useLayoutEffect, useMemo, useRef, useState} from 'react';

const slideWidth = 1280;
const slideHeight = 720;

export function SlideFrame({children}: {readonly children: React.ReactNode}) {
  const sizerReference = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({w: 0, h: 0});

  useLayoutEffect(() => {
    const element = sizerReference.current;
    if (!element) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setBox({w: cr.width, h: cr.height});
    });
    ro.observe(element);
    return () => {
      ro.disconnect();
    };
  }, []);

  const scale = useMemo(() => {
    if (!box.w || !box.h) return 1;
    return Math.min(box.w / slideWidth, box.h / slideHeight);
  }, [box.w, box.h]);

  return (
    <div style={{position: 'relative', width: '100%'}}>
      <div
        ref={sizerReference}
        style={{
          width: '100%',
          aspectRatio: `${slideWidth} / ${slideHeight}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}
