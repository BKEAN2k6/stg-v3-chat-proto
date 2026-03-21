import {type GeneratorData} from './GeneratorData.js';

function generateTemplateString(urlTemplate: string, hasQuery: boolean) {
  const formattedUrl = urlTemplate.replaceAll(
    /:\w+/g,
    (match) => `\${pathParameters.${match.slice(1)}}`,
  );
  return `\`/api/v1${formattedUrl}${
    // eslint-disable-next-line no-template-curly-in-string
    hasQuery ? '?${toQueryString(queryParameters)}' : ''
  }\``;
}

export const createApiFunction = (result: GeneratorData) => {
  const {
    path,
    method,
    name,
    noAuthRedirect,
    responseTypeName,
    pathParameterTypeName,
    requestTypeName,
    queryTypeName,
  } = result;

  const functionArguments: string[] = [];
  if (pathParameterTypeName) {
    functionArguments.push(`pathParameters: ${pathParameterTypeName}`);
  }

  if (requestTypeName) {
    functionArguments.push(`body: ${requestTypeName}`);
  }

  if (queryTypeName) {
    functionArguments.push(`queryParameters: ${queryTypeName}`);
  }

  const returnType = responseTypeName ?? 'void';
  const url = generateTemplateString(path, Boolean(queryTypeName));

  return `
  async ${name}(${functionArguments.join(', ')}): Promise<${returnType}> {
    const response = await fetch(${url}, {
      method: '${method.toUpperCase()}', ${
        requestTypeName
          ? `\nbody: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },`
          : ''
      }
    });
    
    ${noAuthRedirect ? '' : 'this.redirectIfNotLoggedIn(response);'}
    await this.throwErrorIfNotOk(response);
    
    ${
      responseTypeName
        ? `return response.json() as Promise<${returnType}>;`
        : 'return Promise.resolve();'
    }
  },`;
};
