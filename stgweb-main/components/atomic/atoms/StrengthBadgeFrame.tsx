import Image from 'next/image';
import unlocked from '@/public/images/badges/unlocked.png';

export const StrengthBadgeFrame = (props: any) => (
  <Image src={unlocked} alt="Unlocked" className={props.className} />
);
