import {useCallback, useEffect, useRef} from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

const Confetti1 = ({x, y}: {readonly x?: number; readonly y?: number}) => {
  const refAnimationInstance: any = useRef(null);

  const getInstance = useCallback((instance: any) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback(
    (particleRatio: any, options: any) => {
      refAnimationInstance.current?.({
        ...options,
        origin: {x, y},
        particleCount: Math.floor(200 * particleRatio),
      });
    },
    [x, y],
  );

  useEffect(() => {
    fire();
  }, []);

  const fire = useCallback(() => {
    makeShot(0.2, {
      spread: 200,
      startVelocity: 10,
      decay: 0.95,
      scalar: 0.6,
      gravity: 0.1,
    });
    // makeShot(0.2, {
    //   spread: 60,
    // })
    // makeShot(0.35, {
    //   spread: 100,
    //   decay: 0.91,
    //   scalar: 0.8,
    // })
    // makeShot(0.1, {
    //   spread: 120,
    //   startVelocity: 25,
    //   decay: 0.92,
    //   scalar: 1.2,
    // })
    // makeShot(0.1, {
    //   spread: 120,
    //   startVelocity: 45,
    // })
  }, [makeShot]);

  return (
    <ReactCanvasConfetti
      refConfetti={getInstance}
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      }}
    />
  );
};

export default Confetti1;
