'use client';

// Somewhat similar to button-with-loader, but better accessibility in cases
// where the target is clearly a link and we don't need to do any client side
// stuff on click. Loading state controlled internally (just starts, never
// stops, as we expect router.push)
import {type ReactNode, useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {cn} from '@/lib/utils';

type Props = {
  readonly id?: string;
  readonly variant?: 'small';
  readonly children: ReactNode;
  // href: LinkProps["href"]
  readonly href: string; // NOTE: can only handle string links since we use router.push from next/navigation...
  readonly isDisabled?: boolean;
  readonly isLoading?: boolean; // NOTE: this is for sending the loading state to button from the consumer, basically same as "isLoading"
  readonly className?: string;
  readonly isNotClickable?: boolean;
  readonly onClick?: (event: any) => void;
};

export const LinkButtonWithLoader = ({
  id,
  variant,
  children,
  href,
  className,
  isDisabled: disabled,
  isLoading: loading,
  isNotClickable: nonClickable,
  onClick,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleClick = async (event: any) => {
    event.preventDefault();
    if (nonClickable) {
      return;
    }

    onClick?.(event);
    if (!disabled && !loading && !isLoading) {
      setIsLoading(true);
      router.push(href);
      // if onClick is provided, assuming the consumer will manage the loading
      // state. Otherwise we'll just leave the loader on, since we are likely
      // changing the route (thus destroying the consuming component)
      if (onClick) {
        setIsLoading(false);
      }
    }
  };

  return (
    <Link
      id={id}
      href={disabled ?? loading ?? isLoading ? '#' : href}
      className={cn(
        'relative flex items-center justify-center overflow-hidden rounded-full bg-white px-8 py-3 font-bold text-primary',
        variant === 'small' && 'px-6 py-2',
        nonClickable && 'cursor-default',
        className,
        (isLoading ?? loading ?? disabled) && 'bg-gray-200',
      )}
      aria-busy={isLoading || loading}
      onClick={handleClick}
    >
      <span
        className={cn(
          isLoading || loading ? 'opacity-0' : 'opacity-100',
          'transition-opacity duration-200',
        )}
      >
        {children}
      </span>
      {(isLoading || loading) && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
          <div className="loader h-5 w-5 rounded-full border-4 border-gray-200 ease-linear" />
        </div>
      )}
    </Link>
  );
};
