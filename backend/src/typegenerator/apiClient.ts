import {createApiFunction} from './apiFunction.js';
import {type GeneratorData} from './GeneratorData.js';

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
  ${[...typesToImport].join(',\n  ')}
} from './ApiTypes.js';

function toQueryString(params: Record<string, string | undefined>): string {
  const filtered = Object.entries(params).filter(([, v]) => v !== undefined);
  return new URLSearchParams(filtered as [string, string][]).toString();
}

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
