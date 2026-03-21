// This file is auto-generated

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import api, {type ApiError} from '@client/ApiClient.js';
import type * as ApiTypes from '@client/ApiTypes.js';

const extractId = (
  value: unknown,
  key: string,
): string | number | undefined => {
  if (typeof value !== 'object' || value === null) return undefined;
  const idValue = (value as Record<string, unknown>)[key];
  return typeof idValue === 'string' || typeof idValue === 'number'
    ? idValue
    : undefined;
};

export const useGetMyLastActiveGroupsQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetMyLastActiveGroupsResponse,
      ApiError,
      ApiTypes.GetMyLastActiveGroupsResponse,
      readonly ['lastActiveGroups', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['lastActiveGroups', 'list'] as const;
  return useQuery<
    ApiTypes.GetMyLastActiveGroupsResponse,
    ApiError,
    ApiTypes.GetMyLastActiveGroupsResponse,
    readonly ['lastActiveGroups', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getMyLastActiveGroups();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useUpdateMyLastActiveGroupsMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateMyLastActiveGroupsResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateMyLastActiveGroupsParameters;
      payload: ApiTypes.UpdateMyLastActiveGroupsRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateMyLastActiveGroupsResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateMyLastActiveGroupsParameters;
      payload: ApiTypes.UpdateMyLastActiveGroupsRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateMyLastActiveGroups(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['lastActiveGroups', 'list'],
      });
    },
    ...options,
  });
};

export const useGetCommunityGroupsQuery = (
  pathParameters: ApiTypes.GetCommunityGroupsParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCommunityGroupsResponse,
      ApiError,
      ApiTypes.GetCommunityGroupsResponse,
      readonly ['group', 'list', string]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['group', 'list', pathParameters.id] as const;
  return useQuery<
    ApiTypes.GetCommunityGroupsResponse,
    ApiError,
    ApiTypes.GetCommunityGroupsResponse,
    readonly ['group', 'list', string]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCommunityGroups(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useCreateCommunityGroupMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateCommunityGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateCommunityGroupParameters;
      payload: ApiTypes.CreateCommunityGroupRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateCommunityGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateCommunityGroupParameters;
      payload: ApiTypes.CreateCommunityGroupRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.createCommunityGroup(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({queryKey: ['group', 'list']});
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['group', 'list', variables.pathParameters.id],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({queryKey: ['group', 'list']});
      if (id !== undefined) {
        queryClient.setQueryData(['group', 'detail', {id}], () => data);
      }
    },
    ...options,
  });
};

export const useGetGroupQuery = (
  pathParameters: ApiTypes.GetGroupParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetGroupResponse,
      ApiError,
      ApiTypes.GetGroupResponse,
      readonly ['group', 'detail', {id: ApiTypes.GetGroupParameters['id']}]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['group', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetGroupResponse,
    ApiError,
    ApiTypes.GetGroupResponse,
    readonly ['group', 'detail', {id: ApiTypes.GetGroupParameters['id']}]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getGroup(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateGroupMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateGroupParameters;
      payload: ApiTypes.UpdateGroupRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateGroupParameters;
      payload: ApiTypes.UpdateGroupRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateGroup(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['group', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({queryKey: ['group', 'list']});
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useCreateGroupArticleProgressMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateGroupArticleProgressResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateGroupArticleProgressParameters;
      payload: ApiTypes.CreateGroupArticleProgressRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateGroupArticleProgressResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateGroupArticleProgressParameters;
      payload: ApiTypes.CreateGroupArticleProgressRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.createGroupArticleProgress(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const parentId = variables.pathParameters.id;
      if (!parentId) return;

      queryClient.setQueryData(['group', 'detail', {id: parentId}], (old) => {
        if (!old) return old;
        const previous =
          (old as {articleProgress?: Array<typeof data>}).articleProgress ?? [];
        return {...old, articleProgress: [...previous, data]};
      });

      const listQ = queryClient.getQueriesData({queryKey: ['group', 'list']});
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{
          id: typeof parentId;
          articleProgress?: Array<typeof data>;
        }>;
        const updated = array.map((item) =>
          item.id === parentId
            ? {
                ...item,
                articleProgress: [...(item.articleProgress ?? []), data],
              }
            : item,
        );
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useGetAiGuidanceQuery = (
  pathParameters: ApiTypes.GetAiGuidanceParameters,
  queryParameters?: ApiTypes.GetAiGuidanceQuery,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetAiGuidanceResponse,
      ApiError,
      ApiTypes.GetAiGuidanceResponse,
      readonly [
        'group',
        'detail',
        {id: ApiTypes.GetAiGuidanceParameters['id']},
        ApiTypes.GetAiGuidanceQuery | Record<string, unknown>,
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const parameters: ApiTypes.GetAiGuidanceQuery = queryParameters ?? {};
  const queryKey = [
    'group',
    'detail',
    {id: pathParameters.id},
    parameters,
  ] as const;
  return useQuery<
    ApiTypes.GetAiGuidanceResponse,
    ApiError,
    ApiTypes.GetAiGuidanceResponse,
    readonly [
      'group',
      'detail',
      {id: ApiTypes.GetAiGuidanceParameters['id']},
      ApiTypes.GetAiGuidanceQuery | Record<string, unknown>,
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getAiGuidance(pathParameters, parameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetGroupStatsQuery = (
  pathParameters: ApiTypes.GetGroupStatsParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetGroupStatsResponse,
      ApiError,
      ApiTypes.GetGroupStatsResponse,
      readonly [
        'groupStats',
        'detail',
        {id: ApiTypes.GetGroupStatsParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['groupStats', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetGroupStatsResponse,
    ApiError,
    ApiTypes.GetGroupStatsResponse,
    readonly [
      'groupStats',
      'detail',
      {id: ApiTypes.GetGroupStatsParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getGroupStats(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetCommunitiesQuery = (
  queryParameters?: ApiTypes.GetCommunitiesQuery,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCommunitiesResponse,
      ApiError,
      ApiTypes.GetCommunitiesResponse,
      readonly [
        'community',
        'list',
        ApiTypes.GetCommunitiesQuery | Record<string, unknown>,
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const parameters: ApiTypes.GetCommunitiesQuery = queryParameters ?? {};
  const queryKey = ['community', 'list', parameters] as const;
  return useQuery<
    ApiTypes.GetCommunitiesResponse,
    ApiError,
    ApiTypes.GetCommunitiesResponse,
    readonly [
      'community',
      'list',
      ApiTypes.GetCommunitiesQuery | Record<string, unknown>,
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCommunities(parameters);
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateCommunityMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateCommunityResponse,
    ApiError,
    {payload: ApiTypes.CreateCommunityRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateCommunityResponse,
    ApiError,
    {payload: ApiTypes.CreateCommunityRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createCommunity(variables.payload);
      return result;
    },
    async onSuccess(data) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['community', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['community', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({queryKey: ['community', 'list']});
      if (id !== undefined) {
        queryClient.setQueryData(['community', 'detail', {id}], () => data);
      }
    },
    ...options,
  });
};

export const useGetCommunityQuery = (
  pathParameters: ApiTypes.GetCommunityParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCommunityResponse,
      ApiError,
      ApiTypes.GetCommunityResponse,
      readonly [
        'community',
        'detail',
        {id: ApiTypes.GetCommunityParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['community', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetCommunityResponse,
    ApiError,
    ApiTypes.GetCommunityResponse,
    readonly [
      'community',
      'detail',
      {id: ApiTypes.GetCommunityParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCommunity(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateCommunityMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCommunityResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunityParameters;
      payload: ApiTypes.UpdateCommunityRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCommunityResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunityParameters;
      payload: ApiTypes.UpdateCommunityRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCommunity(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['community', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['community', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useUpdateCommunityBillingGroupMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCommunityBillingGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunityBillingGroupParameters;
      payload: ApiTypes.UpdateCommunityBillingGroupRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCommunityBillingGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunityBillingGroupParameters;
      payload: ApiTypes.UpdateCommunityBillingGroupRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCommunityBillingGroup(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['community', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['community', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useUpdateCommunitySubscriptionMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCommunitySubscriptionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunitySubscriptionParameters;
      payload: ApiTypes.UpdateCommunitySubscriptionRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCommunitySubscriptionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCommunitySubscriptionParameters;
      payload: ApiTypes.UpdateCommunitySubscriptionRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCommunitySubscription(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (id !== undefined) {
        await queryClient.invalidateQueries({
          queryKey: ['community', 'detail', {id}],
        });
      }

      await queryClient.invalidateQueries({queryKey: ['community', 'list']});
    },
    ...options,
  });
};

export const useGetArticleQuery = (
  pathParameters: ApiTypes.GetArticleParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetArticleResponse,
      ApiError,
      ApiTypes.GetArticleResponse,
      readonly ['article', 'detail', {id: ApiTypes.GetArticleParameters['id']}]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['article', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetArticleResponse,
    ApiError,
    ApiTypes.GetArticleResponse,
    readonly ['article', 'detail', {id: ApiTypes.GetArticleParameters['id']}]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getArticle(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetTimelineArticlesQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetTimelineArticlesResponse,
      ApiError,
      ApiTypes.GetTimelineArticlesResponse,
      readonly ['timeline-article', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['timeline-article', 'list'] as const;
  return useQuery<
    ApiTypes.GetTimelineArticlesResponse,
    ApiError,
    ApiTypes.GetTimelineArticlesResponse,
    readonly ['timeline-article', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getTimelineArticles();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useGetArticleCategoryQuery = (
  pathParameters: ApiTypes.GetArticleCategoryParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetArticleCategoryResponse,
      ApiError,
      ApiTypes.GetArticleCategoryResponse,
      readonly [
        'articleCategory',
        'detail',
        {id: ApiTypes.GetArticleCategoryParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = [
    'articleCategory',
    'detail',
    {id: pathParameters.id},
  ] as const;
  return useQuery<
    ApiTypes.GetArticleCategoryResponse,
    ApiError,
    ApiTypes.GetArticleCategoryResponse,
    readonly [
      'articleCategory',
      'detail',
      {id: ApiTypes.GetArticleCategoryParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getArticleCategory(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetStrengthGoalsQuery = (
  pathParameters: ApiTypes.GetStrengthGoalsParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetStrengthGoalsResponse,
      ApiError,
      ApiTypes.GetStrengthGoalsResponse,
      readonly ['strengthGoal', 'list', string]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['strengthGoal', 'list', pathParameters.id] as const;
  return useQuery<
    ApiTypes.GetStrengthGoalsResponse,
    ApiError,
    ApiTypes.GetStrengthGoalsResponse,
    readonly ['strengthGoal', 'list', string]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getStrengthGoals(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useCreateStrengthGoalMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateStrengthGoalResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateStrengthGoalParameters;
      payload: ApiTypes.CreateStrengthGoalRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateStrengthGoalResponse,
    ApiError,
    {
      pathParameters: ApiTypes.CreateStrengthGoalParameters;
      payload: ApiTypes.CreateStrengthGoalRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.createStrengthGoal(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['strengthGoal', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['strengthGoal', 'list', variables.pathParameters.id],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({queryKey: ['strengthGoal', 'list']});
      if (id !== undefined) {
        queryClient.setQueryData(['strengthGoal', 'detail', {id}], () => data);
      }
    },
    ...options,
  });
};

export const useRemoveStrengthGoalsByStrengthMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {
      pathParameters: ApiTypes.RemoveStrengthGoalsByStrengthParameters;
      queryParams: ApiTypes.RemoveStrengthGoalsByStrengthQuery;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {
      pathParameters: ApiTypes.RemoveStrengthGoalsByStrengthParameters;
      queryParams: ApiTypes.RemoveStrengthGoalsByStrengthQuery;
    }
  >({
    async mutationFn(variables) {
      await api.removeStrengthGoalsByStrength(
        variables.pathParameters,
        variables.queryParams,
      );
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({
        queryKey: ['strengthGoal', 'list', variables.pathParameters.id],
      });
    },
    ...options,
  });
};

export const useGetStrengthGoalQuery = (
  pathParameters: ApiTypes.GetStrengthGoalParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetStrengthGoalResponse,
      ApiError,
      ApiTypes.GetStrengthGoalResponse,
      readonly [
        'strengthGoal',
        'detail',
        {id: ApiTypes.GetStrengthGoalParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['strengthGoal', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetStrengthGoalResponse,
    ApiError,
    ApiTypes.GetStrengthGoalResponse,
    readonly [
      'strengthGoal',
      'detail',
      {id: ApiTypes.GetStrengthGoalParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getStrengthGoal(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateStrengthGoalMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateStrengthGoalResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateStrengthGoalParameters;
      payload: ApiTypes.UpdateStrengthGoalRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateStrengthGoalResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateStrengthGoalParameters;
      payload: ApiTypes.UpdateStrengthGoalRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateStrengthGoal(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['strengthGoal', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['strengthGoal', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useRemoveStrengthGoalMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveStrengthGoalParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveStrengthGoalParameters}
  >({
    async mutationFn(variables) {
      await api.removeStrengthGoal(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;

      const listQ = queryClient.getQueriesData({
        queryKey: ['strengthGoal', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.filter((item) => item.id !== id);
        queryClient.setQueryData(key, updated);
      }

      queryClient.removeQueries({queryKey: ['strengthGoal', 'detail', {id}]});
    },
    ...options,
  });
};

export const useCreateStrengthGoalEventMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateStrengthGoalEventResponse,
    ApiError,
    {pathParameters: ApiTypes.CreateStrengthGoalEventParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateStrengthGoalEventResponse,
    ApiError,
    {pathParameters: ApiTypes.CreateStrengthGoalEventParameters}
  >({
    async mutationFn(variables) {
      const result = await api.createStrengthGoalEvent(
        variables.pathParameters,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const parentId = variables.pathParameters.id;
      if (!parentId) return;

      queryClient.setQueryData(
        ['strengthGoal', 'detail', {id: parentId}],
        (old) => {
          if (!old) return old;
          const previous = (old as {events?: Array<typeof data>}).events ?? [];
          return {...old, events: [...previous, data]};
        },
      );

      const listQ = queryClient.getQueriesData({
        queryKey: ['strengthGoal', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{
          id: typeof parentId;
          events?: Array<typeof data>;
        }>;
        const updated = array.map((item) =>
          item.id === parentId
            ? {...item, events: [...(item.events ?? []), data]}
            : item,
        );
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useGetGroupStrengthCompletedCountQuery = (
  pathParameters: ApiTypes.GetGroupStrengthCompletedCountParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetGroupStrengthCompletedCountResponse,
      ApiError,
      ApiTypes.GetGroupStrengthCompletedCountResponse,
      readonly [
        'strengthCompletedCount',
        'detail',
        {id: ApiTypes.GetGroupStrengthCompletedCountParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = [
    'strengthCompletedCount',
    'detail',
    {id: pathParameters.id},
  ] as const;
  return useQuery<
    ApiTypes.GetGroupStrengthCompletedCountResponse,
    ApiError,
    ApiTypes.GetGroupStrengthCompletedCountResponse,
    readonly [
      'strengthCompletedCount',
      'detail',
      {id: ApiTypes.GetGroupStrengthCompletedCountParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getGroupStrengthCompletedCount(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetBillingContactsQuery = (
  queryParameters?: ApiTypes.GetBillingContactsQuery,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetBillingContactsResponse,
      ApiError,
      ApiTypes.GetBillingContactsResponse,
      readonly [
        'billingContact',
        'list',
        ApiTypes.GetBillingContactsQuery | Record<string, unknown>,
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const parameters: ApiTypes.GetBillingContactsQuery = queryParameters ?? {};
  const queryKey = ['billingContact', 'list', parameters] as const;
  return useQuery<
    ApiTypes.GetBillingContactsResponse,
    ApiError,
    ApiTypes.GetBillingContactsResponse,
    readonly [
      'billingContact',
      'list',
      ApiTypes.GetBillingContactsQuery | Record<string, unknown>,
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getBillingContacts(parameters);
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateBillingContactMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateBillingContactResponse,
    ApiError,
    {payload: ApiTypes.CreateBillingContactRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateBillingContactResponse,
    ApiError,
    {payload: ApiTypes.CreateBillingContactRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createBillingContact(variables.payload);
      return result;
    },
    async onSuccess(data) {
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['billingContact', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['billingContact', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ['billingContact', 'list'],
      });
    },
    ...options,
  });
};

export const useUpdateBillingContactMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateBillingContactResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingContactParameters;
      payload: ApiTypes.UpdateBillingContactRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateBillingContactResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingContactParameters;
      payload: ApiTypes.UpdateBillingContactRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateBillingContact(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['billingContact', 'list'],
      });
    },
    ...options,
  });
};

export const useRemoveBillingContactMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveBillingContactParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveBillingContactParameters}
  >({
    async mutationFn(variables) {
      await api.removeBillingContact(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      await queryClient.invalidateQueries({
        queryKey: ['billingContact', 'list', variables.pathParameters.id],
      });
    },
    ...options,
  });
};

export const useGetBillingGroupsQuery = (
  queryParameters?: ApiTypes.GetBillingGroupsQuery,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetBillingGroupsResponse,
      ApiError,
      ApiTypes.GetBillingGroupsResponse,
      readonly [
        'billingGroup',
        'list',
        ApiTypes.GetBillingGroupsQuery | Record<string, unknown>,
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const parameters: ApiTypes.GetBillingGroupsQuery = queryParameters ?? {};
  const queryKey = ['billingGroup', 'list', parameters] as const;
  return useQuery<
    ApiTypes.GetBillingGroupsResponse,
    ApiError,
    ApiTypes.GetBillingGroupsResponse,
    readonly [
      'billingGroup',
      'list',
      ApiTypes.GetBillingGroupsQuery | Record<string, unknown>,
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getBillingGroups(parameters);
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateBillingGroupMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateBillingGroupResponse,
    ApiError,
    {payload: ApiTypes.CreateBillingGroupRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateBillingGroupResponse,
    ApiError,
    {payload: ApiTypes.CreateBillingGroupRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createBillingGroup(variables.payload);
      return result;
    },
    async onSuccess(data) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['billingGroup', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['billingGroup', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({queryKey: ['billingGroup', 'list']});
      if (id !== undefined) {
        queryClient.setQueryData(['billingGroup', 'detail', {id}], () => data);
      }
    },
    ...options,
  });
};

export const useGetBillingGroupQuery = (
  pathParameters: ApiTypes.GetBillingGroupParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetBillingGroupResponse,
      ApiError,
      ApiTypes.GetBillingGroupResponse,
      readonly [
        'billingGroup',
        'detail',
        {id: ApiTypes.GetBillingGroupParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['billingGroup', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetBillingGroupResponse,
    ApiError,
    ApiTypes.GetBillingGroupResponse,
    readonly [
      'billingGroup',
      'detail',
      {id: ApiTypes.GetBillingGroupParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getBillingGroup(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useRemoveBillingGroupMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveBillingGroupParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveBillingGroupParameters}
  >({
    async mutationFn(variables) {
      await api.removeBillingGroup(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;

      const listQ = queryClient.getQueriesData({
        queryKey: ['billingGroup', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.filter((item) => item.id !== id);
        queryClient.setQueryData(key, updated);
      }

      queryClient.removeQueries({queryKey: ['billingGroup', 'detail', {id}]});
    },
    ...options,
  });
};

export const useUpdateBillingGroupMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateBillingGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingGroupParameters;
      payload: ApiTypes.UpdateBillingGroupRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateBillingGroupResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingGroupParameters;
      payload: ApiTypes.UpdateBillingGroupRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateBillingGroup(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['billingGroup', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['billingGroup', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useUpdateBillingGroupSubscriptionMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateBillingGroupSubscriptionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingGroupSubscriptionParameters;
      payload: ApiTypes.UpdateBillingGroupSubscriptionRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateBillingGroupSubscriptionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateBillingGroupSubscriptionParameters;
      payload: ApiTypes.UpdateBillingGroupSubscriptionRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateBillingGroupSubscription(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['billingGroup', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['billingGroup', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useGetAiGuidanceLogsQuery = (
  queryParameters?: ApiTypes.GetAiGuidanceLogsQuery,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetAiGuidanceLogsResponse,
      ApiError,
      ApiTypes.GetAiGuidanceLogsResponse,
      readonly [
        'aiGuidanceLog',
        'list',
        ApiTypes.GetAiGuidanceLogsQuery | Record<string, unknown>,
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const parameters: ApiTypes.GetAiGuidanceLogsQuery = queryParameters ?? {};
  const queryKey = ['aiGuidanceLog', 'list', parameters] as const;
  return useQuery<
    ApiTypes.GetAiGuidanceLogsResponse,
    ApiError,
    ApiTypes.GetAiGuidanceLogsResponse,
    readonly [
      'aiGuidanceLog',
      'list',
      ApiTypes.GetAiGuidanceLogsQuery | Record<string, unknown>,
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getAiGuidanceLogs(parameters);
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useGetAiGuidanceLogByIdQuery = (
  pathParameters: ApiTypes.GetAiGuidanceLogByIdParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetAiGuidanceLogByIdResponse,
      ApiError,
      ApiTypes.GetAiGuidanceLogByIdResponse,
      readonly [
        'aiGuidanceLog',
        'detail',
        {id: ApiTypes.GetAiGuidanceLogByIdParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = [
    'aiGuidanceLog',
    'detail',
    {id: pathParameters.id},
  ] as const;
  return useQuery<
    ApiTypes.GetAiGuidanceLogByIdResponse,
    ApiError,
    ApiTypes.GetAiGuidanceLogByIdResponse,
    readonly [
      'aiGuidanceLog',
      'detail',
      {id: ApiTypes.GetAiGuidanceLogByIdParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getAiGuidanceLogById(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useGetCoachingPlansQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingPlansResponse,
      ApiError,
      ApiTypes.GetCoachingPlansResponse,
      readonly ['coachingPlan', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['coachingPlan', 'list'] as const;
  return useQuery<
    ApiTypes.GetCoachingPlansResponse,
    ApiError,
    ApiTypes.GetCoachingPlansResponse,
    readonly ['coachingPlan', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingPlans();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateCoachingPlanMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateCoachingPlanResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingPlanRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateCoachingPlanResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingPlanRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createCoachingPlan(variables.payload);
      return result;
    },
    async onSuccess(data) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingPlan', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['coachingPlan', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({queryKey: ['coachingPlan', 'list']});
      if (id !== undefined) {
        queryClient.setQueryData(['coachingPlan', 'detail', {id}], () => data);
      }
    },
    ...options,
  });
};

export const useGetCoachingPlanQuery = (
  pathParameters: ApiTypes.GetCoachingPlanParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingPlanResponse,
      ApiError,
      ApiTypes.GetCoachingPlanResponse,
      readonly [
        'coachingPlan',
        'detail',
        {id: ApiTypes.GetCoachingPlanParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['coachingPlan', 'detail', {id: pathParameters.id}] as const;
  return useQuery<
    ApiTypes.GetCoachingPlanResponse,
    ApiError,
    ApiTypes.GetCoachingPlanResponse,
    readonly [
      'coachingPlan',
      'detail',
      {id: ApiTypes.GetCoachingPlanParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingPlan(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateCoachingPlanMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCoachingPlanResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingPlanParameters;
      payload: ApiTypes.UpdateCoachingPlanRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCoachingPlanResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingPlanParameters;
      payload: ApiTypes.UpdateCoachingPlanRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCoachingPlan(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['coachingPlan', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingPlan', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useRemoveCoachingPlanMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingPlanParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingPlanParameters}
  >({
    async mutationFn(variables) {
      await api.removeCoachingPlan(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingPlan', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.filter((item) => item.id !== id);
        queryClient.setQueryData(key, updated);
      }

      queryClient.removeQueries({queryKey: ['coachingPlan', 'detail', {id}]});
    },
    ...options,
  });
};

export const useGetCoachingSessionsQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingSessionsResponse,
      ApiError,
      ApiTypes.GetCoachingSessionsResponse,
      readonly ['coachingSession', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['coachingSession', 'list'] as const;
  return useQuery<
    ApiTypes.GetCoachingSessionsResponse,
    ApiError,
    ApiTypes.GetCoachingSessionsResponse,
    readonly ['coachingSession', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingSessions();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateCoachingSessionMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateCoachingSessionResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingSessionRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateCoachingSessionResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingSessionRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createCoachingSession(variables.payload);
      return result;
    },
    async onSuccess(data) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingSession', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['coachingSession', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ['coachingSession', 'list'],
      });
      if (id !== undefined) {
        queryClient.setQueryData(
          ['coachingSession', 'detail', {id}],
          () => data,
        );
      }
    },
    ...options,
  });
};

export const useGetCoachingSessionQuery = (
  pathParameters: ApiTypes.GetCoachingSessionParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingSessionResponse,
      ApiError,
      ApiTypes.GetCoachingSessionResponse,
      readonly [
        'coachingSession',
        'detail',
        {id: ApiTypes.GetCoachingSessionParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = [
    'coachingSession',
    'detail',
    {id: pathParameters.id},
  ] as const;
  return useQuery<
    ApiTypes.GetCoachingSessionResponse,
    ApiError,
    ApiTypes.GetCoachingSessionResponse,
    readonly [
      'coachingSession',
      'detail',
      {id: ApiTypes.GetCoachingSessionParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingSession(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateCoachingSessionMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCoachingSessionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingSessionParameters;
      payload: ApiTypes.UpdateCoachingSessionRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCoachingSessionResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingSessionParameters;
      payload: ApiTypes.UpdateCoachingSessionRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCoachingSession(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(['coachingSession', 'detail', {id}], () => data);

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingSession', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useRemoveCoachingSessionMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingSessionParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingSessionParameters}
  >({
    async mutationFn(variables) {
      await api.removeCoachingSession(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingSession', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.filter((item) => item.id !== id);
        queryClient.setQueryData(key, updated);
      }

      queryClient.removeQueries({
        queryKey: ['coachingSession', 'detail', {id}],
      });
    },
    ...options,
  });
};

export const useSendCoachingMessageMutation = (
  options?: UseMutationOptions<
    ApiTypes.SendCoachingMessageResponse,
    ApiError,
    {
      pathParameters: ApiTypes.SendCoachingMessageParameters;
      payload: ApiTypes.SendCoachingMessageRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.SendCoachingMessageResponse,
    ApiError,
    {
      pathParameters: ApiTypes.SendCoachingMessageParameters;
      payload: ApiTypes.SendCoachingMessageRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.sendCoachingMessage(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const parentId = variables.pathParameters.id;
      if (!parentId) return;

      queryClient.setQueryData(
        ['coachingSession', 'detail', {id: parentId}],
        (old) => {
          if (!old) return old;
          const previous =
            (old as {messages?: Array<typeof data>}).messages ?? [];
          return {...old, messages: [...previous, data]};
        },
      );

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingSession', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{
          id: typeof parentId;
          messages?: Array<typeof data>;
        }>;
        const updated = array.map((item) =>
          item.id === parentId
            ? {...item, messages: [...(item.messages ?? []), data]}
            : item,
        );
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useGetAvailableCoachingPlansQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetAvailableCoachingPlansResponse,
      ApiError,
      ApiTypes.GetAvailableCoachingPlansResponse,
      readonly ['availableCoachingPlan', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['availableCoachingPlan', 'list'] as const;
  return useQuery<
    ApiTypes.GetAvailableCoachingPlansResponse,
    ApiError,
    ApiTypes.GetAvailableCoachingPlansResponse,
    readonly ['availableCoachingPlan', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getAvailableCoachingPlans();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useGetAllCoachingSessionsQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetAllCoachingSessionsResponse,
      ApiError,
      ApiTypes.GetAllCoachingSessionsResponse,
      readonly ['adminCoachingSession', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['adminCoachingSession', 'list'] as const;
  return useQuery<
    ApiTypes.GetAllCoachingSessionsResponse,
    ApiError,
    ApiTypes.GetAllCoachingSessionsResponse,
    readonly ['adminCoachingSession', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getAllCoachingSessions();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useGetCoachingBasePromptsQuery = (
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingBasePromptsResponse,
      ApiError,
      ApiTypes.GetCoachingBasePromptsResponse,
      readonly ['coachingBasePrompt', 'list']
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = ['coachingBasePrompt', 'list'] as const;
  return useQuery<
    ApiTypes.GetCoachingBasePromptsResponse,
    ApiError,
    ApiTypes.GetCoachingBasePromptsResponse,
    readonly ['coachingBasePrompt', 'list']
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingBasePrompts();
      return result;
    },
    enabled: options?.enabled ?? true,
    ...options,
  });
};

export const useCreateCoachingBasePromptMutation = (
  options?: UseMutationOptions<
    ApiTypes.CreateCoachingBasePromptResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingBasePromptRequest}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.CreateCoachingBasePromptResponse,
    ApiError,
    {payload: ApiTypes.CreateCoachingBasePromptRequest}
  >({
    async mutationFn(variables) {
      const result = await api.createCoachingBasePrompt(variables.payload);
      return result;
    },
    async onSuccess(data) {
      const id = extractId(data, 'id');
      let updatedList = false;
      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingBasePrompt', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!Array.isArray(value)) continue;
        updatedList = true;
        queryClient.setQueryData(key, [data, ...(value as Array<typeof data>)]);
      }

      if (!updatedList) {
        queryClient.setQueryData(
          ['coachingBasePrompt', 'list'],
          (old: Array<typeof data> = []) => [data, ...old],
        );
      }

      await queryClient.invalidateQueries({
        queryKey: ['coachingBasePrompt', 'list'],
      });
      if (id !== undefined) {
        queryClient.setQueryData(
          ['coachingBasePrompt', 'detail', {id}],
          () => data,
        );
      }
    },
    ...options,
  });
};

export const useGetCoachingBasePromptQuery = (
  pathParameters: ApiTypes.GetCoachingBasePromptParameters,
  options?: Omit<
    UseQueryOptions<
      ApiTypes.GetCoachingBasePromptResponse,
      ApiError,
      ApiTypes.GetCoachingBasePromptResponse,
      readonly [
        'coachingBasePrompt',
        'detail',
        {id: ApiTypes.GetCoachingBasePromptParameters['id']},
      ]
    >,
    'queryKey' | 'queryFn'
  >,
) => {
  const queryKey = [
    'coachingBasePrompt',
    'detail',
    {id: pathParameters.id},
  ] as const;
  return useQuery<
    ApiTypes.GetCoachingBasePromptResponse,
    ApiError,
    ApiTypes.GetCoachingBasePromptResponse,
    readonly [
      'coachingBasePrompt',
      'detail',
      {id: ApiTypes.GetCoachingBasePromptParameters['id']},
    ]
  >({
    queryKey,
    async queryFn() {
      const result = await api.getCoachingBasePrompt(pathParameters);
      return result;
    },
    enabled: Boolean(pathParameters) && (options?.enabled ?? true),
    ...options,
  });
};

export const useUpdateCoachingBasePromptMutation = (
  options?: UseMutationOptions<
    ApiTypes.UpdateCoachingBasePromptResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingBasePromptParameters;
      payload: ApiTypes.UpdateCoachingBasePromptRequest;
    }
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTypes.UpdateCoachingBasePromptResponse,
    ApiError,
    {
      pathParameters: ApiTypes.UpdateCoachingBasePromptParameters;
      payload: ApiTypes.UpdateCoachingBasePromptRequest;
    }
  >({
    async mutationFn(variables) {
      const result = await api.updateCoachingBasePrompt(
        variables.pathParameters,
        variables.payload,
      );
      return result;
    },
    async onSuccess(data, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;
      queryClient.setQueryData(
        ['coachingBasePrompt', 'detail', {id}],
        () => data,
      );

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingBasePrompt', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.map((item) => (item.id === id ? data : item));
        queryClient.setQueryData(key, updated);
      }
    },
    ...options,
  });
};

export const useRemoveCoachingBasePromptMutation = (
  options?: UseMutationOptions<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingBasePromptParameters}
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<
    void,
    ApiError,
    {pathParameters: ApiTypes.RemoveCoachingBasePromptParameters}
  >({
    async mutationFn(variables) {
      await api.removeCoachingBasePrompt(variables.pathParameters);
    },
    async onSuccess(_, variables) {
      const {id} = variables.pathParameters;
      if (!id) return;

      const listQ = queryClient.getQueriesData({
        queryKey: ['coachingBasePrompt', 'list'],
      });
      for (const [key, value] of listQ) {
        if (!value) continue;
        const array = value as Array<{id: typeof id}>;
        const updated = array.filter((item) => item.id !== id);
        queryClient.setQueryData(key, updated);
      }

      queryClient.removeQueries({
        queryKey: ['coachingBasePrompt', 'detail', {id}],
      });
    },
    ...options,
  });
};
