/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {Ajv} from 'ajv';
import addFormats from 'ajv-formats';
import {AggregateAjvError} from '@segment/ajv-human-errors';
import type {RouteConfig} from '../../types/routeconfig.js';

const readAjv = new Ajv({
  removeAdditional: 'all',
  discriminator: true,
  allErrors: true,
  verbose: true,
});

const writeAjv = new Ajv({
  allErrors: true,
  verbose: true,
});

addFormats.default(readAjv);
addFormats.default(writeAjv);

class AccessController {
  private readonly queryValidate: any;
  private readonly readValidate: any;
  private readonly writeValidate?: any;
  private readonly errorValidate?: any;

  constructor(private readonly routeConfig: RouteConfig) {
    if (routeConfig.response) {
      this.readValidate = readAjv.compile(routeConfig.response);
    }

    if (routeConfig.request) {
      this.writeValidate = writeAjv.compile(routeConfig.request);
    }

    if (routeConfig.query) {
      this.queryValidate = writeAjv.compile(routeConfig.query);
    }

    this.errorValidate = writeAjv.compile({
      type: 'object',
      properties: {
        error: {
          type: 'string',
        },
      },
      required: ['error'],
    });
  }

  restrictPath(roles: string[]): void {
    const hasRole: boolean = this.routeConfig.access.some((item: string) =>
      roles.includes(item),
    );

    if (!hasRole) {
      throw new Error(
        `Role(s) ${roles.join(', ')} are not allowed to access the resource`,
      );
    }
  }

  filterRead(data: any, statusCode: number): any {
    if (!this.readValidate) {
      return data;
    }

    // eslint-disable-next-line unicorn/prefer-structured-clone
    const dataCopy = JSON.parse(JSON.stringify(data));
    const valid = statusCode < 400 && this.readValidate(dataCopy);
    if (!valid) {
      // eslint-disable-next-line unicorn/prefer-structured-clone
      const errorCopy = JSON.parse(JSON.stringify(data));
      const validError = this.errorValidate(errorCopy);
      if (validError) {
        return errorCopy;
      }

      const errors = new AggregateAjvError(this.readValidate.errors);
      throw new Error(`Invalid response data: ${errors.message}`);
    }

    return dataCopy;
  }

  restrictWrite(data: any): void {
    if (!this.writeValidate) {
      return;
    }

    const valid = this.writeValidate(data);
    if (!valid) {
      const errors = new AggregateAjvError(this.writeValidate.errors);
      throw new Error(`Invalid request data: ${errors.message}`);
    }
  }

  restrictQuery(query: any): void {
    if (!this.queryValidate) {
      return;
    }

    const valid = this.queryValidate(query);
    if (!valid) {
      const errors = new AggregateAjvError(this.queryValidate.errors);
      throw new Error(`Invalid query data: ${errors.message}`);
    }
  }
}

export default AccessController;
