import Image from 'next/image';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';
import {type LocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {cn} from '@/lib/utils';

type Props = {
  readonly strength: {
    slug: StrengthSlug;
    count: number;
  };
  readonly locale: LocaleCode;
  readonly ordinal: '1st' | '2nd' | '3rd';
};

export const TopStrengthPodiumCard = (props: Props) => {
  const {strength, ordinal, locale} = props;
  return (
    <div
      className={cn(
        'mx-2 flex flex-col items-center rounded-md border border-gray-200 bg-gray-50 p-4',
      )}
      style={{
        backgroundColor: StrengthColorMap[strength.slug][50],
      }}
    >
      <span className="mb-4 mt-8 items-center text-center text-md font-bold lg:text-xl xl:text-2xl">
        {StrengthTranslationMap[strength.slug][locale]}
      </span>
      <div
        className={cn(
          'flex flex-col items-center justify-center',
          ['1st'].includes(ordinal) &&
            'max-h-[480px] min-h-[480px] px-2 md:4 lg:px-8',
          ['2nd'].includes(ordinal) &&
            'max-h-[340px] min-h-[340px] px-4 md:6 lg:px-12',
          ['3rd'].includes(ordinal) &&
            'max-h-[280px] min-h-[280px] px-6 md:12 lg:px-16',
        )}
      >
        <div
          className={cn('w-full justify-center rounded-full relative')}
          style={{
            backgroundColor: StrengthColorMap[strength.slug][300],
          }}
        >
          <Image src={strengthImageBySlug(strength.slug)} alt={strength.slug} />
          <div className="absolute bottom-0 right-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white md:h-12 md:w-12">
              <div className="text-sm font-bold md:text-md">
                x{strength.count}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
