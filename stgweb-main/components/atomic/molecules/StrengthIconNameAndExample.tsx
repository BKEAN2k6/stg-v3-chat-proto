'use client';

import Image from 'next/image';
import {useCookies} from 'next-client-cookies';
import {strengthImageBySlug} from '../atoms/StrengthImage';
import {getLocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  StrengthExamplesMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {cn} from '@/lib/utils';

type Props = {
  readonly slug: StrengthSlug;
};

export const StrengthIconNameAndExample = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {slug} = props;
  const color = StrengthColorMap[slug][300];
  const name = StrengthTranslationMap[slug][locale];

  return (
    <div className="flex max-h-[107px] rounded-md border border-gray-200 bg-gray-100 p-4">
      <div
        className={cn(
          // "relative mr-4 flex h-8 w-14 cursor-pointer justify-center rounded-full sm:h-20 sm:w-28"
          'relative mr-4 flex cursor-pointer justify-center rounded-full',
          'max-h-[64px] min-h-[64px] min-w-[64px] max-w-[64px]',
        )}
        style={{backgroundColor: color}}
      >
        <Image
          src={strengthImageBySlug(slug)}
          alt={slug}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <h4 className="text-sm font-bold sm:text-md">{name}</h4>
        <p className="text-xxs sm:text-sm">
          {StrengthExamplesMap[slug][locale]}
        </p>
      </div>
    </div>
  );
};
