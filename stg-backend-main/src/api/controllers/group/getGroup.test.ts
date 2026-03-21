import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  jest,
} from '@jest/globals';
import {type Request, type Response} from 'express';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';
import {Group} from '../../../models';
import {getGroup} from './getGroup';

const createRequest = (id: mongoose.Types.ObjectId) =>
  httpMocks.createRequest({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });

describe('getGroup', () => {
  beforeAll(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await mongoose.connect(global.__MONGO_URI__, {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      dbName: global.__MONGO_DB_NAME__,
    });
  });
  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('when group is not found', () => {
    let request: httpMocks.MockRequest<Request>;
    let response: httpMocks.MockResponse<Response>;

    beforeEach(async () => {
      request = createRequest(new mongoose.Types.ObjectId());
      response = httpMocks.createResponse();
    });

    it('sends an error response', async () => {
      await getGroup(request, response);

      expect(response.statusCode).toBe(404);
      expect(response._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group is found', () => {
    let request: httpMocks.MockRequest<Request>;
    let response: httpMocks.MockResponse<Response>;

    beforeEach(async () => {
      const group = await Group.create({
        community: new mongoose.Types.ObjectId(),
        description: 'This is a test group',
        name: 'Test group',
      });
      request = createRequest(group._id);
      response = httpMocks.createResponse();
    });

    it('should respond with the group data', async () => {
      await getGroup(request, response);

      expect(response.statusCode).toBe(200);
      expect(response._getJSONData()).toEqual({
        _id: expect.any(String),
        name: 'Test group',
        description: 'This is a test group',
        community: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        __v: 0,
      });
    });
  });
});
