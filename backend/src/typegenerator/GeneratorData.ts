export type GeneratorData = {
  path: string;
  method: 'get' | 'post' | 'put' | 'delete' | 'patch';
  name: string;
  noAuthRedirect?: boolean;
  responseTypeName?: string;
  responseType?: string;
  pathParameterTypeName?: string;
  pathParameterType?: string;
  requestTypeName?: string;
  requestType?: string;
  queryTypeName?: string;
  queryType?: string;
  store?: {
    storeName: string;
    operation:
      | 'list'
      | 'read'
      | 'create'
      | 'update'
      | 'delete'
      | 'bulkDelete'
      | 'updateSubresource';
    entityTypeNameBase: string;
    subresource?: string;
  };
  hookConfig?: {
    resourceName: string;
    queryType?: 'list' | 'detail';
    subResourceName?: string;
    keyParamName?: string;
    invalidateOnly?: boolean;
  };
};
