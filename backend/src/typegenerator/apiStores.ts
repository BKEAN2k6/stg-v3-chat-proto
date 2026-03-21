import type {GeneratorData} from './GeneratorData.js';

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

type Operation =
  | 'list'
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'bulkDelete'
  | 'updateSubresource';

type GroupedData = {
  storeName: string;
  operations: Map<Operation, GeneratorData>;
  entityTypeName: string;
  imports: Set<string>;
  apiImports: Set<string>;
};

function generateActionArgumentsString(routeData: GeneratorData): string {
  const arguments_: string[] = [];
  if (routeData.pathParameterTypeName)
    arguments_.push(`pathParams: ApiTypes.${routeData.pathParameterTypeName}`);
  if (routeData.requestTypeName)
    arguments_.push(`payload: ApiTypes.${routeData.requestTypeName}`);
  if (routeData.queryTypeName)
    arguments_.push(`queryParams: ApiTypes.${routeData.queryTypeName}`);
  return arguments_.join(', ');
}

function generateApiCallArgumentsString(routeData: GeneratorData): string {
  const callArguments: string[] = [];
  if (routeData.pathParameterTypeName) callArguments.push('pathParams');
  if (routeData.requestTypeName) callArguments.push('payload');
  if (routeData.queryTypeName) callArguments.push('queryParams');
  return callArguments.join(', ');
}

function generateActionTypeString(routeData: GeneratorData): string {
  const argumentsString = generateActionArgumentsString(routeData);
  const returnType = routeData.responseTypeName
    ? `Promise<ApiTypes.${routeData.responseTypeName}>`
    : 'Promise<void>';
  return `(${argumentsString}) => ${returnType}`;
}

// eslint-disable-next-line complexity
function generateStoreAction(
  routeData: GeneratorData,
  entityTypeName: string,
): string {
  const {operation} = routeData.store!;
  const subresourceKey = routeData.store!.subresource
    ? `'${routeData.store!.subresource}'`
    : null;

  const {
    name: apiFunctionName,
    responseTypeName,
    pathParameterTypeName,
  } = routeData;
  const actionArgumentsString = generateActionArgumentsString(routeData);
  const apiCallArgumentsString = generateApiCallArgumentsString(routeData);
  const resultTypeName = responseTypeName
    ? `ApiTypes.${responseTypeName}`
    : 'void';
  const promiseReturnType =
    resultTypeName === 'void' ? 'Promise<void>' : `Promise<${resultTypeName}>`;

  const actionName =
    operation === 'read'
      ? 'fetchOne'
      : operation === 'delete'
        ? 'remove'
        : operation;

  const hasPathParameters = Boolean(pathParameterTypeName);

  const setLoadingStart = `set({ loading: '${operation}', error: undefined });`;
  const setLoadingIdle = `loading: 'idle'`;
  const setErrorHandling = `catch (error: unknown) { \n      const apiError = error instanceof ApiError ? error : new ApiError(String(error ?? 'Unknown store error'), 500);\n      set({ error: apiError, loading: 'idle' }); \n      throw apiError; \n    }`;

  switch (operation) {
    case 'list': {
      return `
   ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
     ${setLoadingStart}
     try {
       const result = await api.${apiFunctionName}(${apiCallArgumentsString});
       set({items: Array.isArray(result) ? result : [], ${setLoadingIdle} });
       return result;
     } ${setErrorHandling}
   },`;
    }

    case 'read': {
      return `
   ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
     ${setLoadingStart}
     try {
       const result = await api.${apiFunctionName}(${apiCallArgumentsString});
       set({ entity: result, ${setLoadingIdle} });
       return result;
     } ${setErrorHandling}
   },`;
    }

    case 'create': {
      return `
   ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
     ${setLoadingStart}
     try {
       const newItem = await api.${apiFunctionName}(${apiCallArgumentsString});
       set(state => ({
         items: Array.isArray(state.items) ? [...state.items, newItem] : [newItem],
         ${setLoadingIdle},
       }));
       return newItem;
     } ${setErrorHandling}
   },`;
    }

    case 'update': {
      const updateIdCheck = hasPathParameters
        ? 'const id = pathParams?.id;'
        : '';
      const updateErrorCheck = hasPathParameters
        ? 'if (!id) { throw new Error("Update operation missing required ID in pathParams."); }'
        : '';
      return `
   ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
     ${updateIdCheck}
     ${updateErrorCheck}
     ${setLoadingStart}
     try {
       const updatedItem = await api.${apiFunctionName}(${apiCallArgumentsString});
       set(state => ({
         items: state.items?.map(item => (item && typeof item === 'object' && 'id' in item && item.id === id ? updatedItem : item)) ?? undefined,
         entity: (state.entity && typeof state.entity === 'object' && 'id' in state.entity && state.entity.id === id) ? updatedItem : state.entity,
         ${setLoadingIdle},
       }));
       return updatedItem;
     } ${setErrorHandling}
   },`;
    }

    case 'updateSubresource': {
      if (!subresourceKey) {
        throw new Error(
          `Store configuration error: 'updateSubresource' operation for API function "${apiFunctionName}" is missing the 'subresource' key in its 'store' config.`,
        );
      }

      const subresourceIdCheck = hasPathParameters
        ? 'const parentId = pathParams?.id;'
        : '';
      const subresourceErrorCheck = hasPathParameters
        ? 'if (!parentId) { throw new Error("Update subresource operation missing required parent ID in pathParams."); }'
        : '';

      const itemParameterType =
        entityTypeName === 'ApiTypes.unknown'
          ? 'any'
          : `${entityTypeName} | undefined`;
      const itemTypePredicate =
        entityTypeName === 'ApiTypes.unknown'
          ? 'any'
          : `item is ${entityTypeName}`;

      return `
  ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
    ${subresourceIdCheck}
    ${subresourceErrorCheck}
    ${setLoadingStart}
    try {
      const result: ${resultTypeName} = await api.${apiFunctionName}(${apiCallArgumentsString});

      set(state => {
         const updateItemSubresource = (item: ${itemParameterType}): ${itemParameterType} => {
              if (!item || typeof item !== 'object' || !('id' in item) || typeof item.id === 'undefined' || item.id !== parentId) {
                  return item;
              }

              const subresourceProp = ${subresourceKey} as keyof typeof item;
              if (!(subresourceProp in item)) {
                throw new Error("Subresource key '${subresourceKey}' not found in item.");
              }

              const currentSubresourceValue = item[subresourceProp];
              const currentArray = Array.isArray(currentSubresourceValue) ? [...currentSubresourceValue] : [];

              let finalSubresourceArray = currentArray;
              if (Array.isArray(result)) {
                 finalSubresourceArray = currentArray.concat(result);
              } else if (result && typeof result === 'object') {
                 const resultId = 'id' in result && typeof result.id === 'string' ? result.id : undefined
                 const existingIndex = resultId !== undefined ? currentArray.findIndex((subItem: any) => subItem?.id === resultId) : -1;

                 if (existingIndex > -1) {
                      finalSubresourceArray = [...currentArray];
                      finalSubresourceArray[existingIndex] = result;
                 } else {
                      finalSubresourceArray = [...currentArray, result];
                 }
              }

              return { ...item, [subresourceProp]: finalSubresourceArray };
         };

         const updatedItems = state.items
              ?.map(updateItemSubresource)
              .filter((item): ${itemTypePredicate} => item !== undefined);

         return {
             items: updatedItems,
             entity: updateItemSubresource(state.entity),
             ${setLoadingIdle}
         };
      });
      return result;
    } ${setErrorHandling}
  },`;
    }

    case 'delete': {
      const deleteIdCheck = hasPathParameters
        ? 'const id = pathParams?.id;'
        : '';
      const deleteErrorCheck = hasPathParameters
        ? 'if (!id) { throw new Error("Delete operation missing required ID in pathParams."); }'
        : '';
      return `
  ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
    ${deleteIdCheck}
    ${deleteErrorCheck}
    ${setLoadingStart}
    try {
      await api.${apiFunctionName}(${apiCallArgumentsString});
      set(state => ({
        items: state.items?.filter(item => !(item && typeof item === 'object' && 'id' in item && item.id === id)) ?? undefined,
        entity: (state.entity && typeof state.entity === 'object' && 'id' in state.entity && state.entity.id === id) ? undefined : state.entity,
        ${setLoadingIdle},
      }));
    } ${setErrorHandling}
  },`;
    }

    case 'bulkDelete': {
      return `
  ${actionName}: async (${actionArgumentsString}): ${promiseReturnType} => {
    ${setLoadingStart}
    try {
      await api.${apiFunctionName}(${apiCallArgumentsString});
      set({ items: undefined, entity: undefined, ${setLoadingIdle} });
    } ${setErrorHandling}
  },`;
    }
  }
}

// eslint-disable-next-line complexity
export function generateApiStores(results: GeneratorData[]): string {
  const storesToGenerate = new Map<string, GroupedData>();
  const allPossibleImports = new Set<string>(['ApiError']);

  for (const routeData of results) {
    if (!routeData.store) continue;

    const {storeName, operation, entityTypeNameBase} = routeData.store;
    if (!storeName) {
      throw new Error(
        `Store configuration error for API function "${routeData.name}": 'storeName' is missing.`,
      );
    }

    if (!operation) {
      throw new Error(
        `Store configuration error for API function "${routeData.name}" (store: ${storeName}): Explicit 'operation' is missing.`,
      );
    }

    if (!entityTypeNameBase) {
      throw new Error(
        `Store configuration error for API function "${routeData.name}" (store: ${storeName}): Explicit 'entityTypeNameBase' is missing.`,
      );
    }

    if (operation === 'updateSubresource' && !routeData.store.subresource) {
      throw new Error(
        `Store configuration error for API function "${routeData.name}" (store: ${storeName}, op: ${operation}): 'subresource' key is missing for 'updateSubresource' operation.`,
      );
    }

    if (!storesToGenerate.has(storeName)) {
      const entityTypeName = `ApiTypes.${entityTypeNameBase}`;
      storesToGenerate.set(storeName, {
        storeName,
        operations: new Map(),
        entityTypeName,
        imports: new Set(),
        apiImports: new Set(),
      });
    }

    const group = storesToGenerate.get(storeName)!;

    if (group.entityTypeName !== `ApiTypes.${entityTypeNameBase}`) {
      throw new Error(
        `Store configuration inconsistency for store "${storeName}": Mismatched 'entityTypeNameBase'. Found "${entityTypeNameBase}" for API function "${routeData.name}", expected "${group.entityTypeName.replace('ApiTypes.', '')}".`,
      );
    }

    if (group.operations.has(operation)) {
      throw new Error(
        `Store configuration error for store "${storeName}": Duplicate operation '${operation}' defined (API functions: ${group.operations.get(operation)?.name}, ${routeData.name}).`,
      );
    }

    group.operations.set(operation, routeData);
    group.apiImports.add(routeData.name);

    if (routeData.pathParameterTypeName)
      group.imports.add(routeData.pathParameterTypeName);
    if (routeData.requestTypeName) group.imports.add(routeData.requestTypeName);
    if (routeData.queryTypeName) group.imports.add(routeData.queryTypeName);
    if (routeData.responseTypeName)
      group.imports.add(routeData.responseTypeName);
    if (entityTypeNameBase !== 'unknown') group.imports.add(entityTypeNameBase);
  }

  const storeCodes: string[] = [];
  for (const group of storesToGenerate.values()) {
    const {storeName, operations, entityTypeName, imports} = group;
    const listRoute = operations.get('list');
    const entityTypeNameBase = entityTypeName.replace('ApiTypes.', '');

    if (listRoute?.responseTypeName) {
      const baseArrayType = listRoute.responseTypeName.replaceAll(
        /\[]$|^Array<|>$/g,
        '',
      );
      if (baseArrayType !== entityTypeNameBase && baseArrayType !== 'unknown') {
        imports.add(baseArrayType);
      }
    }

    for (const imp of imports) allPossibleImports.add(imp);

    const storeHookName = `use${capitalize(storeName)}Store`;
    const stateInterfaceName = `${capitalize(storeName)}State`;

    const actionTypeSignatures = [...operations.values()]
      .map((data) => {
        const op = data.store!.operation;
        const actionName =
          op === 'read' ? 'fetchOne' : op === 'delete' ? 'remove' : op;
        return `  ${actionName}: ${generateActionTypeString(data)};`;
      })
      .join('\n');

    const actionImplementations = [...operations.values()]
      .map((data) => generateStoreAction(data, group.entityTypeName))
      .join('\n');

    const entityStateType =
      entityTypeName === 'ApiTypes.unknown' ? 'any' : entityTypeName;

    const itemsStateType = `${entityStateType}[]`;

    const storeCode = `
export interface ${stateInterfaceName} {
  items: ${itemsStateType} | undefined;
  entity: ${entityStateType} | undefined;
  loading: LoadingState;
  error: ApiError | undefined;
${actionTypeSignatures}
}

export const ${storeHookName} = create<${stateInterfaceName}>((set) => ({
  items: undefined,
  entity: undefined,
  loading: 'idle',
  error: undefined,

${actionImplementations}
}));
`;
    storeCodes.push(storeCode);
  }

  const finalCode = `
import { create } from 'zustand';
import api, { ApiError } from './ApiClient.js';
import type * as ApiTypes from './ApiTypes.js';

type Operation = ${
    [...new Set(results.map((r) => r.store?.operation).filter(Boolean))]
      .map((op) => `'${op}'`)
      .join(' | ') || 'never'
  };
type LoadingState = 'idle' | Operation;

${storeCodes.join('\n')}
`;
  return finalCode;
}
