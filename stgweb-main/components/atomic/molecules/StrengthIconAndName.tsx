'use client';

import Image from 'next/image';
import {useCookies} from 'next-client-cookies';
import {strengthImageBySlug} from '../atoms/StrengthImage';
import {getLocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {cn} from '@/lib/utils';

type Props = {
  readonly slug: StrengthSlug;
  readonly size: 'sm' | 'md' | 'lg';
  readonly imageWrapperClassName?: string;
  readonly textWrapperClassName?: string;
};

export const StrengthIconAndName = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {slug, size, imageWrapperClassName, textWrapperClassName} = props;
  let sizes;
  switch (size) {
    case 'md': {
      sizes = [
        'h-[80px] w-[80px]',
        'md:h-[90px] md:w-[90px]',
        'lg:h-[100px] lg:w-[100px]',
      ];
      // sizes = [`h-[100px] w-[100px]`]
      break;
    }

    case 'lg': {
      sizes = [
        'h-[80px] w-[80px]',
        'md:h-[100px] md:w-[100px]',
        'lg:h-[120px] lg:w-[120px]',
      ];
      // sizes = [`h-[120px] w-[120px]`]
      break;
    }

    default: {
      // this get's applied to sm
      sizes = [
        'h-[60px] w-[60px]',
        'md:h-[70px] md:w-[70px]',
        'lg:h-[80px] lg:w-[80px]',
      ];
    }
    // sizes = [`h-[80px] w-[80px]`]
  }

  const color = StrengthColorMap[slug][300];
  const name = StrengthTranslationMap[slug][locale];
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'mb-4 flex cursor-pointer justify-center rounded-full',
          ...sizes,
          imageWrapperClassName,
        )}
        style={{backgroundColor: color}}
      >
        <Image
          src={strengthImageBySlug(slug)}
          alt={name}
          title={name}
          // width={baseWidthAndHeight}
          // height={baseWidthAndHeight}
          // layout="fill" // required
          // fill={true}
          // // objectFit="cover" // change to suit your needs
          // className="rounded-full" // just an example
        />
      </div>
      <div
        className={cn(
          'h-12 text-center text-sm md:text-md lg:text-lg',
          // NOTE: these need to match the image sizing above...
          size === 'sm' && 'max-w-[80px]',
          size === 'md' && 'max-w-[100px]',
          size === 'lg' && 'max-w-[120px]',
          textWrapperClassName,
        )}
        title={name}
      >
        {name}
      </div>
    </div>
  );
};
