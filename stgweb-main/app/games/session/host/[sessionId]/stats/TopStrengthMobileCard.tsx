import Image from 'next/image';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {type LocaleCode} from '@/lib/locale';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';
import {cn} from '@/lib/utils';

type Props = {
  readonly strength: {
    slug: StrengthSlug;
    count: number;
  };
  readonly locale: LocaleCode;
};

export const TopStrengthMobileCard = (props: Props) => {
  const {strength, locale} = props;
  return (
    <div
      className={cn(
        'mx-2 flex flex-col items-center rounded-md border border-gray-200 bg-gray-50 p-4',
      )}
      style={{
        backgroundColor: StrengthColorMap[strength.slug][50],
      }}
    >
      <span className="mb-4 items-center text-md font-bold lg:text-xl xl:text-2xl">
        {StrengthTranslationMap[strength.slug][locale]}
      </span>
      <div className="h-48 w-48 p-4">
        <div
          className={cn('w-full justify-center rounded-full relative')}
          style={{
            backgroundColor: StrengthColorMap[strength.slug][300],
          }}
        >
          <Image src={strengthImageBySlug(strength.slug)} alt={strength.slug} />
          <div className="absolute bottom-0 right-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
              <div className="text-sm font-bold">x{strength.count}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
