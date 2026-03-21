import fs from 'node:fs';
import path from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {JSDOM} from 'jsdom';
import React from 'react';
import {
  act,
  cleanup,
  renderHook,
  type RenderHookResult,
} from '@testing-library/react';
import {
  QueryClient,
  QueryClientProvider,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';
import ts from 'typescript';
import {afterAll, afterEach, beforeAll, describe, expect, it, vi} from 'vitest';
import {generateApiHooks} from './apiHooks.js';
import type {GeneratorData} from './GeneratorData.js';

(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

// Ensure React Testing Library sees a DOM
const ensureDom = () => {
  if (globalThis.window) return;
  const dom = new JSDOM('<!doctype html><html><body></body></html>');
  globalThis.window = dom.window as unknown as Window & typeof globalThis;
  globalThis.document = dom.window.document;
  Object.defineProperty(globalThis, 'navigator', {
    value: dom.window.navigator,
    configurable: true,
  });
  (globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;
};

ensureDom();

let consoleErrorSpy: ReturnType<typeof vi.spyOn> | undefined;
let consoleWarnSpy: ReturnType<typeof vi.spyOn> | undefined;

const generatorData: GeneratorData[] = [
  {path: '/ignored', method: 'get', name: 'ignoredEndpoint'},
  {
    path: '/users/:userId',
    method: 'get',
    name: 'getUser',
    responseTypeName: 'User',
    pathParameterTypeName: 'UserPath',
    queryTypeName: 'UserQuery',
    hookConfig: {
      resourceName: 'users',
      queryType: 'detail',
      keyParamName: 'userId',
    },
  },
  {
    path: '/accounts/:accountId/orders',
    method: 'get',
    name: 'getOrdersByAccount',
    responseTypeName: 'Order[]',
    pathParameterTypeName: 'AccountPath',
    hookConfig: {
      resourceName: 'orders',
      queryType: 'list',
      keyParamName: 'accountId',
    },
  },
  {
    path: '/reports',
    method: 'get',
    name: 'searchReports',
    responseTypeName: 'Report[]',
    queryTypeName: 'ReportQuery',
    hookConfig: {resourceName: 'reports', queryType: 'list'},
  },
  {
    path: '/health',
    method: 'get',
    name: 'healthCheck',
    hookConfig: {resourceName: 'health', queryType: 'list'},
  },
  {
    path: '/posts/:id',
    method: 'get',
    name: 'getPost',
    responseTypeName: 'Post',
    pathParameterTypeName: 'PostPath',
    hookConfig: {resourceName: 'posts', queryType: 'detail'},
  },
  {
    path: '/posts/:id',
    method: 'put',
    name: 'updatePost',
    responseTypeName: 'Post',
    pathParameterTypeName: 'PostPath',
    requestTypeName: 'PostPayload',
    hookConfig: {resourceName: 'posts', keyParamName: 'id'},
  },
  {
    path: '/projects/:projectId/tasks/:taskId',
    method: 'get',
    name: 'getTask',
    responseTypeName: 'Task',
    pathParameterTypeName: 'TaskPath',
    hookConfig: {
      resourceName: 'tasks',
      queryType: 'detail',
      keyParamName: 'taskId',
    },
  },
  {
    path: '/projects/:projectId/tasks',
    method: 'get',
    name: 'listTasks',
    responseTypeName: 'Task[]',
    pathParameterTypeName: 'ProjectPath',
    hookConfig: {
      resourceName: 'tasks',
      queryType: 'list',
      keyParamName: 'projectId',
    },
  },
  {
    path: '/strength-goals/:id',
    method: 'get',
    name: 'getStrengthGoal',
    responseTypeName: 'StrengthGoal',
    pathParameterTypeName: 'StrengthGoalPath',
    hookConfig: {resourceName: 'strengthGoals', queryType: 'detail'},
  },
  {
    path: '/posts/:postId/comments',
    method: 'post',
    name: 'createPostComment',
    responseTypeName: 'Comment',
    pathParameterTypeName: 'PostPath',
    requestTypeName: 'CommentPayload',
    hookConfig: {
      resourceName: 'posts',
      subResourceName: 'comments',
      keyParamName: 'postId',
    },
  },
  {
    path: '/projects/:projectId/tasks',
    method: 'post',
    name: 'createTask',
    responseTypeName: 'Task',
    pathParameterTypeName: 'ProjectPath',
    requestTypeName: 'TaskPayload',
    hookConfig: {resourceName: 'tasks', keyParamName: 'projectId'},
  },
  {
    path: '/projects',
    method: 'post',
    name: 'createProject',
    responseTypeName: 'Project',
    requestTypeName: 'ProjectPayload',
    hookConfig: {resourceName: 'projects', keyParamName: 'id'},
  },
  {
    path: '/tasks/:taskId',
    method: 'delete',
    name: 'deleteTask',
    pathParameterTypeName: 'TaskPath',
    hookConfig: {resourceName: 'tasks', keyParamName: 'taskId'},
  },
  {
    path: '/accounts/:accountId/orders',
    method: 'delete',
    name: 'deleteOrdersForAccount',
    pathParameterTypeName: 'AccountPath',
    hookConfig: {resourceName: 'orders', keyParamName: 'accountId'},
  },
  {
    path: '/strength-goals/:id',
    method: 'delete',
    name: 'removeStrengthGoalsByStrength',
    pathParameterTypeName: 'StrengthGoalPath',
    hookConfig: {resourceName: 'strengthGoals', keyParamName: 'id'},
  },
  {
    path: '/reports',
    method: 'delete',
    name: 'clearReports',
    hookConfig: {resourceName: 'reports'},
  },
  {
    path: '/users/:userId',
    method: 'put',
    name: 'updateUser',
    responseTypeName: 'User',
    pathParameterTypeName: 'UserPath',
    requestTypeName: 'UserPayload',
    queryTypeName: 'UserQuery',
    hookConfig: {resourceName: 'users', keyParamName: 'userId'},
  },
  {
    path: '/reports',
    method: 'patch',
    name: 'patchReport',
    responseTypeName: 'Report',
    requestTypeName: 'ReportPatch',
    hookConfig: {resourceName: 'reports'},
  },
  {
    path: '/ping',
    method: 'post',
    name: 'triggerPing',
    hookConfig: {resourceName: 'ping'},
  },
  {
    path: '/widgets',
    method: 'get',
    name: 'listWidgets',
    responseTypeName: 'Widget[]',
    hookConfig: {resourceName: 'widgets', queryType: 'list'},
  },
  {
    path: '/widgets/:widgetId',
    method: 'patch',
    name: 'patchWidget',
    responseTypeName: 'Widget',
    pathParameterTypeName: 'WidgetPath',
    hookConfig: {
      resourceName: 'widgets',
      queryType: 'list',
      keyParamName: 'widgetId',
    },
  },
  {
    path: '/widgets',
    method: 'post',
    name: 'createWidget',
    responseTypeName: 'Widget',
    requestTypeName: 'WidgetPayload',
    hookConfig: {resourceName: 'widgets', keyParamName: 'widgetId'},
  },
];

type HookResult = UseQueryResult | UseMutationResult<unknown, unknown>;
type HookFunction<HookArguments extends readonly unknown[]> = (
  ...arguments_: HookArguments
) => HookResult;
type GeneratedHooksModule = Record<string, HookFunction<readonly unknown[]>>;

const isMutationResult = (
  value: HookResult,
): value is UseMutationResult<unknown, unknown> => 'mutateAsync' in value;

const isQueryResult = (value: HookResult): value is UseQueryResult =>
  'refetch' in value;

const createTemporaryFile = (contents: string) => {
  const directory = fs.mkdtempSync(path.join(tmpdir(), 'api-hooks-'));
  const file = path.join(directory, 'hooks.generated.mjs');
  fs.writeFileSync(file, contents, 'utf8');
  return pathToFileURL(file).href;
};

const toRuntimeJs = (tsSource: string) =>
  ts.transpileModule(tsSource, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
      verbatimModuleSyntax: false,
      esModuleInterop: true,
      jsx: ts.JsxEmit.ReactJSX,
    },
  }).outputText;

const importGeneratedHooks = async (): Promise<{
  module: GeneratedHooksModule;
  apiMocks: Record<string, ReturnType<typeof vi.fn>>;
  queryClient: QueryClient;
}> => {
  vi.resetModules();

  const apiMocks: Record<string, ReturnType<typeof vi.fn>> = {};
  for (const {name} of generatorData) {
    apiMocks[name] = vi.fn();
  }

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {retry: false},
      mutations: {retry: false},
    },
  });

  vi.doMock('@client/ApiClient.js', () => ({
    default: apiMocks,
    ApiError: class ApiError extends Error {},
    __esModule: true,
  }));
  vi.doMock('@client/ApiTypes.js', () => ({}));

  const fileUrl = createTemporaryFile(
    toRuntimeJs(generateApiHooks(generatorData)),
  );
  const module = (await import(fileUrl)) as GeneratedHooksModule;

  return {module, apiMocks, queryClient};
};

const renderWithClient = async <HookArguments extends readonly unknown[]>(
  client: QueryClient,
  hook: HookFunction<HookArguments>,
  hookArguments: HookArguments,
): Promise<RenderHookResult<HookResult, unknown>> => {
  const wrapper = ({children}: {children: React.ReactNode}) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  let rendered: RenderHookResult<HookResult, unknown> | undefined;
  await act(async () => {
    rendered = renderHook<HookResult, unknown>(() => hook(...hookArguments), {
      wrapper,
    });
    // Allow React effects/state updates triggered during render to flush inside act
    await Promise.resolve();
  });

  if (!rendered) {
    throw new Error('Hook render failed');
  }

  return rendered;
};

const ensureHookResult = (
  result: RenderHookResult<HookResult, unknown>,
): HookResult => {
  if (!result.result.current) {
    throw new Error('Hook render returned empty result');
  }

  return result.result.current;
};

const expectQueryResult = (
  result: RenderHookResult<HookResult, unknown>,
): UseQueryResult => {
  const hookResult = ensureHookResult(result);
  if (!isQueryResult(hookResult)) {
    throw new Error('Expected query hook result');
  }

  return hookResult;
};

const expectMutationResult = (
  result: RenderHookResult<HookResult, unknown>,
): UseMutationResult<unknown, unknown> => {
  const hookResult = ensureHookResult(result);
  if (!isMutationResult(hookResult)) {
    throw new Error('Expected mutation hook result');
  }

  return hookResult;
};

beforeAll(() => {
  ensureDom();
  consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);
  consoleWarnSpy = vi
    .spyOn(console, 'warn')
    .mockImplementation(() => undefined);
});

afterAll(() => {
  consoleErrorSpy?.mockRestore();
  consoleWarnSpy?.mockRestore();
});

afterEach(() => {
  cleanup();
});

describe('generateApiHooks runtime behavior', () => {
  it('builds query hooks with proper queryKeys and caches results', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.getUser.mockResolvedValue({id: 'u1'});
    apiMocks.getPost.mockResolvedValue({id: 'p1'});
    apiMocks.getOrdersByAccount.mockResolvedValue([{id: 'o1'}]);
    apiMocks.searchReports.mockResolvedValue([{id: 'r1'}]);
    apiMocks.healthCheck.mockResolvedValue({ok: true});

    const user = await renderWithClient(
      queryClient,
      generatedHooks.useGetUserQuery,
      [{userId: 'u1'}, {page: 1}, {enabled: false}],
    );
    await act(async () => {
      await expectQueryResult(user).refetch?.();
    });
    expect(
      queryClient.getQueryData(['users', 'detail', {id: 'u1'}, {page: 1}]),
    ).toEqual({id: 'u1'});

    const orders = await renderWithClient(
      queryClient,
      generatedHooks.useGetOrdersByAccountQuery,
      [{accountId: 'a1'}, undefined, {enabled: false}],
    );
    await act(async () => {
      await expectQueryResult(orders).refetch?.();
    });
    expect(queryClient.getQueryData(['orders', 'list', 'a1'])).toEqual([
      {id: 'o1'},
    ]);

    const reports = await renderWithClient(
      queryClient,
      generatedHooks.useSearchReportsQuery,
      [{page: 2}, undefined, {enabled: false}],
    );
    await act(async () => {
      await expectQueryResult(reports).refetch?.();
    });
    expect(queryClient.getQueryData(['reports', 'list', {page: 2}])).toEqual([
      {id: 'r1'},
    ]);

    const post = await renderWithClient(
      queryClient,
      generatedHooks.useGetPostQuery,
      [{id: 'p1'}, {enabled: false}],
    );
    await act(async () => {
      await expectQueryResult(post).refetch?.();
    });
    expect(queryClient.getQueryData(['posts', 'detail', {id: 'p1'}])).toEqual({
      id: 'p1',
    });
  });

  it('updates caches for subresource creation', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    queryClient.setQueryData(['posts', 'detail', {id: 'p1'}], {
      id: 'p1',
      comments: [{id: 'c0'}],
    });
    queryClient.setQueryData(
      ['posts', 'list'],
      [{id: 'p1', comments: [{id: 'c0'}]}],
    );
    apiMocks.createPostComment.mockResolvedValue({id: 'c1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useCreatePostCommentMutation,
      [],
    );
    const createComment = expectMutationResult(mutation);
    await act(async () => {
      await createComment.mutateAsync({
        pathParameters: {postId: 'p1'},
        payload: {text: 'hi'},
      });
    });

    expect(apiMocks.createPostComment).toHaveBeenCalledWith(
      {postId: 'p1'},
      {text: 'hi'},
    );
    expect(queryClient.getQueryData(['posts', 'detail', {id: 'p1'}])).toEqual({
      id: 'p1',
      comments: [{id: 'c0'}, {id: 'c1'}],
    });
    expect(queryClient.getQueryData(['posts', 'list'])).toEqual([
      {id: 'p1', comments: [{id: 'c0'}, {id: 'c1'}]},
    ]);
  });

  it('updates list and detail caches for create operations with detail', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.createTask.mockResolvedValue({id: 't1', projectId: 'proj1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useCreateTaskMutation,
      [],
    );
    const createTask = expectMutationResult(mutation);
    await act(async () => {
      await createTask.mutateAsync({
        pathParameters: {projectId: 'proj1'},
        payload: {},
      });
    });

    expect(queryClient.getQueryData(['tasks', 'list', 'proj1'])).toEqual([
      {id: 't1', projectId: 'proj1'},
    ]);
    expect(queryClient.getQueryData(['tasks', 'detail', {id: 't1'}])).toEqual({
      id: 't1',
      projectId: 'proj1',
    });
  });

  it('updates list even when create with detail cannot extract id', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.createTask.mockResolvedValue({projectId: 'proj1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useCreateTaskMutation,
      [],
    );
    const createTask = expectMutationResult(mutation);
    await act(async () => {
      await createTask.mutateAsync({
        pathParameters: {projectId: 'proj1'},
        payload: {},
      });
    });

    expect(queryClient.getQueryData(['tasks', 'list', 'proj1'])).toEqual([
      {projectId: 'proj1'},
    ]);
    expect(queryClient.getQueriesData({queryKey: ['tasks', 'detail']})).toEqual(
      [],
    );
  });

  it('prepends to list for create without detail', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.createProject.mockResolvedValue({id: 'p1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useCreateProjectMutation,
      [],
    );
    const createProject = expectMutationResult(mutation);
    await act(async () => {
      await createProject.mutateAsync({payload: {name: 'New'}});
    });

    expect(queryClient.getQueryData(['projects', 'list'])).toEqual([
      {id: 'p1'},
    ]);
  });

  it('handles void deletions with detail cache cleanup', async () => {
    const {module: generatedHooks, queryClient} = await importGeneratedHooks();
    queryClient.setQueryData(['tasks', 'list'], [{id: 't1'}, {id: 't2'}]);
    queryClient.setQueryData(['tasks', 'detail', {id: 't1'}], {id: 't1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useDeleteTaskMutation,
      [],
    );
    const deleteTask = expectMutationResult(mutation);
    await act(async () => {
      await deleteTask.mutateAsync({pathParameters: {taskId: 't1'}});
    });

    expect(queryClient.getQueryData(['tasks', 'list'])).toEqual([{id: 't2'}]);
    expect(
      queryClient.getQueryData(['tasks', 'detail', {id: 't1'}]),
    ).toBeUndefined();
  });

  it('invalidates list caches for list-only void mutations', async () => {
    const {module: generatedHooks, queryClient} = await importGeneratedHooks();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const deleteOrders = await renderWithClient(
      queryClient,
      generatedHooks.useDeleteOrdersForAccountMutation,
      [],
    );
    const deleteOrdersMutation = expectMutationResult(deleteOrders);
    await act(async () => {
      await deleteOrdersMutation.mutateAsync({
        pathParameters: {accountId: 'a1'},
      });
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['orders', 'list', 'a1'],
    });

    const removeStrength = await renderWithClient(
      queryClient,
      generatedHooks.useRemoveStrengthGoalsByStrengthMutation,
      [],
    );
    const removeStrengthMutation = expectMutationResult(removeStrength);
    await act(async () => {
      await removeStrengthMutation.mutateAsync({pathParameters: {id: 'sg1'}});
    });
    expect(invalidate).toHaveBeenCalledWith({
      queryKey: ['strengthGoals', 'list', 'sg1'],
    });

    const clearReports = await renderWithClient(
      queryClient,
      generatedHooks.useClearReportsMutation,
      [],
    );
    const clearReportsMutation = expectMutationResult(clearReports);
    await act(async () => {
      await clearReportsMutation.mutateAsync(undefined);
    });
    expect(invalidate).toHaveBeenCalledWith({queryKey: ['reports', 'list']});
  });

  it('updates list and detail on non-create mutations with detail', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    queryClient.setQueryData(
      ['users', 'list'],
      [
        {id: 'u1', name: 'Old'},
        {id: 'u2', name: 'Other'},
      ],
    );
    apiMocks.updateUser.mockResolvedValue({id: 'u1', name: 'Updated'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useUpdateUserMutation,
      [],
    );
    const updateUser = expectMutationResult(mutation);
    await act(async () => {
      await updateUser.mutateAsync({
        pathParameters: {userId: 'u1'},
        payload: {name: 'Updated'},
        queryParams: {expand: true},
      });
    });

    expect(apiMocks.updateUser).toHaveBeenCalledWith(
      {userId: 'u1'},
      {name: 'Updated'},
      {expand: true},
    );
    expect(queryClient.getQueryData(['users', 'detail', {id: 'u1'}])).toEqual({
      id: 'u1',
      name: 'Updated',
    });
    expect(queryClient.getQueryData(['users', 'list'])).toEqual([
      {id: 'u1', name: 'Updated'},
      {id: 'u2', name: 'Other'},
    ]);
  });

  it('treats detail routes with implicit key as detail-aware mutations', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    queryClient.setQueryData(['posts', 'list'], [{id: 'p1', title: 'Old'}]);
    apiMocks.updatePost.mockResolvedValue({id: 'p1', title: 'Updated'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useUpdatePostMutation,
      [],
    );
    const updatePost = expectMutationResult(mutation);
    await act(async () => {
      await updatePost.mutateAsync({
        pathParameters: {id: 'p1'},
        payload: {title: 'Updated'},
      });
    });

    expect(queryClient.getQueryData(['posts', 'detail', {id: 'p1'}])).toEqual({
      id: 'p1',
      title: 'Updated',
    });
    expect(queryClient.getQueryData(['posts', 'list'])).toEqual([
      {id: 'p1', title: 'Updated'},
    ]);
  });

  it('invalidates list for non-detail mutations without detail coverage', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.patchReport.mockResolvedValue({id: 'r1'});
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.usePatchReportMutation,
      [],
    );
    const patchReport = expectMutationResult(mutation);
    await act(async () => {
      await patchReport.mutateAsync({payload: {name: 'patched'}});
    });

    expect(apiMocks.patchReport).toHaveBeenCalledWith({name: 'patched'});
    expect(invalidate).toHaveBeenCalledWith({queryKey: ['reports', 'list']});
  });

  it('supports create without variables', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.triggerPing.mockResolvedValue(undefined);

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useTriggerPingMutation,
      [],
    );
    const triggerPing = expectMutationResult(mutation);
    await act(async () => {
      await triggerPing.mutateAsync(undefined);
    });

    expect(apiMocks.triggerPing).toHaveBeenCalled();
  });

  it('does not require path params on create when only unrelated routes have list path params', async () => {
    const {
      module: generatedHooks,
      apiMocks,
      queryClient,
    } = await importGeneratedHooks();
    apiMocks.createWidget.mockResolvedValue({widgetId: 'w1'});

    const mutation = await renderWithClient(
      queryClient,
      generatedHooks.useCreateWidgetMutation,
      [],
    );
    const createWidget = expectMutationResult(mutation);
    await act(async () => {
      await createWidget.mutateAsync({payload: {name: 'New widget'}});
    });

    expect(queryClient.getQueryData(['widgets', 'list'])).toEqual([
      {widgetId: 'w1'},
    ]);
  });
});
