import {createApiFunction} from './apiFunction';
import {type GeneratorData} from './GeneratorData';

export function generateApiClient(results: GeneratorData[]) {
  const typesToImport = new Set<string>();

  for (const result of results) {
    if (result.pathParameterTypeName) {
      typesToImport.add(result.pathParameterTypeName);
    }

    if (result.requestTypeName) {
      typesToImport.add(result.requestTypeName);
    }

    if (result.responseTypeName) {
      typesToImport.add(result.responseTypeName);
    }

    if (result.queryTypeName) {
      typesToImport.add(result.queryTypeName);
    }
  }

  return `
import {
  ${Array.from(typesToImport).join(',\n  ')}
} from './ApiTypes';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const api = {
  redirectIfNotLoggedIn(response: Response) {
    if (response.status === 401) {
      window.location.href = '/start';
    }
  },

  async throwErrorIfNotOk(response: Response) {
    if (response.ok) {
      return;
    }

    const {error} = (await response.json()) as {error: string};
    if (!error) {
      throw new Error(response.statusText);
    }

    throw new ApiError(error, response.status);
  },

  ${results
    .map((result: GeneratorData) => createApiFunction(result))
    .join('\n')}
};

export default api;
`;
}
