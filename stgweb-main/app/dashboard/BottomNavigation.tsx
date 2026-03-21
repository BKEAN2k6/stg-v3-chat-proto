'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {shouldHideNavigation} from '@/lib/navigation';
import useDashboard from '@/hooks/useDashboard';
import {BookIcon} from '@/components/atomic/atoms/BookIcon';
import {CommunityIcon} from '@/components/atomic/atoms/CommunityIcon';
import {PaperplaneIcon} from '@/components/atomic/atoms/PaperplaneIcon';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {LetterIcon} from '@/components/atomic/atoms/LetterIcon';

export const BottomNavigation = () => {
  const pathname = usePathname();
  const {dashboardState} = useDashboard();

  const communityIsActive = pathname.startsWith(PATHS.community);
  const libraryIsActive = pathname.startsWith(PATHS.library);
  const inboxIsActive = pathname.startsWith(PATHS.inbox);
  const profileIsActive = pathname.startsWith(PATHS.profile);

  if (shouldHideNavigation(pathname)) {
    return null;
  }

  return (
    <section className="fixed inset-x-0 bottom-0 z-10 block border-t bg-white lg:hidden">
      <div className="flex h-[70px] items-center justify-between">
        <Link
          href={PATHS.community}
          className="inline-block w-full justify-center pb-1 pt-2 text-center hover:text-primary focus:text-primary"
          style={
            {
              '--icon-color': communityIsActive
                ? 'hsl(var(--primary-lighter-1))'
                : '#282C34',
            } as React.CSSProperties
          }
        >
          <CommunityIcon className="mb-1 inline-block" />
        </Link>
        <Link
          href={PATHS.library}
          className="inline-block w-full justify-center pb-1 pt-2 text-center"
          style={
            {
              '--icon-color': libraryIsActive
                ? 'hsl(var(--primary-lighter-1))'
                : '#282C34',
            } as React.CSSProperties
          }
        >
          <BookIcon className="mb-1 inline-block" />
        </Link>
        <div className="inline-block w-full justify-center pb-1 pt-2 text-center">
          <div className="absolute left-1/2 top-[-20px] mx-auto h-[70px] w-[70px] -translate-x-2/4 rounded-full bg-white ">
            <div className="h-full w-full rounded-full border-t-2 bg-white p-[6px]">
              <Link
                id="intro-tour-step-see-the-good-mobile"
                href={`${PATHS.seeTheGoodModal}?return=${encodeURIComponent(pathname)}`} // prettier-ignore
                className="flex h-full w-full items-center justify-center rounded-full bg-primary "
              >
                <PaperplaneIcon color="#fff" className="h-[26px] w-[26px]" />
              </Link>
            </div>
          </div>
        </div>
        <Link
          href={PATHS.inbox}
          className="inline-block w-full justify-center pb-1 pt-2 text-center"
          style={
            {
              '--icon-color': inboxIsActive
                ? 'hsl(var(--primary-lighter-1))'
                : '#282C34',
            } as React.CSSProperties
          }
        >
          <LetterIcon className="mb-1 inline-block" />
        </Link>
        <Link
          href={PATHS.profile}
          className="inline-block w-full justify-center text-center"
        >
          <div className="inline-block">
            <Avatar
              size={38}
              imageSizeMultiplier={0.85}
              {...(profileIsActive && {singleColor: 'hsl(258, 52%, 64%)'})}
              avatarFileId={dashboardState.userAvatar}
              avatarSlug={dashboardState.userAvatarSlug}
              color={dashboardState.userColor}
              strengths={dashboardState.userTopStrengths}
              name={`${dashboardState.userFirstName} ${dashboardState.userLastName}`}
            />
          </div>
        </Link>
      </div>
    </section>
  );
};
