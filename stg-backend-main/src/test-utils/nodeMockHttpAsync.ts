import EventEmitter from 'node:events';
import {type Request, type Response} from 'express';
import httpMocks, {
  type MockRequest,
  type MockResponse,
  type RequestOptions,
  type ResponseOptions,
} from 'node-mocks-http';

export type Mocks<T1 extends Request, T2 extends Response> = {
  req: MockRequest<T1>;
  res: MockResponse<T2>;
  result: Promise<any[]>;
  err: any;
};

httpMocks.createResponse({eventEmitter: EventEmitter});

export function createMocksAsync<
  T1 extends Request = Request,
  T2 extends Response = Response,
>(
  requestParameters?: RequestOptions,
  responseParameters?: ResponseOptions,
): Mocks<T1, T2> {
  let errorResolver;
  const error = new Promise((response) => {
    errorResolver = response;
  });

  const {req, res} = httpMocks.createMocks<T1, T2>(
    requestParameters,
    responseParameters,
  );

  let dataResolver: (data: Record<string, unknown>) => void | undefined;
  const data = new Promise((resolve) => {
    dataResolver = resolve;
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  res.on('end', () => dataResolver(res._getData()));

  const result = Promise.race([
    Promise.all([error, null]),
    Promise.all([null, data]),
  ]);
  return {req, res, err: errorResolver, result};
}
