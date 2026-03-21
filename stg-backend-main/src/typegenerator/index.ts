import fs from 'node:fs';
import {type JSONSchema, compile} from 'json-schema-to-typescript';
import definitions from '../api/schemas/definitions';
import routes from '../api/controllers';
import socketEvents from '../api/events';
import {generateApiClient} from './apiClient';
import {type GeneratorData} from './GeneratorData';

const options = {
  declareExternallyReferenced: false,
  additionalProperties: false,
  bannerComment: '',
  ignoreMinAndMaxItems: true,
};

const typeFilePath = 'src/api/client/ApiTypes.ts';
const apiClientFilePath = 'src/api/client/ApiClient.ts';

const createPathParameterType = (name: string, parameters: string[]) => {
  const type = `export type ${name} = {\n${parameters
    .map((parameter) => `  ${parameter}: string;`)
    .join('\n')}\n};\n`;
  return type;
};

const generateClient = async () => {
  const data: GeneratorData[] = [];

  for (const [path, config] of Object.entries(routes)) {
    // Extract all named parameters from the path while removing the colon
    for (const [method, routeConfig] of Object.entries(config)) {
      const input: GeneratorData = {
        path,
        method,
        noAuthRedirect: routeConfig.noAuthRedirect,
        name: routeConfig.controller.name,
      };

      const controllerName = routeConfig.controller.name;
      const typeName =
        controllerName.charAt(0).toUpperCase() + controllerName.slice(1);
      if (routeConfig.response) {
        const responseTypeName = `${typeName}Response`;
        // eslint-disable-next-line no-await-in-loop
        const responseType = await compile(
          routeConfig.response as JSONSchema,
          responseTypeName,
          options,
        );
        input.responseTypeName = responseTypeName;
        input.responseType = responseType;
      }

      const parameters =
        path.match(/:(\w+)/g)?.map((parameter) => parameter.slice(1)) ?? [];
      if (parameters.length > 0) {
        const parametersTypeName = `${typeName}Parameters`;
        const pathParameterType = createPathParameterType(
          `${parametersTypeName}`,
          parameters,
        );
        input.pathParameterType = pathParameterType;
        input.pathParameterTypeName = parametersTypeName;
      }

      if (routeConfig.request) {
        const requestTypeName = `${typeName}Request`;
        // eslint-disable-next-line no-await-in-loop
        const responseType = await compile(
          routeConfig.request as JSONSchema,
          requestTypeName,
          options,
        );
        input.requestTypeName = requestTypeName;
        input.requestType = responseType;
      }

      if (routeConfig.query) {
        const queryTypeName = `${typeName}Query`;
        // eslint-disable-next-line no-await-in-loop
        const queryType = await compile(
          routeConfig.query as JSONSchema,
          queryTypeName,
          options,
        );
        input.queryTypeName = queryTypeName;
        input.queryType = queryType;
      }

      data.push(input);
    }
  }

  fs.rmSync(`./${typeFilePath}`, {
    force: true,
  });
  fs.appendFileSync(`./${typeFilePath}`, '// This file is auto-generated\n\n');

  for (const definitionName in definitions) {
    if (Object.hasOwn(definitions, definitionName)) {
      const definition = definitions[definitionName];
      definition.definitions = definitions;
      // eslint-disable-next-line no-await-in-loop
      const type = await compile(
        definition as JSONSchema,
        definitionName,
        options,
      );
      fs.appendFileSync(`./${typeFilePath}`, type);
    }
  }

  for (const result of data) {
    if (result.pathParameterType) {
      fs.appendFileSync(`./${typeFilePath}`, result.pathParameterType);
    }

    if (result.responseType) {
      fs.appendFileSync(`./${typeFilePath}`, result.responseType);
    }

    if (result.requestType) {
      fs.appendFileSync(`./${typeFilePath}`, result.requestType);
    }

    if (result.queryType) {
      fs.appendFileSync(`./${typeFilePath}`, result.queryType);
    }
  }

  fs.rmSync(`./${apiClientFilePath}`, {
    force: true,
  });
  fs.appendFileSync(
    `./${apiClientFilePath}`,
    '// This file is auto-generated\n\n',
  );
  fs.appendFileSync(`./${apiClientFilePath}`, generateApiClient(data));

  for (const socketEvent of socketEvents) {
    const {events, name} = socketEvent;

    const eventTypes = Object.entries(events).map(async ([key, value]) => {
      const eventTypeName = `${
        key.charAt(0).toUpperCase() + key.slice(1)
      }${name}Event`;
      return compile(value as JSONSchema, eventTypeName, options);
    });

    // eslint-disable-next-line no-await-in-loop
    const types = await Promise.all(eventTypes);
    fs.appendFileSync(`./${typeFilePath}`, types.join('\n'));
  }
};

void generateClient();
