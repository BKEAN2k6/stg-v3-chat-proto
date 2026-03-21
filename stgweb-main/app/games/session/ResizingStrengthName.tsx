import {type LocaleCode} from '@/lib/locale';
import {type StrengthSlug, StrengthTranslationMap} from '@/lib/strength-data';
import {cn} from '@/lib/utils';

type Props = {
  readonly slug: StrengthSlug;
  readonly locale: LocaleCode;
};

export const ResizingStrengthName = (props: Props) => {
  const {slug, locale} = props;
  const text = StrengthTranslationMap[slug][locale];
  return (
    <span
      className={cn(
        'font-bold',
        text.length >= 11 && 'text-sm',
        text.length >= 14 && 'text-[12px]',
      )}
    >
      {text}
    </span>
  );
};
