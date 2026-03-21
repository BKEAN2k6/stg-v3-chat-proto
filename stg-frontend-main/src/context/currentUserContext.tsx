import React, {useMemo, useContext, useRef, useCallback} from 'react';
import {useSearchParams, useNavigate, useLocation} from 'react-router-dom';
import api from '@/api/ApiClient';
import {type GetMeResponse, type MagicLoginResponse} from '@/api/ApiTypes';
import {useLanguage} from '@/context/languageContext';

const communityParameterName = 'c';

type CurrenUserContexType = {
  readonly currentUser: GetMeResponse | undefined;
  readonly setCurrentUser: (user: GetMeResponse) => void;
  readonly logout: () => Promise<void>;
  readonly changeCommunity: (communityId: string) => Promise<void>;
  readonly magicLogin: (token: string) => Promise<MagicLoginResponse>;
  readonly isSuperAdmin: boolean;
};

export const CurrentUserContext = React.createContext<
  CurrenUserContexType | undefined
>(undefined);

type Props = {
  readonly children: React.ReactNode;
};

export function CurrentUserProvider({children}: Props) {
  const [currentUser, setCurrentUser] = React.useState<
    GetMeResponse | undefined
  >(undefined);
  const [searchParameters, setSearchParameters] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {changeLanguage} = useLanguage();

  const fetchCurrentUser = async () => {
    try {
      const user = await api.getMe();
      const community = searchParameters.get(communityParameterName);
      if (community && user.communities.some((c) => c._id === community)) {
        user.selectedCommunity = community;
      } else {
        searchParameters.set(communityParameterName, user.selectedCommunity);
        setSearchParameters(searchParameters, {replace: true});
      }

      changeLanguage(user.language);
      setCurrentUser(user);
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

        navigate({
          pathname: '/start',
          search: newSearchParameters.toString(),
        });
      }
    }
  };

  const magicLogin = useCallback(
    async (token: string): Promise<MagicLoginResponse> => {
      return api.magicLogin({token});
    },
    [],
  );

  const logout = async () => {
    await api.logout();
    setCurrentUser(undefined);
  };

  const fetchCurrentUserRef = useRef(fetchCurrentUser);
  React.useEffect(() => {
    void fetchCurrentUserRef.current();
  }, []);

  const handleVisibilityChange = () => {
    if (!document.hidden) {
      void fetchCurrentUserRef.current();
    }
  };

  React.useEffect(() => {
    window.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  React.useEffect(() => {
    if (!currentUser) {
      return;
    }

    const communityParameter = searchParameters.get(communityParameterName);
    const {selectedCommunity, communities} = currentUser;
    if (
      // Search parameters are not set
      selectedCommunity &&
      !communityParameter
    ) {
      searchParameters.set(communityParameterName, selectedCommunity);
      setSearchParameters(searchParameters, {replace: true});
    } else if (
      // Search parameters are set, but not the same as the current user
      selectedCommunity !== communityParameter &&
      communities.some((c) => c._id === communityParameter)
    ) {
      setCurrentUser((user) => {
        if (!user) {
          return undefined;
        }

        return {
          ...user,
          selectedCommunity: communityParameter ?? communities[0]._id,
        };
      });
    }
  }, [currentUser, searchParameters, setSearchParameters]);

  return (
    <CurrentUserContext.Provider
      value={useMemo<CurrenUserContexType>(() => {
        const changeCommunity = async (communityId: string) => {
          await api.updateMe({
            selectedCommunity: communityId,
          });

          searchParameters.set(communityParameterName, communityId);
          setSearchParameters(searchParameters);

          setCurrentUser((user) => {
            if (!user) {
              return undefined;
            }

            return {
              ...user,
              selectedCommunity: communityId,
            };
          });
        };

        return {
          currentUser,
          isSuperAdmin: currentUser?.roles.includes('super-admin') ?? false,
          logout,
          magicLogin,
          changeCommunity,
          setCurrentUser,
        };
      }, [currentUser, searchParameters, setSearchParameters, magicLogin])}
    >
      {children}
    </CurrentUserContext.Provider>
  );
}

export const useCurrentUser = () => {
  const currentUserContext = useContext(CurrentUserContext);

  if (!currentUserContext) {
    throw new Error(
      'useCurrentUser has to be used within <CurrentUserContext.Provider>',
    );
  }

  return currentUserContext;
};
