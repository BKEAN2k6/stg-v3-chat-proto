import Image from 'next/image';
import {strengthImageBySlug} from '../atoms/StrengthImage';
import {type LocaleCode} from '@/lib/locale';
import {
  StrengthColorMap,
  StrengthFactsMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';

type Props = {
  readonly slug: StrengthSlug;
  readonly locale: LocaleCode;
};

export const StrengthFact = (props: Props) => {
  const {slug, locale} = props;
  return (
    <div
      className="flex w-full flex-col items-center justify-center pt-12 text-center"
      style={{
        backgroundColor: StrengthColorMap[slug][200],
      }}
    >
      <Image
        width={350}
        src={strengthImageBySlug(slug)}
        alt={StrengthTranslationMap[slug][locale]}
      />
      <p className="w-full max-w-sm p-4 pb-12">
        {StrengthFactsMap[slug][locale]}
      </p>
    </div>
  );
};
