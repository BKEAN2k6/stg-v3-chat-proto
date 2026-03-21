'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {PATHS} from '@/constants.mjs';
import {shouldHideNavigation} from '@/lib/navigation';
import useDashboard from '@/hooks/useDashboard';
import {Avatar} from '@/components/atomic/organisms/Avatar';
import {HomeIcon} from '@/components/atomic/atoms/HomeIcon';
import {HomeIconFilled} from '@/components/atomic/atoms/HomeIconFilled';
import {GridIcon} from '@/components/atomic/atoms/GridIcon';
import {GridIconFilled} from '@/components/atomic/atoms/GridIconFilled';
import {LetterIcon} from '@/components/atomic/atoms/LetterIcon';

export const BottomNavigationNew = () => {
  const pathname = usePathname();
  const {dashboardState} = useDashboard();

  const groupsIsActive =
    pathname === PATHS.homeGroups ||
    pathname.startsWith(PATHS.group.replace('[groupSlug]', ''));
  const homeIsActive = pathname.startsWith(PATHS.home) && !groupsIsActive;
  const profileIsActive = pathname.startsWith(PATHS.profile);
  const inboxIsActive = pathname.startsWith(PATHS.inbox);

  if (shouldHideNavigation(pathname) && pathname !== PATHS.inbox) {
    return null;
  }

  return (
    <section className="fixed inset-x-0 bottom-0 z-10 block border-t bg-white lg:hidden">
      <div className="flex h-[70px] items-center justify-between">
        <Link
          href={PATHS.homeMoments}
          className="inline-block w-full justify-center pb-1 pt-2 text-center hover:text-primary focus:text-primary"
          style={
            {
              '--icon-color':
                homeIsActive && !groupsIsActive
                  ? 'hsl(var(--primary-lighter-1))'
                  : '#282C34',
            } as React.CSSProperties
          }
        >
          {homeIsActive ? (
            <HomeIconFilled className="mb-1 inline-block h-[24px] w-[24px]" />
          ) : (
            <HomeIcon className="mb-1 inline-block h-[24px] w-[24px]" />
          )}
        </Link>
        <Link
          href={PATHS.homeGroups}
          className="inline-block w-full justify-center pb-1 pt-2 text-center hover:text-primary focus:text-primary"
          style={
            {
              '--icon-color': groupsIsActive
                ? 'hsl(var(--primary-lighter-1))'
                : '#282C34',
            } as React.CSSProperties
          }
        >
          {groupsIsActive ? (
            <GridIconFilled className="mb-1 inline-block h-[24px] w-[24px]" />
          ) : (
            <GridIcon className="mb-1 inline-block h-[24px] w-[24px]" />
          )}
        </Link>
        <Link
          href={PATHS.inbox}
          className="inline-block w-full justify-center pb-1 pt-2 text-center hover:text-primary focus:text-primary"
          style={
            {
              '--icon-color': inboxIsActive
                ? 'hsl(var(--primary-lighter-1))'
                : '#282C34',
            } as React.CSSProperties
          }
        >
          {/* NOTE: this is slightly different from the others, since I could
          not find the filled letter icon... (and figma does not export it
          correctly for some reason...) */}
          <LetterIcon className="mb-1 inline-block h-[24px] w-[24px]" />
        </Link>
        <Link
          href={PATHS.profileStrengths}
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
