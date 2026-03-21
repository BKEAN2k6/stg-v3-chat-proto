import {type Server} from 'node:http';
import {
  it,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  jest,
  expect,
} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import Redis from 'ioredis-mock';
import {type Redis as RedisType} from 'ioredis';
import {type DocumentType} from '@typegoose/typegoose';
import {
  User,
  Community,
  CommunityInvitation,
  CommunityMembership,
} from '../models';
import {type Community as CommunityDocument} from '../models/Community';
import {type CommunityInvitation as CommunityInvitationDocument} from '../models/CommunityInvitation';
import app from '../app';

describe('login', () => {
  const testLogger = {
    log: jest.fn(),
  };
  let redis: RedisType;
  let restApi: Server;

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      dbName: global.__MONGO_DB_NAME__,
    });
    redis = new Redis();
    restApi = app(testLogger, redis);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await redis.quit();
  });

  describe('when user does not exist', () => {
    it('responds with 401 status', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'nonexistent@example.com',
          password: 'password',
        })
        .expect(401);
    });
  });

  describe('when user exists and the password is correct', () => {
    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test1@user.com',
          language: 'en',
        },
        'testuser123',
      );
    });

    it('responds with 204 status', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test1@user.com',
          password: 'testuser123',
        })
        .expect(204);
    });
  });

  describe('when user exists and the password is incorrect', () => {
    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test2@user.com',
          language: 'en',
        },
        'testuser123',
      );
    });

    it('responds with 401 status', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test2@user.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });

  describe('when user exists and the password matches the old directus password', () => {
    beforeEach(async () => {
      await User.create({
        email: 'test3@user.com',
        directusPassword:
          '$argon2id$v=19$m=65536,t=3,p=4$bK2ipVbNlRalD4fi7ncBsA$cuekRJ6jrTJvP9nqtS95tDwbkKqzDP0rL/zqZ57iN44',
      });
    });

    it('responds with 204 status', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test3@user.com',
          password: 'password',
        })
        .expect(204);
    });
  });

  describe('when the login contains a valid invitation code and the password is correct', () => {
    let community: DocumentType<CommunityDocument>;
    let invitation: DocumentType<CommunityInvitationDocument>;

    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test4@user.com',
          language: 'en',
        },
        'testuser123',
      );

      community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
      });

      invitation = await CommunityInvitation.create({community});
    });

    it('responds with 204 status and adds the user to the community', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test4@user.com',
          password: 'testuser123',
          invitationCode: invitation.code,
        })
        .expect(204);

      const communityMembership = await CommunityMembership.findOne({
        community,
      });
      expect(communityMembership).toEqual(
        expect.objectContaining({
          user: expect.any(mongoose.Types.ObjectId),
          role: 'member',
        }),
      );
    });
  });

  describe('when the login contains a invalid invitation code', () => {
    let community: DocumentType<CommunityDocument>;

    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test5@user.com',
          language: 'en',
        },
        'testuser123',
      );

      community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
      });

      await CommunityInvitation.create({community});
    });

    it('responds with 404 status', async () => {
      const response = await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test5@user.com',
          password: 'testuser123',
          invitationCode: 'invalidcode',
        })
        .expect(404);
      expect(response.body).toEqual({error: 'Invitation not found'});
    });
  });

  describe('when the login contains a valid invitation code but the community does not exist', () => {
    let invitation: DocumentType<CommunityInvitationDocument>;

    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test6@user.com',
          language: 'en',
        },
        'testuser123',
      );

      invitation = await CommunityInvitation.create({
        community: new mongoose.Types.ObjectId(),
      });
    });

    it('responds with 401 status and adds the user to the community', async () => {
      const response = await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test6@user.com',
          password: 'testuser123',
          invitationCode: invitation.code,
        })
        .expect(404);
      expect(response.body).toEqual({error: 'Community not found'});
    });
  });

  describe('when the login contains a valid invitation code and the password is iscorrect', () => {
    let community: DocumentType<CommunityDocument>;
    let invitation: DocumentType<CommunityInvitationDocument>;

    beforeEach(async () => {
      await User.register(
        {
          firstName: 'Test',
          lastName: 'User',
          email: 'test7@user.com',
          language: 'en',
        },
        'testuser123',
      );

      community = await Community.create({
        name: 'Test Community',
        description: 'Test Community Description',
      });

      invitation = await CommunityInvitation.create({community});
    });

    it('responds with 401 status and node not add the user to the community', async () => {
      await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'test7@user.com',
          password: 'wrongpassword',
          invitationCode: invitation.code,
        })
        .expect(401);

      const communityMembership = await CommunityMembership.findOne({
        community,
      });
      expect(communityMembership).toBeNull();
    });
  });
});
