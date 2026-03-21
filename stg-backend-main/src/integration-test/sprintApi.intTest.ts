import 'dotenv/config'; // eslint-disable-line import/no-unassigned-import
import {type Server} from 'node:http'; // eslint-disable-line import/order
import {expect, it, describe, beforeAll, afterAll, jest} from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import Redis from 'ioredis-mock';
import {type DocumentType} from '@typegoose/typegoose';
import {type Community as CommunityDocument} from '../models/Community';
import {User, Community} from '../models';
import app from '../app';

type HostSprint = {
  _id: string;
  name: string;
  players: any[];
  isStarted: boolean;
  code: string;
};

type PlayerSprint = {
  _id: string;
  name: string;
  room: Array<{_id: string; sharedStrengths: any[]}>;
};

describe('Sprint API Integration', () => {
  const testLogger = {
    log: jest.fn(),
  };
  let redis;
  let restApi: Server;
  let sprint: HostSprint;
  const PLAYER_COUNT = 23;

  let hostCookie: string[];
  const playerCookies: string[][] = [];
  const playerSprints: PlayerSprint[] = [];

  beforeAll(async () => {
    await mongoose.connect(global.__MONGO_URI__, {
      dbName: global.__MONGO_DB_NAME__,
    });
    redis = new Redis();
    restApi = app(testLogger, redis);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('Strength Sprint', () => {
    let community: DocumentType<CommunityDocument>;

    beforeAll(async () => {
      const hostPlayer = await User.register(
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@doe.com',
          language: 'en',
        },
        'password',
      );

      community = await Community.create({
        name: 'Admin Community',
        groups: [],
      });

      await community.upsertMemberAndSave(hostPlayer._id, 'admin');

      community.groups.push(community._id);
      await community.save();
      hostPlayer.selectedCommunity = community;
    });

    it('should be abled to be played', async () => {
      const loginResposne: any = await request(restApi)
        .post('/api/v1/login')
        .set('Content-Type', 'application/json')
        .send({
          email: 'john@doe.com',
          password: 'password',
        });

      hostCookie = loginResposne.headers['set-cookie'] as string[];
      // Host creates the sprint
      const sprintResponse: any = await request(restApi)
        .post(`/api/v1/communities/${community._id.toHexString()}/sprints`)
        .set('Cookie', hostCookie)
        .set('Content-Type', 'application/json')
        .send({name: 'Test Sprint'});

      sprint = sprintResponse.body as HostSprint;

      expect(sprint).toEqual({
        _id: expect.any(String),
        code: expect.any(String),
      });

      // Players join the sprint
      for (let i = 0; i < PLAYER_COUNT; i++) {
        const nickname = `Player ${i + 1}`;
        // eslint-disable-next-line no-await-in-loop
        const playerResponse: any = await request(restApi)
          .post(`/api/v1/sprints/${sprint._id}/players`)
          .set('Content-Type', 'application/json')
          .send({nickname, color: '#000000', avatar: 'avatar.svg'});

        playerCookies.push(playerResponse.headers['set-cookie'] as string[]);
      }

      // Host retrieves the sprint again
      const sprintResponse2: any = await request(restApi)
        .get(`/api/v1/sprints/${sprint._id}/host`)
        .set('Cookie', hostCookie);

      expect(sprintResponse2.body).toEqual({
        _id: sprint._id,
        isEnded: false,
        isStarted: false,
        isCompleted: false,
        code: expect.any(String),
        expectedStrengthCount: 0,
        players: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            nickname: expect.any(String),
          }),
        ]),
        sharedStrengths: [],
      });

      // Host starts the sprint
      const sprintResponse3: any = await request(restApi)
        .patch(`/api/v1/sprints/${sprint._id}/host`)
        .set('Cookie', hostCookie)
        .set('Content-Type', 'application/json')
        .send({isStarted: true});
      expect(sprintResponse3.body).toEqual({
        _id: sprint._id,
        isEnded: false,
        code: expect.any(String),
        players: expect.arrayContaining([
          expect.objectContaining({
            _id: expect.any(String),
            nickname: expect.any(String),
          }),
        ]),
        isStarted: true,
        sharedStrengths: [],
      });

      // Players get their rooms
      for (let i = 0; i < PLAYER_COUNT; i++) {
        // eslint-disable-next-line no-await-in-loop
        const playerSprintResponse: any = await request(restApi)
          .get(`/api/v1/sprints/${sprint._id}/player`)
          .set('Cookie', playerCookies[i]);
        playerSprints.push(playerSprintResponse.body as PlayerSprint);
      }

      expect(playerSprints[0].room.length).toBe(7);
      expect(playerSprints[1].room.length).toBe(7);
      expect(playerSprints[2].room.length).toBe(6);

      // Players share strengths
      for (let i = 0; i < PLAYER_COUNT; i++) {
        const sprint = playerSprints[i];
        for (const peer of sprint.room) {
          // eslint-disable-next-line no-await-in-loop
          const shareResponse: any = await request(restApi)
            .post(`/api/v1/sprints/${sprint._id}/strengths`)
            .set('Cookie', playerCookies[i])
            .set('Content-Type', 'application/json')
            .send({strength: 'creativity', to: peer._id});
          expect(shareResponse.status).toBe(201);
        }
      }

      // Host gets the sprint again
      const sprintResponse4: any = await request(restApi)
        .get(`/api/v1/sprints/${sprint._id}/host`)
        .set('Cookie', hostCookie);
      expect(sprintResponse4.body.sharedStrengths.length).toEqual(
        8 * 7 + 8 * 7 + 7 * 6,
      );

      // Player 1 get their sprint again
      const playerSprintResponse: any = await request(restApi)
        .get(`/api/v1/sprints/${sprint._id}/player`)
        .set('Cookie', playerCookies[0]);

      const receivedStrengths = playerSprintResponse.body
        .receivedStrengths as Array<{
        from: {_id: string; nickname: string};
        strength: string;
      }>;

      expect(receivedStrengths.length).toEqual(7);
      expect(receivedStrengths).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            from: expect.objectContaining({
              _id: expect.any(String),
              nickname: expect.any(String),
            }),
            strength: expect.any(String),
          }),
        ]),
      );
    }, 60_000);
  });
});
