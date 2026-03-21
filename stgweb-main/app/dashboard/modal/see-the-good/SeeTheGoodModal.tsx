'use client';

import {type ReactNode} from 'react';
import {useSearchParams} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {FullScreenModal} from '@/components/atomic/molecules/FullScreenModal';

type Props = {
  readonly children: ReactNode;
};

export const SeeTheGoodModal = (props: Props) => {
  const {children} = props;
  const searchParameters = useSearchParams();
  const returnPath = searchParameters.get('return') ?? PATHS.profile;
  return <FullScreenModal returnPath={returnPath}>{children}</FullScreenModal>;
};
