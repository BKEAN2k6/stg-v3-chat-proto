/* eslint-disable no-console */
/* eslint-disable complexity */
import fs from 'node:fs';
import {type JSONSchema, compile} from 'json-schema-to-typescript';
import definitions from '../api/schemas/definitions/index.js';
import routes from '../api/controllers/index.js';
import socketEvents from '../api/events/index.js';
import {generateApiClient} from './apiClient.js';
import {generateApiHooks} from './apiHooks.js';
// Import {generateApiStores} from './apiStores.js';
import {type GeneratorData} from './GeneratorData.js';

const options = {
  declareExternallyReferenced: false,
  additionalProperties: false,
  bannerComment: '',
  ignoreMinAndMaxItems: true,
  style: {
    bracketSpacing: true,
    printWidth: 80,
    semi: true,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all' as const,
    useTabs: false,
  },
};

const typeFilePath = 'src/api/client/ApiTypes.ts';
const apiClientFilePath = 'src/api/client/ApiClient.ts';
const apiHooksFilePath = '../frontend/src/hooks/useApi.ts';
// Const apiStoresFilePath = 'src/api/client/ApiStores.ts';
const outputDirectory = 'src/api/client';
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory, {recursive: true});
  console.log(`Created output directory: ${outputDirectory}`);
}

const createPathParameterType = (name: string, parameters: string[]) => {
  const type = `export type ${name} = {\n${parameters
    .map((parameter) => `  ${parameter}: string;`)
    .join('\n')}\n};\n`;
  return type;
};

const generateClient = async () => {
  console.log('Starting API client generation...');
  const data: GeneratorData[] = [];
  const generatedTypes = new Set<string>();

  console.log('Processing route definitions...');
  for (const [path, config] of Object.entries(routes)) {
    for (const [method, routeConfig] of Object.entries(config)) {
      if (
        !routeConfig ||
        typeof routeConfig !== 'object' ||
        !routeConfig.controller
      ) {
        console.warn(
          `[WARN] Skipping invalid route config: ${method.toUpperCase()} ${path}`,
        );
        continue;
      }

      if (
        typeof routeConfig.controller !== 'function' ||
        !routeConfig.controller.name
      ) {
        console.warn(
          `[WARN] Skipping route with missing/unnamed controller: ${method.toUpperCase()} ${path}`,
        );
        continue;
      }

      const input: GeneratorData = {
        path,
        method: method.toLowerCase() as
          | 'get'
          | 'post'
          | 'put'
          | 'delete'
          | 'patch',
        noAuthRedirect: routeConfig.noAuthRedirect,
        name: routeConfig.controller.name,
        store: routeConfig.store,
        hookConfig: routeConfig.hookConfig,
      };

      const controllerName = routeConfig.controller.name;
      const typeName =
        controllerName.charAt(0).toUpperCase() + controllerName.slice(1);

      if (routeConfig.response) {
        const responseTypeName = `${typeName}Response`;
        input.responseTypeName = responseTypeName;
        if (!generatedTypes.has(responseTypeName)) {
          try {
            // Assert the types to satisfy the compiler
            const schemaWithContext = {
              ...(routeConfig.response as JSONSchema),
              definitions: definitions as JSONSchema['definitions'],
            };
            // eslint-disable-next-line no-await-in-loop
            const responseType = await compile(
              schemaWithContext,
              responseTypeName,
              options,
            );
            input.responseType = responseType;
            generatedTypes.add(responseTypeName);
          } catch (error: any) {
            console.error(
              `Error compiling response schema for ${responseTypeName}: ${error.message}`,
            );
          }
        }
      }

      const parameters =
        path.match(/:(\w+)/g)?.map((parameter) => parameter.slice(1)) ?? [];
      if (parameters.length > 0) {
        const parametersTypeName = `${typeName}Parameters`;
        input.pathParameterTypeName = parametersTypeName;
        if (!generatedTypes.has(parametersTypeName)) {
          input.pathParameterType = createPathParameterType(
            parametersTypeName,
            parameters,
          );
          generatedTypes.add(parametersTypeName);
        }
      }

      if (routeConfig.request) {
        const requestTypeName = `${typeName}Request`;
        input.requestTypeName = requestTypeName;
        if (!generatedTypes.has(requestTypeName)) {
          try {
            // Assert the types to satisfy the compiler
            const schemaWithContext = {
              ...(routeConfig.request as JSONSchema),
              definitions: definitions as JSONSchema['definitions'],
            };
            // eslint-disable-next-line no-await-in-loop
            const requestType = await compile(
              schemaWithContext,
              requestTypeName,
              options,
            );
            input.requestType = requestType;
            generatedTypes.add(requestTypeName);
          } catch (error: any) {
            console.error(
              `Error compiling request schema for ${requestTypeName}: ${error.message}`,
            );
          }
        }
      }

      if (routeConfig.query) {
        const queryTypeName = `${typeName}Query`;
        input.queryTypeName = queryTypeName;
        if (!generatedTypes.has(queryTypeName)) {
          try {
            // Assert the types to satisfy the compiler
            const schemaWithContext = {
              ...(routeConfig.query as JSONSchema),
              definitions: definitions as JSONSchema['definitions'],
            };
            // eslint-disable-next-line no-await-in-loop
            const queryType = await compile(
              schemaWithContext,
              queryTypeName,
              options,
            );
            input.queryType = queryType;
            generatedTypes.add(queryTypeName);
          } catch (error: any) {
            console.error(
              `Error compiling query schema for ${queryTypeName}: ${error.message}`,
            );
          }
        }
      }

      data.push(input);
    }
  }

  console.log(`Processed ${data.length} API endpoints.`);
  console.log(`Generating ${typeFilePath}...`);
  fs.writeFileSync(
    `./${typeFilePath}`,
    '// This file is auto-generated\n\n/* eslint-disable @typescript-eslint/member-ordering */\n\n',
  );

  console.log('Compiling common definitions...');
  for (const definitionName in definitions) {
    if (
      Object.hasOwn(definitions, definitionName) &&
      !generatedTypes.has(definitionName)
    ) {
      const definition = definitions[definitionName];

      (definition as any).definitions = definitions;

      try {
        // eslint-disable-next-line no-await-in-loop
        const type = await compile(
          definition as JSONSchema,
          definitionName,
          options,
        );
        fs.appendFileSync(`./${typeFilePath}`, type);
        generatedTypes.add(definitionName);
      } catch (error: any) {
        console.error(
          `[ERROR] Error compiling definition ${definitionName}: ${error.message}`,
        );
      }
    }
  }

  console.log('Appending route-specific types...');
  for (const result of data) {
    if (result.pathParameterType)
      fs.appendFileSync(`./${typeFilePath}`, result.pathParameterType);
    if (result.responseType)
      fs.appendFileSync(`./${typeFilePath}`, result.responseType);
    if (result.requestType)
      fs.appendFileSync(`./${typeFilePath}`, result.requestType);
    if (result.queryType)
      fs.appendFileSync(`./${typeFilePath}`, result.queryType);
  }

  console.log('Processing socket event types...');
  for (const socketEvent of socketEvents) {
    const {events, name} = socketEvent;
    const eventTypePromises = Object.entries(events).map(
      async ([key, value]) => {
        const eventTypeName = `${key.charAt(0).toUpperCase() + key.slice(1)}${name}Event`;
        if (!generatedTypes.has(eventTypeName)) {
          try {
            generatedTypes.add(eventTypeName);
            return await compile(value as JSONSchema, eventTypeName, options);
          } catch (error: any) {
            console.error(
              `Error compiling socket event schema ${eventTypeName}: ${error.message}`,
            );
            return `// Error generating type ${eventTypeName}\n`;
          }
        }

        return '';
      },
    );
    // eslint-disable-next-line no-await-in-loop
    const types = await Promise.all(eventTypePromises);
    fs.appendFileSync(`./${typeFilePath}`, types.filter(Boolean).join('\n'));
  }

  console.log(`Finished ${typeFilePath}.`);
  console.log(`Generating ${apiClientFilePath}...`);
  fs.writeFileSync(
    `./${apiClientFilePath}`,
    '// This file is auto-generated\n\n',
  );
  try {
    fs.appendFileSync(`./${apiClientFilePath}`, generateApiClient(data));
    console.log(`Successfully generated ${apiClientFilePath}.`);
  } catch (error: any) {
    console.error(
      `[ERROR] Failed to generate ${apiClientFilePath}: ${error.message}`,
    );
  }

  console.log(`Generating ${apiHooksFilePath}...`);
  fs.writeFileSync(
    `./${apiHooksFilePath}`,
    '// This file is auto-generated\n\n',
  );
  try {
    const hooksCode = generateApiHooks(data);
    fs.appendFileSync(`./${apiHooksFilePath}`, hooksCode);
    console.log(`Successfully generated ${apiHooksFilePath}.`);
  } catch (error: any) {
    console.error(
      `[ERROR] Failed to generate ${apiHooksFilePath}: ${error.message}\n${error.stack}`,
    );
  }

  /* Console.log(`Generating ${apiStoresFilePath}...`);
  fs.writeFileSync(
    `./${apiStoresFilePath}`,
    '// This file is auto-generated\n\n',
  );
  try {
    const storesCode = generateApiStores(data);
    fs.appendFileSync(`./${apiStoresFilePath}`, storesCode);
    console.log(`Successfully generated ${apiStoresFilePath}.`);
  } catch (error: any) {
    console.error(
      `[ERROR] Failed to generate ${apiStoresFilePath}: ${error.message}\n${error.stack}`,
    );
  } */

  console.log('\nAPI client, hooks, stores, and types generation complete.');
};

try {
  await generateClient();
} catch (error) {
  console.error('\n[FATAL] API client generation failed:', error);
  throw new Error('API client generation failed');
}
