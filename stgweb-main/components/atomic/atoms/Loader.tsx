'use client';

import Rive from '@rive-app/react-canvas';

export const Loader = ({className}: any) => (
  <Rive
    className={className}
    stateMachines="State Machine 1"
    // width="30"
    // height="180"
    style={{width: 80, height: 30}}
    src="/animations/loaders/seppoballs.riv"
  />
);
