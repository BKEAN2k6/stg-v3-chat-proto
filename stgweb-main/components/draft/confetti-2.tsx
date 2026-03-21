'use client';

import {useEffect, useState} from 'react';
import Confetti from 'react-confetti';
import {useDebounce, useWindowSize} from 'react-use';

const Confetti2 = () => {
  const [render, setRender] = useState(false);
  const [rerender, setRerender] = useState(false);
  const {width, height} = useWindowSize();

  useEffect(() => {
    setRender(false);
    setRerender(true);
  }, [width, height]);

  useDebounce(
    () => {
      if (rerender) {
        setRender(true);
        setRerender(false);
      }
    },
    1000,
    [rerender],
  );

  if (!render) {
    return null;
  }

  return (
    <Confetti
      style={{zIndex: 0}}
      numberOfPieces={150}
      friction={0.99}
      gravity={0.1}
      width={width}
      height={height}
      drawShape={(ctx) => {
        ctx.beginPath();
        for (let i = 0; i <= 100; i++) {
          const t = (i / 100) * (2 * Math.PI); // Parameter t
          const x = 16 * Math.sin(t) ** 3;
          const y = -(
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
          ); // Negate y to orient the heart correctly.
          ctx.lineTo(x, y);
        }

        // primary-100
        ctx.fillStyle = '#c1b2e6';
        ctx.fill();
        ctx.closePath();
      }}
    />
  );
};

export default Confetti2;
