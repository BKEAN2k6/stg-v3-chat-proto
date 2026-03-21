import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import {type Group} from '@client/ApiTypes';
import {
  useGetMyLastActiveGroupsQuery,
  useGetCommunityGroupsQuery,
  useUpdateMyLastActiveGroupsMutation,
} from '@/hooks/useApi.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type ActiveGroupContextValue = {
  groups: Group[] | undefined;
  activeGroup: Group | undefined;
  setActiveGroupById: (groupId: string) => void;
};

const ActiveGroupContext = createContext<ActiveGroupContextValue | undefined>(
  undefined,
);

export function useActiveGroup(): ActiveGroupContextValue {
  const context = useContext(ActiveGroupContext);
  if (!context) {
    throw new Error(
      'useActiveGroup must be used within an ActiveGroupProvider',
    );
  }

  return context;
}

type ProviderProperties = {readonly children: ReactNode};

export function ActiveGroupProvider({children}: ProviderProperties) {
  const {currentUser} = useCurrentUser();
  const communityId = currentUser?.selectedCommunity;

  const {data: groups} = useGetCommunityGroupsQuery(
    {id: communityId!},
    {enabled: Boolean(communityId)},
  );
  const {data: lastActiveMap} = useGetMyLastActiveGroupsQuery();
  const updateMutation = useUpdateMyLastActiveGroupsMutation();
  const initialId = communityId
    ? (lastActiveMap?.[communityId] ?? undefined)
    : undefined;

  const [activeGroupId, setActiveGroupId] = useState<string | undefined>(
    initialId,
  );

  useEffect(() => {
    setActiveGroupId(initialId);
  }, [initialId]);

  const activeGroup = groups?.find((g) => g.id === activeGroupId) ?? undefined;

  const setActiveGroupById = useCallback(
    (groupId: string) => {
      setActiveGroupId(groupId);
      if (communityId) {
        updateMutation.mutate(
          {pathParameters: {id: communityId}, payload: groupId},
          {
            onError(error) {
              console.error('Failed to update last active group', error);
            },
          },
        );
      }
    },
    [communityId, updateMutation],
  );

  const contextValue = useMemo(
    () => ({groups, activeGroup, setActiveGroupById}),
    [groups, activeGroup, setActiveGroupById],
  );

  return (
    <ActiveGroupContext.Provider value={contextValue}>
      {children}
    </ActiveGroupContext.Provider>
  );
}
