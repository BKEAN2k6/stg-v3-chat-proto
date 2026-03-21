import {useContext, useMemo} from 'react';
import {GlobalContext, type GlobalState} from '@/providers/GlobalContext';

export default function useGlobal() {
  const context = useContext(GlobalContext);

  if (!context) {
    throw new Error(
      'This component must be used within a GlobalContextProvider',
    );
  }

  const [globalState, setGlobalState] = context;

  const setState = (newState: Partial<GlobalState>) => {
    setGlobalState({...globalState, ...newState});
  };

  const cachedRender = useMemo(() => globalState.inClient, []);
  // This might be all kinds of dumb, but seems to do the trick... The idea is
  // that I want to call certain pieces of code only during subsequent page
  // loads (when traversing pages with the Next router). There might be some
  // dumb simple way to do this with Next / React, but I didn't come across
  // anything more "official" for this usease..

  // Why we need this: the codebase is generally built in a way that we get
  // initial data from the server so we need no client side spinners etc., but
  // when the user comes back to the page, we often want them to have the latest
  // data without requiring the user to manually do a refresh action. See an
  // example if this in action from Profile.tsx for example

  return {
    globalState,
    setGlobalState: setState,
    cachedRender,
  };
}
