import React, {useMemo, useRef} from 'react';
import {useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import api from '@client/ApiClient';
import {type GetMeResponse} from '@client/ApiTypes.js';
import {useQueryClient} from '@tanstack/react-query';
import {useLanguage} from '@/context/languageContext.js';

const communityParameterName = 'c';

type CurrenUserContexType = {
  readonly currentUser: GetMeResponse | undefined;
  readonly setCurrentUser: (user: GetMeResponse) => void;
  readonly logout: () => Promise<void>;
  readonly changeCommunity: (communityId: string) => Promise<void>;
  readonly isSuperAdmin: boolean;
};

export const CurrentUserContext = React.createContext<
  CurrenUserContexType | undefined
>(undefined);

type Properties = {
  readonly children: React.ReactNode;
};

export function CurrentUserProvider({children}: Properties) {
  const [currentUser, setCurrentUser] = React.useState<
    GetMeResponse | undefined
  >(undefined);
  const [searchParameters, setSearchParameters] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {changeLanguage} = useLanguage();

  const fetchCurrentUser = async () => {
    try {
      const user = await api.getMe();
      const community = searchParameters.get(communityParameterName);
      if (community && user.communities.some((c) => c.id === community)) {
        user.selectedCommunity = community;
      } else {
        searchParameters.set(communityParameterName, user.selectedCommunity);
        setSearchParameters(searchParameters, {replace: true});
      }

      changeLanguage(user.language);
      setCurrentUser(user);

      if (user.roles.includes('super-admin')) {
        localStorage.setItem('umami.disabled', 'true');
      } else {
        localStorage.removeItem('umami.disabled');
        umami.identify({
          community: user.communities.find(
            (c) => c.id === user.selectedCommunity,
          )?.name,
          userId: user.id,
        });
      }
    } catch {
      if (
        location.pathname !== '/start' &&
        location.pathname !== '/auth-callback'
      ) {
        const newSearchParameters = new URLSearchParams();
        if (location.pathname !== '/') {
          newSearchParameters.set(
            'redirect',
            `${location.pathname}${location.search}`,
          );
          newSearchParameters.set('showLogin', 'true');
        }

        navigate({pathname: '/start', search: newSearchParameters.toString()});
      }
    }
  };

  const logout = React.useCallback(async () => {
    await api.logout();
    queryClient.clear();
    setCurrentUser(undefined);
  }, [queryClient]);

  const fetchCurrentUserReference = useRef(fetchCurrentUser);
  React.useEffect(() => {
    void fetchCurrentUserReference.current();
  }, []);

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      void fetchCurrentUserReference.current();
    }
  };

  React.useEffect(() => {
    globalThis.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      globalThis.removeEventListener(
        'visibilitychange',
        handleVisibilityChange,
      );
    };
  }, []);

  React.useEffect(() => {
    if (!currentUser) return;
    const communityParameter = searchParameters.get(communityParameterName);
    const {selectedCommunity, communities} = currentUser;
    if (selectedCommunity && !communityParameter) {
      searchParameters.set(communityParameterName, selectedCommunity);
      setSearchParameters(searchParameters, {replace: true});
    } else if (
      selectedCommunity !== communityParameter &&
      communities.some((c) => c.id === communityParameter)
    ) {
      setCurrentUser((user) =>
        user
          ? {
              ...user,
              selectedCommunity: communityParameter ?? communities[0].id,
            }
          : undefined,
      );
    }
  }, [currentUser, searchParameters, setSearchParameters]);

  return (
    <CurrentUserContext.Provider
      value={useMemo<CurrenUserContexType>(() => {
        const changeCommunity = async (communityId: string) => {
          await api.updateMe({selectedCommunity: communityId});
          searchParameters.set(communityParameterName, communityId);
          setSearchParameters(searchParameters);
          setCurrentUser((user) => {
            if (!user) return undefined;
            if (!user.roles.includes('super-admin')) {
              umami.identify({
                community: user.communities.find((c) => c.id === communityId)
                  ?.name,
                userId: user.id,
              });
            }

            return {...user, selectedCommunity: communityId};
          });
        };

        return {
          currentUser,
          isSuperAdmin: currentUser?.roles.includes('super-admin') ?? false,
          logout,
          changeCommunity,
          setCurrentUser,
        };
      }, [currentUser, searchParameters, setSearchParameters, logout])}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export const useCurrentUser = () => {
  const context = React.useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      'useCurrentUser must be used within <CurrentUserContext.Provider>',
    );
  }

  return context;
};
