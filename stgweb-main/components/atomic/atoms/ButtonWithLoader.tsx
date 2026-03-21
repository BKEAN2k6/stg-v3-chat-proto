'use client';

// Somewhat similar to link-button-with-loader, but with onClick and loading
// coming in as props. The consumer controls what happens after clicking.
import {type ReactNode} from 'react';
import {cn} from '@/lib/utils';

type Props = {
  readonly children: ReactNode;
  readonly variant?: 'small';
  readonly id?: string;
  readonly onClick?: (event: any) => void;
  readonly isLoading?: boolean;
  readonly isDisabled?: boolean;
  readonly className?: string;
  readonly type?: 'button' | 'submit' | 'reset';
};

export const ButtonWithLoader = ({
  children,
  variant,
  id,
  isLoading,
  isDisabled,
  className,
  type,
  onClick,
  ...rest
}: Props) => {
  if (!type) {
    type = 'button';
  }

  const handleClick = async (event: any) => {
    if (onClick) {
      event.preventDefault();
      onClick?.(event);
    }
  };

  return (
    <button
      id={id}
      // eslint-disable-next-line react/button-has-type
      type={type}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 font-bold text-primary',
        variant === 'small' && 'px-6 py-2',
        className,
        isLoading && 'bg-gray-200',
      )}
      aria-busy={isLoading}
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      disabled={isLoading || isDisabled}
      onClick={handleClick}
      {...rest}
    >
      <span
        className={cn(
          'transition-opacity duration-200',
          isLoading ? 'opacity-0' : 'opacity-100',
        )}
      >
        {children}
      </span>
      {isLoading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="loader h-5 w-5 rounded-full border-4 border-gray-200 ease-linear" />
        </div>
      )}
    </button>
  );
};
