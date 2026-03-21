import {useEffect, useRef} from 'react';

const starClipPath =
  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';

export default function BadgeBubbles({color}: {readonly color: string}) {
  const containerReference = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerReference.current;
    if (!container) {
      return;
    }

    const spawnBubble = () => {
      const element = document.createElement('div');
      const size = 8 + Math.random() * 8;
      const startX = (Math.random() - 0.5) * 24;
      const drift = (Math.random() - 0.5) * 16;
      const duration = 2000 + Math.random() * 2000;
      const isStar = Math.random() < 0.3;

      Object.assign(element.style, {
        position: 'absolute',
        left: '50%',
        bottom: '50%',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: isStar ? '0' : '50%',
        clipPath: isStar ? starClipPath : '',
        backgroundColor: color,
        pointerEvents: 'none',
      });

      container.append(element);

      const animation = element.animate(
        [
          {transform: `translate(${startX}px, 0)`, opacity: '0.5'},
          {
            transform: `translate(${startX + drift}px, -30px)`,
            opacity: '0.4',
          },
          {
            transform: `translate(${startX - drift}px, -60px)`,
            opacity: '0.2',
          },
          {
            transform: `translate(${startX}px, -90px) scale(1.3)`,
            opacity: '0',
          },
        ],
        {duration, easing: 'ease-out', fill: 'forwards'},
      );

      animation.onfinish = () => {
        element.remove();
      };
    };

    spawnBubble();
    const interval = setInterval(spawnBubble, 400);

    return () => {
      clearInterval(interval);
      while (container.firstChild) {
        container.firstChild.remove();
      }
    };
  }, [color]);

  return (
    <div
      ref={containerReference}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
