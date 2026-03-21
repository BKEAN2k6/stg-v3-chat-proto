'use client';

import {useEffect, useState} from 'react';
import Image from 'next/image';
import {useRive} from '@rive-app/react-canvas';
import {useWindowSize} from 'react-use';
import teamwork from '@/public/images/teamwork.png';

const MAX_WIDTH = 500;
const MAX_HEIGHT = 480;

export const SplashScreen = () => {
  const [width, setWidth] = useState(MAX_WIDTH);
  const [height, setHeight] = useState(MAX_HEIGHT);
  const {width: windowWidth, height: windowHeight} = useWindowSize();
  const [showAsImage, setShowAsImage] = useState(true);
  const {RiveComponent} = useRive({
    src: '/animations/teamwork.riv',
    stateMachines: ['State Machine 1'],
    autoplay: true,
    onLoad() {
      setShowAsImage(false);
    },
  });

  useEffect(() => {
    if (windowWidth < 500) {
      setWidth(windowWidth);
    } else {
      setWidth(MAX_WIDTH);
    }

    if (windowHeight < 500 + 300) {
      setHeight(MAX_HEIGHT - (500 + 300 - windowHeight));
    } else {
      setHeight(MAX_HEIGHT);
    }
  }, [windowHeight, windowWidth]);

  if (windowHeight < 450) {
    return <div style={{height}} />;
  }

  return (
    <>
      <RiveComponent
        style={{
          width: showAsImage ? 0 : width,
          height: showAsImage ? 0 : height,
        }}
      />
      {showAsImage && <Image src={teamwork} height={height} alt="Teamwork" />}
    </>
  );
};
