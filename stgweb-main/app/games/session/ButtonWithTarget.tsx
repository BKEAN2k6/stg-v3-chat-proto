'use client';

import {type ReactNode, useState} from 'react';
import {useRouter} from 'next/navigation';
import {cn} from '@/lib/utils';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';

type Props = {
  readonly children: ReactNode;
  readonly target?: string;
  readonly className?: string;
  readonly isDisabled?: boolean;
  readonly type?: 'button' | 'submit' | 'reset';
};

export const ButtonWithTarget = (props: Props) => {
  const {target, children, className, isDisabled, type} = props;
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleClick = () => {
    setIsLoading(true);
    if (target) {
      router.push(target);
    }
  };

  return (
    <ButtonWithLoader
      id="continue-button"
      type={type}
      isLoading={isLoading}
      isDisabled={isLoading || isDisabled}
      className={cn('w-full max-w-xs px-6 py-4', className)}
      onClick={handleClick}
    >
      {children}
    </ButtonWithLoader>
  );
};
