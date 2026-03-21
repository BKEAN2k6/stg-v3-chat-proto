import Link from 'next/link';
import {getCookies} from 'next-client-cookies/server';
import {BottomNavigationOffset} from './BottomNavigationOffset';
import {DashboardAccessRecorder} from './DashboardAccessRecorder';
import {MomentListener} from './MomentListener';
import {SeeTheGoodButtonOnSidebar} from './SeeTheGoodButtonOnSidebar';
import {SidebarNavigation} from './SidebarNavigation';
import {fetchDashboardData} from './_utils';
import {SidebarNavigationNew} from './SidebarNavigationNew';
import {LineBelowStickyHeader} from './LineBelowStickyHeader';
import {PATHS} from '@/constants.mjs';
import {DashboardContextProvider} from '@/providers/DashboardContext';
import {WebSocketContextProvider} from '@/providers/WebSocketContext';
import {getLocaleCode} from '@/lib/locale';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';
import DirectusAuthRefresh from '@/components/DirectusAuthRefresh';
import {Varis} from '@/components/atomic/atoms/Varis';
import {BottomNavigation} from '@/app/dashboard/BottomNavigation';
import {BottomNavigationNew} from '@/app/dashboard/BottomNavigationNew';
import {DashboardLayoutFixedSidebar} from '@/app/dashboard/DashboardLayout';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

// NOTE: this is used by the auth refresh action from serverDataQueryWrapper.
// The path should be an working path. From layouts, use the page the user is
// expected to return to if we need to send them to the auth refresh path and
// back (basically the "default page" for the layout).
const PATH = PATHS.home;

const getData = async () =>
  serverDataQueryWrapper(PATH, async (directus) =>
    fetchDashboardData(directus),
  );

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const cookies = getCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const data = await getData();
  const userId = data?.id;
  const userActiveOrganizationId = data?.active_organization?.id;
  const userActiveOrganizationName = data?.active_organization?.translation?.find((t: any) => t.language_code === locale)?.name; // prettier-ignore
  const userActiveOrganizationColor = data?.active_organization?.color; // prettier-ignore
  const userActiveOrganizationAvatar = data?.active_organization?.avatar; // prettier-ignore
  const userActiveOrganizationStrengthWallId = data?.active_organization?.swl_wall; // prettier-ignore
  const userActiveOrganizationUserCount = data?.active_organization?.users?.length || 0; // prettier-ignore
  const userActiveGroupId = data?.active_group?.id;
  const userActiveGroupName = data?.active_group?.name;
  const userActiveGroupStrengthWallId = data?.active_group?.swl_wall; // prettier-ignore
  const userTopStrengths = data?.top_strengths;
  const userStrengthWallId = data?.swl_wall;
  const userFirstName = data?.first_name;
  const userLastName = data?.last_name;
  const userAvatar = data?.avatar;
  const userAvatarSlug = data?.avatar_slug;
  const userColor = data?.color;
  const userCredits = data?.credit_count
    ? Number.parseFloat(data?.credit_count)
    : 0;
  const userOrganizationCount = data?.organizations?.length;
  const hasAccessToV1Learn = data?.active_organization?.has_access_to_v1_learn; // prettier-ignore
  // NOTE: this is a temporary thing to allow us to test the layout change
  // before rolling it out for everyone. Should be removed when new layout is
  // done and accepted. This only affects the structure of the sidebar and
  // the mobile bottom navigation.
  let useNov23StructureUpdate = false;
  if (data?.active_organization?.use_nov23_structure_update) useNov23StructureUpdate = true; // prettier-ignore
  if (data?.use_nov23_structure_update) useNov23StructureUpdate = true; // prettier-ignore

  return (
    <WebSocketContextProvider>
      <DashboardContextProvider
        initialState={{
          userId,
          userActiveOrganizationId,
          userActiveOrganizationName,
          userActiveOrganizationColor,
          userActiveOrganizationAvatar,
          userActiveOrganizationStrengthWallId,
          userActiveOrganizationUserCount,
          userActiveGroupId,
          userActiveGroupName,
          userActiveGroupStrengthWallId,
          userStrengthWallId,
          userFirstName,
          userLastName,
          userAvatar,
          userAvatarSlug,
          userColor,
          userTopStrengths,
          userCredits,
          userOrganizationCount,
          organizationFeedHasNewContent: false,
          hasAccessToV1Learn,
          useNov23StructureUpdate,
        }}
      >
        <LineBelowStickyHeader isShown={useNov23StructureUpdate} />
        <div className="relative mx-auto h-full w-full max-w-[1200px]">
          <DashboardLayoutFixedSidebar side="left">
            {useNov23StructureUpdate ? (
              <div className="h-screen overflow-y-auto">
                <div className="w-full px-6 pt-6">
                  <div className="ml-1">
                    <Link href="/">
                      <Varis height={30} style={{color: '#FDD662'}} />
                    </Link>
                  </div>

                  <div className="mt-8 flex flex-col items-start">
                    <SidebarNavigationNew />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="w-full px-6 pt-6">
                  <Link href="/">
                    <Varis
                      height={30}
                      style={{color: '#FDD662'}}
                      className="mb-16"
                    />
                  </Link>

                  <div className="mb-12 flex flex-col items-start p-2">
                    <SidebarNavigation />
                  </div>

                  <SeeTheGoodButtonOnSidebar />
                </div>
              </div>
            )}
          </DashboardLayoutFixedSidebar>

          {/*
            NOTE: the children should define either:
            <DashboardLayoutMain hasSidebarsOnSide="both" />
            <DashboardLayoutFixedSidebar side="right" />
            OR
            <DashboardLayoutMain hasSidebarsOnSide="left" />
            */}

          {children}
          <BottomNavigationOffset />
        </div>
        {useNov23StructureUpdate ? (
          <BottomNavigationNew />
        ) : (
          <BottomNavigation />
        )}
        <MomentListener />
        <DashboardAccessRecorder />
        <DirectusAuthRefresh />
      </DashboardContextProvider>
    </WebSocketContextProvider>
  );
}
