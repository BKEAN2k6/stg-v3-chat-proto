import {HeadingText} from './HeadingText';
import {SeeTheGoodModal} from './SeeTheGoodModal';
import {cn} from '@/lib/utils';

type Props = {
  children: React.ReactNode;
};

export default async function SeeTheGoodLayout({children}: Props) {
  return (
    <SeeTheGoodModal>
      {/* <div className="flex flex-col h-full justify-center"> */}
      <div className="absolute z-40 max-h-[120px] w-full bg-white text-center">
        <HeadingText />
      </div>
      {/* NOTE: Don't use h-screen (or 100vh) for scroll containers, since it
      doesnt work properly on mobile devices. Check FullScreenModal as well
      (also has min-safe-h-screen) */}
      <div className={cn('h-full overflow-y-auto')}>
        {/* NOTE: each page that has the HeadingText will need a pt-[120px] to
        prevent content being hidden under the absolute positioned HeadingText
        */}
        <div className="h-full w-full">{children}</div>
      </div>
    </SeeTheGoodModal>
  );
}
