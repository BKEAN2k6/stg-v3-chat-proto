import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import routes from '../index.js';
import {
  registerTestUser,
  createTestGroup,
} from '../../../test-utils/testDocuments.js';
import {
  Article,
  Group,
  GroupGame,
  StrengthGoal,
} from '../../../models/index.js';

const getGroupStats = applySchemas(routes['/groups/:id/stats'].get);

const createMocks = (groupId: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: groupId.toJSON(),
    },
  });

describe('getGroupStats', () => {
  describe('when group is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a 404 response', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Group not found',
      });
    });
  });

  describe('when group exists with no activity', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );
      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns all counts as 0 and streak as 0', () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        lessons: {count: 0},
        diplomas: {count: 0},
        games: {
          count: 0,
          byType: [
            {slug: 'memory-game', count: 0},
            {slug: 'sprint', count: 0},
          ],
        },
        goals: {count: 0},
        streak: 0,
      });
    });
  });

  describe('when group has completed lessons', () => {
    let mocks: Mocks<Request, Response>;
    let completionDate: Date;

    beforeEach(async () => {
      const user = await registerTestUser({email: 'lessons@test.com'});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );

      const article = await Article.create({
        translations: [
          {
            language: 'en',
            title: 'Test',
            description: 'Test',
            content: [],
          },
        ],
        thumbnail: 'thumb.jpg',
        length: '10:00',
        strengths: ['kindness'],
        category: new mongoose.Types.ObjectId(),
        rootCategory: new mongoose.Types.ObjectId(),
        order: 1,
        updatedBy: user._id,
        isHidden: false,
        isLocked: false,
      });

      completionDate = new Date('2025-06-15T10:00:00.000Z');

      await Group.updateOne(
        {_id: group._id},
        {
          $push: {
            articleProgress: {
              article: article._id,
              completionDate,
            },
          },
        },
      );

      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns the correct lesson count and updatedAt', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.lessons.count).toBe(1);
      expect(data.lessons.updatedAt).toBe(completionDate.toJSON());
    });
  });

  describe('when group has a completed diploma', () => {
    let mocks: Mocks<Request, Response>;
    let lastCompletionDate: Date;

    beforeEach(async () => {
      const user = await registerTestUser({email: 'diploma@test.com'});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
        {ageGroup: '7-8'},
      );

      const chapters = ['start', 'speak', 'act', 'assess'] as const;
      const articles = await Promise.all(
        chapters.map(async (chapter) =>
          Article.create({
            translations: [
              {
                language: 'en',
                title: chapter,
                description: 'Test',
                content: [],
              },
            ],
            thumbnail: 'thumb.jpg',
            length: '10:00',
            strengths: ['kindness'],
            timelineStrength: 'kindness',
            timelineAgeGroup: '7-8',
            timelineChapter: chapter,
            isTimelineArticle: true,
            category: new mongoose.Types.ObjectId(),
            rootCategory: new mongoose.Types.ObjectId(),
            order: 1,
            updatedBy: user._id,
            isHidden: false,
            isLocked: false,
          }),
        ),
      );

      lastCompletionDate = new Date('2025-06-20T12:00:00.000Z');

      const completionDates = [
        '2025-06-17T12:00:00.000Z',
        '2025-06-18T12:00:00.000Z',
        '2025-06-19T12:00:00.000Z',
        '2025-06-20T12:00:00.000Z',
      ];

      await Group.updateOne(
        {_id: group._id},
        {
          $push: {
            articleProgress: {
              $each: articles.map((article, index) => ({
                article: article._id,
                completionDate: new Date(completionDates[index]),
              })),
            },
          },
        },
      );

      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns diploma count 1 with updatedAt and correct lesson count', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.diplomas.count).toBe(1);
      expect(data.diplomas.updatedAt).toBe(lastCompletionDate.toJSON());
      expect(data.lessons.count).toBe(4);
    });
  });

  describe('when group has ended games', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({email: 'games@test.com'});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );

      // 2 memory games
      await GroupGame.create({
        gameType: 'memory-game',
        createdBy: user._id,
        code: 'ABC123',
        codeActiveUntil: new Date(),
        isStarted: true,
        isEnded: true,
        group: group._id,
        players: [],
      });

      await GroupGame.create({
        gameType: 'memory-game',
        createdBy: user._id,
        code: 'DEF456',
        codeActiveUntil: new Date(),
        isStarted: true,
        isEnded: true,
        group: group._id,
        players: [],
      });

      // 1 sprint
      await GroupGame.create({
        gameType: 'sprint',
        createdBy: user._id,
        code: 'SPR123',
        codeActiveUntil: new Date(),
        isStarted: true,
        isEnded: true,
        group: group._id,
        players: [],
      });

      // Not ended — should not be counted
      await GroupGame.create({
        gameType: 'memory-game',
        createdBy: user._id,
        code: 'GHI789',
        codeActiveUntil: new Date(),
        isStarted: true,
        isEnded: false,
        group: group._id,
        players: [],
      });

      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns the correct game count, byType, and updatedAt', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.games.count).toBe(3);
      expect(data.games.byType).toEqual([
        {slug: 'memory-game', count: 2},
        {slug: 'sprint', count: 1},
      ]);
      expect(data.games.updatedAt).toBeDefined();
    });
  });

  describe('when group has finished goals', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({email: 'goals@test.com'});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );

      // Finished goal (events.length >= target)
      await StrengthGoal.create({
        strength: 'kindness',
        target: 2,
        targetDate: new Date('2026-01-01'),
        group: group._id,
        createdBy: user._id,
        events: [
          {createdAt: new Date('2025-06-10'), createdBy: user._id},
          {createdAt: new Date('2025-06-12'), createdBy: user._id},
        ],
      });

      // Unfinished goal — should not be counted
      await StrengthGoal.create({
        strength: 'courage',
        target: 5,
        targetDate: new Date('2026-01-01'),
        group: group._id,
        createdBy: user._id,
        events: [{createdAt: new Date('2025-06-11'), createdBy: user._id}],
      });

      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns the correct finished goal count and updatedAt', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.goals.count).toBe(1);
      expect(data.goals.updatedAt).toBe(new Date('2025-06-12').toJSON());
    });
  });

  describe('streak calculation', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({email: 'streak@test.com'});
      const group = await createTestGroup(
        user._id,
        new mongoose.Types.ObjectId(),
      );

      const article = await Article.create({
        translations: [
          {
            language: 'en',
            title: 'Streak Test',
            description: 'Test',
            content: [],
          },
        ],
        thumbnail: 'thumb.jpg',
        length: '10:00',
        strengths: ['kindness'],
        category: new mongoose.Types.ObjectId(),
        rootCategory: new mongoose.Types.ObjectId(),
        order: 1,
        updatedBy: user._id,
        isHidden: false,
        isLocked: false,
      });

      // Add an article completion today
      await Group.updateOne(
        {_id: group._id},
        {
          $push: {
            articleProgress: {
              article: article._id,
              completionDate: new Date(),
            },
          },
        },
      );

      mocks = createMocks(group._id);
      await getGroupStats(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns a streak of at least 1', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.streak).toBeGreaterThanOrEqual(1);
    });
  });
});
