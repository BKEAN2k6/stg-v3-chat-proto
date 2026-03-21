import {type GeneratorData} from './GeneratorData.js';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getHookOperationType(method: string): 'query' | 'mutation' {
  return method.toLowerCase() === 'get' ? 'query' : 'mutation';
}

// Build a stable queryKey value
function generateQueryKeyValueString(
  resourceName: string,
  queryType: 'list' | 'detail',
  pathKeyExpr?: string,
  queryKeyExpr?: string,
): string {
  const parts = [`'${resourceName}'`, `'${queryType}'`];
  if (pathKeyExpr) parts.push(pathKeyExpr);
  if (queryKeyExpr) parts.push(queryKeyExpr);
  return `[${parts.join(', ')}] as const`;
}

// Build the TS tuple type for the queryKey
function generateQueryKeyTypeString(
  resourceName: string,
  queryType: 'list' | 'detail',
  pathKeyType?: string,
  queryKeyType?: string,
): string {
  const parts: string[] = [`'${resourceName}'`, `'${queryType}'`];
  if (pathKeyType) parts.push(pathKeyType);
  if (queryKeyType) parts.push(queryKeyType);
  return `readonly [${parts.join(', ')}]`;
}

// Build the `variables` type for mutations
function generateMutationVariablesType(rd: GeneratorData): string {
  const parts: string[] = [];
  if (rd.pathParameterTypeName)
    parts.push(`pathParameters: ApiTypes.${rd.pathParameterTypeName}`);
  if (rd.requestTypeName) parts.push(`payload: ApiTypes.${rd.requestTypeName}`);
  if (rd.queryTypeName) parts.push(`queryParams: ApiTypes.${rd.queryTypeName}`);
  return parts.length > 0 ? `{ ${parts.join('; ')} }` : 'void';
}

// eslint-disable-next-line complexity
export function generateApiHooks(results: GeneratorData[]): string {
  const optionsEnabledCheck = (opt: string) => `(${opt}?.enabled ?? true)`;
  let needsIdHelper = false;

  const detailKeyParameter: Partial<Record<string, string>> = {};
  const detailResources: Record<string, true> = {};
  const listPathKeyParameter: Partial<Record<string, string>> = {};

  const setKeyIfUnsetOrDefault = (
    map: Partial<Record<string, string>>,
    resourceName: string,
    key: string,
  ) => {
    const current = map[resourceName];
    if (current === undefined || current === 'id') map[resourceName] = key;
  };

  for (const r of results) {
    const cfg = r.hookConfig;
    if (!cfg) continue;
    if (getHookOperationType(r.method) !== 'query') continue;
    if (cfg.queryType === 'detail') {
      detailResources[cfg.resourceName] = true;
      setKeyIfUnsetOrDefault(
        detailKeyParameter,
        cfg.resourceName,
        cfg.keyParamName ?? 'id',
      );
    }

    if (cfg.queryType === 'list' && r.pathParameterTypeName) {
      setKeyIfUnsetOrDefault(
        listPathKeyParameter,
        cfg.resourceName,
        cfg.keyParamName ?? 'id',
      );
    }
  }

  const hookCodes: string[] = [];

  for (const rd of results) {
    const cfg = rd.hookConfig;
    if (!cfg) continue;
    const {
      name: apiFunction,
      method,
      responseTypeName,
      pathParameterTypeName,
      requestTypeName,
      queryTypeName,
    } = rd;
    const {resourceName, queryType, subResourceName, keyParamName} = cfg;

    const hookOp = getHookOperationType(method);
    const hookName = `use${capitalize(apiFunction)}${hookOp === 'query' ? 'Query' : 'Mutation'}`;
    const returnT = responseTypeName ? `ApiTypes.${responseTypeName}` : 'void';
    const isVoid = returnT === 'void';

    if (hookOp === 'query') {
      // --- QUERY HOOK ---
      const hasPath = Boolean(pathParameterTypeName);
      const hasQ = Boolean(queryTypeName);
      const pVariable = 'pathParameters';
      const qVariable = 'queryParams';
      const parametersVariable = hasQ ? 'params' : undefined;
      const detailPathKey = keyParamName ?? 'id';

      const pathKeyExpr =
        hasPath && queryType === 'detail'
          ? `{ id: ${pVariable}.${detailPathKey} }`
          : hasPath
            ? keyParamName
              ? `${pVariable}.${keyParamName}`
              : pVariable
            : undefined;
      const queryKeyExpr = hasQ ? qVariable : undefined;
      const pathKeyType =
        hasPath && queryType === 'detail'
          ? `{ id: ${pathParameterTypeName ? `ApiTypes.${pathParameterTypeName}[${JSON.stringify(detailPathKey)}]` : 'string'} }`
          : hasPath
            ? keyParamName
              ? 'string'
              : `ApiTypes.${pathParameterTypeName}`
            : undefined;
      const queryKeyType = hasQ
        ? `ApiTypes.${queryTypeName} | Record<string, unknown>`
        : undefined;

      const keyValue = generateQueryKeyValueString(
        resourceName,
        queryType!,
        pathKeyExpr,
        queryKeyExpr ? (parametersVariable ?? queryKeyExpr) : undefined,
      );
      const keyType = generateQueryKeyTypeString(
        resourceName,
        queryType!,
        pathKeyType,
        queryKeyType,
      );

      const arguments_: string[] = [];
      if (hasPath)
        arguments_.push(`${pVariable}: ApiTypes.${pathParameterTypeName}`);
      if (hasQ) arguments_.push(`${qVariable}?: ApiTypes.${queryTypeName}`);
      arguments_.push(
        `options?: Omit<UseQueryOptions<${returnT}, ApiError, ${returnT}, ${keyType}>, 'queryKey' | 'queryFn'>`,
      );

      const enabled = hasPath
        ? `Boolean(${pVariable}) && ${optionsEnabledCheck('options')}`
        : optionsEnabledCheck('options');
      const callArguments =
        hasPath && hasQ
          ? `${pVariable}, ${parametersVariable}`
          : hasPath
            ? pVariable
            : hasQ
              ? parametersVariable
              : '';
      const body = isVoid
        ? `await api.${apiFunction}(${callArguments});`
        : `const result = await api.${apiFunction}(${callArguments}); return result;`;

      const parametersInit = hasQ
        ? `const ${parametersVariable}: ApiTypes.${queryTypeName} = ${qVariable} ?? {};`
        : '';

      hookCodes.push(`export const ${hookName} = (${arguments_.join(', ')}) => {
  ${parametersInit}
  const queryKey = ${keyValue};
  return useQuery<${returnT}, ApiError, ${returnT}, ${keyType}>({
    queryKey,
    async queryFn() { ${body} },
    enabled: ${enabled},
    ...options,
  });
};`);
    } else {
      const variableType = generateMutationVariablesType(rd);
      const hasVariables = variableType !== 'void';
      const needsPath = Boolean(pathParameterTypeName);
      const isCreate = method.toLowerCase() === 'post';
      const hasDetail = Object.hasOwn(detailResources, cfg.resourceName);
      const detailKeyName = detailKeyParameter[cfg.resourceName];
      const listPathKeyName = listPathKeyParameter[cfg.resourceName];

      let onSuccessLogic = '';
      let onSuccessParameters = '';

      if (cfg.invalidateOnly) {
        onSuccessParameters = needsPath ? '(_, variables)' : '()';
        const detailInvalidate = hasDetail
          ? needsPath
            ? `const id = variables.pathParameters.${detailKeyName ?? keyParamName ?? 'id'}; if (id !== undefined) { await queryClient.invalidateQueries({ queryKey: ['${resourceName}','detail', {id}] }); }`
            : `await queryClient.invalidateQueries({ queryKey: ['${resourceName}','detail'] });`
          : '';
        onSuccessLogic = `${detailInvalidate}
await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list'] });`;
      } else if (subResourceName && needsPath && isCreate) {
        onSuccessParameters = '(data, variables)';
        onSuccessLogic = `const parentId = variables.pathParameters.${keyParamName ?? 'id'}; if (!parentId) return;

queryClient.setQueryData(
  ['${resourceName}','detail',{id: parentId}],
  old => {
    if (!old) return old;
    const prev = (old as { ${subResourceName}?: Array<typeof data> }).${subResourceName} ?? [];
    return { ...old, ${subResourceName}: [...prev, data] };
  }
);

const listQ = queryClient.getQueriesData({ queryKey: ['${resourceName}','list'] });
for (const [key, value] of listQ) {
  if (!value) continue;
  const arr = value as Array<{id: typeof parentId; ${subResourceName}?: Array<typeof data>} >;
  const updated = arr.map(item => item.id === parentId
    ? { ...item, ${subResourceName}: [...(item.${subResourceName} ?? []), data] }
    : item
  );
  queryClient.setQueryData(key, updated);
}`;
      } else if (isCreate) {
        const usesVariablesInCreate =
          Boolean(listPathKeyName && needsPath) || cfg.invalidateOnly;
        onSuccessParameters = usesVariablesInCreate
          ? '(data, variables)'
          : '(data)';
        const idKey = keyParamName ?? 'id';
        if (hasDetail) {
          needsIdHelper = true;
          const idSources = [
            "extractId(data, 'id')",
            ...(detailKeyName && detailKeyName !== 'id'
              ? [`extractId(data, '${detailKeyName}')`]
              : []),
            ...((detailKeyName ?? 'id') === 'id' && idKey !== 'id'
              ? [`extractId(data, '${idKey}')`]
              : []),
          ];
          const fallbackListKey =
            listPathKeyName && needsPath
              ? `['${resourceName}','list', variables.pathParameters.${listPathKeyName}]`
              : `['${resourceName}','list']`;
          onSuccessLogic = `
const id = ${idSources.join(' ?? ')};
let updatedList = false;
const listQ = queryClient.getQueriesData({ queryKey: ['${resourceName}','list'] });
for (const [key, value] of listQ) {
  if (!Array.isArray(value)) continue;
  updatedList = true;
  queryClient.setQueryData(
    key,
    [data, ...(value as Array<typeof data>)]
  );
}
if (!updatedList) {
  queryClient.setQueryData(
    ${fallbackListKey},
    (old: Array<typeof data> = []) => [data, ...old]
  );
}
await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list'] });
if (id !== undefined) {
  queryClient.setQueryData(
    ['${resourceName}','detail', {id}],
    () => data
  );
}
`;
        } else {
          const fallbackListKey =
            listPathKeyName && needsPath
              ? `['${resourceName}','list', variables.pathParameters.${listPathKeyName}]`
              : `['${resourceName}','list']`;
          onSuccessLogic = `
let updatedList = false;
const listQ = queryClient.getQueriesData({ queryKey: ['${resourceName}','list'] });
for (const [key, value] of listQ) {
  if (!Array.isArray(value)) continue;
  updatedList = true;
  queryClient.setQueryData(
    key,
    [data, ...(value as Array<typeof data>)]
  );
}
if (!updatedList) {
  queryClient.setQueryData(
    ${fallbackListKey},
    (old: Array<typeof data> = []) => [data, ...old]
  );
}
await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list'] });
`;
        }
      } else if (isVoid) {
        const listOnly =
          apiFunction === 'removeStrengthGoalsByStrength' || !hasDetail;
        if (listOnly) {
          onSuccessParameters = needsPath ? '(_, variables)' : '()';
          onSuccessLogic = needsPath
            ? `await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list', variables.pathParameters.${listPathKeyName ?? keyParamName ?? 'id'}] });`
            : `await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list'] });`;
        } else {
          onSuccessParameters = '(_, variables)';
          onSuccessLogic = `const id = variables.pathParameters.${detailKeyName ?? keyParamName ?? 'id'}; if (!id) return;
          
          const listQ = queryClient.getQueriesData({ queryKey: ['${resourceName}','list'] });
          for (const [key, value] of listQ) {
            if (!value) continue;
            const array = value as Array<{ id: typeof id }>;
            const updated = array.filter(item => item.id !== id);
            queryClient.setQueryData(key, updated);
          }
          
          queryClient.removeQueries({ queryKey: ['${resourceName}', 'detail', { id }] });
          `;
        }
      } else {
        onSuccessParameters = '(data, variables)';
        if (hasDetail) {
          onSuccessLogic = `const id = variables.pathParameters.${detailKeyName ?? keyParamName ?? 'id'}; if (!id) return;
queryClient.setQueryData(
  ['${resourceName}','detail', {id}],
  () => data
);

const listQ = queryClient.getQueriesData({ queryKey: ['${resourceName}','list'] });
for (const [key, value] of listQ) {
  if (!value) continue;
  const arr = value as Array<{id: typeof id}>;
  const updated = arr.map(item => item.id === id ? data : item);
  queryClient.setQueryData(key, updated);
}
`;
        } else {
          onSuccessParameters = '()';
          onSuccessLogic = `await queryClient.invalidateQueries({ queryKey: ['${resourceName}','list'] });`;
        }
      }

      const optionsType = `UseMutationOptions<${returnT}, ApiError, ${variableType}>`;
      const callArguments: string[] = [];
      if (needsPath) callArguments.push('variables.pathParameters');
      if (requestTypeName) callArguments.push('variables.payload');
      if (queryTypeName) callArguments.push('variables.queryParams');
      const argumentsString = callArguments.join(', ');
      const mutBody = isVoid
        ? `await api.${apiFunction}(${argumentsString});`
        : `const result = await api.${apiFunction}(${argumentsString}); return result;`;

      hookCodes.push(`export const ${hookName} = (options?: ${optionsType}) => {
  const queryClient = useQueryClient();
  return useMutation<${returnT}, ApiError, ${variableType}>({
    async mutationFn(${hasVariables ? 'variables' : ''}) { ${mutBody} },
    async onSuccess${onSuccessParameters} { ${onSuccessLogic} },
    ...options,
  });
};`);
    }
  }

  return `
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import api, { type ApiError } from '@client/ApiClient.js';
import type * as ApiTypes from '@client/ApiTypes.js';

${
  needsIdHelper
    ? `const extractId = (value: unknown, key: string): string | number | undefined => {
  if (typeof value !== 'object' || value === null) return undefined;
  const idValue = (value as Record<string, unknown>)[key];
  return typeof idValue === 'string' || typeof idValue === 'number' ? idValue : undefined;
};
`
    : ''
}
${hookCodes.join('\n')}
`;
}
