import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import type {RouteConfig} from '../../types/routeconfig';
import type {Logger} from '../../types/logger';

const readAjv = new Ajv({removeAdditional: 'all', discriminator: true});
const writeAjv = new Ajv();

addFormats(readAjv);
addFormats(writeAjv);

class AccessController {
  private readonly queryValidate: any;
  private readonly readValidate: any;
  private readonly writeValidate?: any;
  private readonly errorValidate?: any;

  constructor(
    private readonly routeConfig: RouteConfig,
    private readonly logger: Logger,
  ) {
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

  filterRead(data: any): any {
    if (!this.readValidate) {
      return data;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const dataCopy = JSON.parse(JSON.stringify(data));

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const valid = this.readValidate(dataCopy);
    if (!valid) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const errorCopy = JSON.parse(JSON.stringify(data));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const validError = this.errorValidate(errorCopy);
      if (validError) {
        return errorCopy;
      }

      this.logger.log(this.readValidate.errors);
      this.logger.log(JSON.stringify(dataCopy, null, 2));
      throw new Error('Invalid response data');
    }

    return dataCopy;
  }

  restrictWrite(data: any): void {
    if (!this.writeValidate) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const valid = this.writeValidate(data);

    if (!valid) {
      this.logger.log(this.writeValidate.errors);
      throw new Error('Write access denied');
    }
  }

  restrictQuery(query: any): void {
    if (!this.queryValidate) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
    const valid = this.queryValidate(query);

    if (!valid) {
      this.logger.log(this.queryValidate.errors);
      throw new Error('Invalid query parameters');
    }
  }
}

export default AccessController;
