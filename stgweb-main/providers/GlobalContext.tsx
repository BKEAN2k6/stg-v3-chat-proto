'use client';

import {type ReactNode, createContext, useState} from 'react';

export type GlobalState = {
  inClient: boolean;
  userAuthToken?: string;
};

type GlobalContextType = [
  GlobalState,
  React.Dispatch<React.SetStateAction<GlobalState>>,
];

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

type Props = {
  readonly children: ReactNode;
  readonly initialState: GlobalState;
};

export const GlobalContextProvider = ({children, initialState}: Props) => {
  // eslint-disable-next-line react/hook-use-state
  const state = useState<GlobalState>(initialState || {});

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  );
};
