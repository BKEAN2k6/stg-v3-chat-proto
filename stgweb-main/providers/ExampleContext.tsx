'use client';

import {createContext, useState} from 'react';

export type DashboardState = {
  x: string;
};

type DashboardContextType = [
  DashboardState,
  React.Dispatch<React.SetStateAction<DashboardState>>,
];

export const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardContextProvider = ({children}: any) => {
  // eslint-disable-next-line react/hook-use-state
  const state = useState<DashboardState>({
    x: 'y',
  });

  return (
    <DashboardContext.Provider value={state}>
      {children}
    </DashboardContext.Provider>
  );
};
