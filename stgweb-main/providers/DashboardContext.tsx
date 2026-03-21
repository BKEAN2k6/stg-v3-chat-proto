'use client';

import {type ReactNode, createContext, useState} from 'react';
import {type StrengthSlug} from '@/lib/strength-data';
import {type StrengthPieChartItem} from '@/components/atomic/organisms/StrengthPieChart';

export type DashboardState = {
  lastIncrementedStrength?: {slug: StrengthSlug; timestamp: number};
  userId: string | undefined;
  userActiveOrganizationId: string | undefined;
  userActiveOrganizationName: string | undefined;
  userActiveOrganizationColor: string | undefined;
  userActiveOrganizationAvatar: string | undefined;
  userActiveOrganizationStrengthWallId: string | undefined;
  userActiveOrganizationUserCount: number;
  userActiveGroupId: string | undefined;
  userActiveGroupName: string | undefined;
  userActiveGroupStrengthWallId: string | undefined;
  userStrengthWallId: string | undefined;
  userFirstName: string | undefined;
  userLastName: string | undefined;
  userAvatar: string | undefined;
  userAvatarSlug: string | undefined;
  userColor: string | undefined;
  userTopStrengths: StrengthPieChartItem[];
  userCredits: number | undefined;
  userOrganizationCount: number | undefined;
  organizationFeedHasNewContent: boolean;
  hasAccessToV1Learn: boolean;
  useNov23StructureUpdate: boolean;
};

type DashboardContextType = [
  DashboardState,
  React.Dispatch<React.SetStateAction<DashboardState>>,
];

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

type Props = {
  readonly children: ReactNode;
  readonly initialState: DashboardState;
};

export const DashboardContextProvider = ({children, initialState}: Props) => {
  // eslint-disable-next-line react/hook-use-state
  const state = useState<DashboardState>(initialState || {});

  return (
    <DashboardContext.Provider value={state}>
      {children}
    </DashboardContext.Provider>
  );
};
