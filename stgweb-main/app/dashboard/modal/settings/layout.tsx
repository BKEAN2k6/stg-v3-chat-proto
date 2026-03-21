'use client';

import {type ReactNode} from 'react';
import {SettingsModal} from './SettingsModal';

type Props = {
  readonly children: ReactNode;
};

const SettingsLayout = (props: Props) => {
  const {children} = props;

  return <SettingsModal>{children}</SettingsModal>;
};

export default SettingsLayout;
