import Image from 'next/image';
import {StrengthBadgeFrame} from '../atoms/StrengthBadgeFrame';
import {type StrengthSlug} from '@/lib/strength-data';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';

type Props = {
  readonly slug: StrengthSlug;
};

export const StrengthBadge = (props: Props) => {
  const {slug} = props;
  return (
    <div className="relative">
      <StrengthBadgeFrame className="w-full" />
      <Image
        src={strengthImageBySlug(slug)}
        alt="courage"
        className="absolute left-1/2 top-1/2 w-5/6 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};
