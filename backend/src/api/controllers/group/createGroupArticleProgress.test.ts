import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {
  Article,
  Community,
  Group,
  StrengthCompleted,
  User,
} from '../../../models/index.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  registerTestUser,
  createTestGroup,
  createTestCommunity,
} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';

const createGroupArticleProgress = applySchemas(
  routes['/groups/:id/article-progress'].post,
);

function createMocks(
  groupId: mongoose.Types.ObjectId,
  articleId: mongoose.Types.ObjectId,
): Mocks<Request, Response> {
  return createMocksAsync({
    params: {id: groupId.toJSON()},
    body: {article: articleId.toJSON()},
    user: {
      id: new mongoose.Types.ObjectId().toJSON(),
    },
  });
}

describe('createGroupArticleProgress', () => {
  let mocks: Mocks<Request, Response>;
  let articleId: mongoose.Types.ObjectId;

  beforeEach(async () => {
    await Promise.all([
      Community.deleteMany({}),
      Group.deleteMany({}),
      Article.deleteMany({}),
      StrengthCompleted.deleteMany({}),
      User.deleteMany({}),
    ]);

    const article = await Article.create({
      translations: [
        {
          language: 'en',
          description: 'Test description',
          title: 'Test title',
          content: [],
        },
      ],
      thumbnail: 'article-thubmnail-7e71adbb.jpg',
      length: '10:00',
      strengths: ['curiosity'],
      category: new mongoose.Types.ObjectId(),
      rootCategory: new mongoose.Types.ObjectId(),
      order: 1,
      updatedBy: new mongoose.Types.ObjectId(),
      isHidden: false,
      isLocked: false,
    });
    articleId = article._id;
    const user = await registerTestUser({});
    const community = await createTestCommunity();
    const group = await createTestGroup(user._id, community._id);

    mocks = createMocks(group._id, articleId);
    await createGroupArticleProgress(mocks.req, mocks.res);
    await mocks.result;
  });

  describe('when group exists', () => {
    it('adds one articleProgress entry and returns 201/json', async () => {
      expect(mocks.res.statusCode).toBe(201);
      expect(mocks.res._getJSONData()).toEqual({
        article: articleId.toJSON(),
        completionDate: expect.any(String),
      });
    });
  });

  describe('when completing all 4 chapters of a strength', () => {
    it('creates a StrengthCompleted post', async () => {
      const user = await registerTestUser({email: 'unique@test.com'});
      const community = await createTestCommunity();
      const group = await createTestGroup(user._id, community._id);

      const chapters = ['start', 'speak', 'act', 'assess'] as const;
      const articles = await Promise.all(
        chapters.map(async (chapter) =>
          Article.create({
            translations: [
              {
                language: 'en',
                title: chapter,
                description: 'Test description',
                content: [],
              },
            ],
            thumbnail: 'thumb.jpg',
            length: '10:00',
            strengths: ['love'],
            timelineStrength: 'love',
            timelineAgeGroup: '7-8',
            timelineChapter: chapter,
            category: new mongoose.Types.ObjectId(),
            rootCategory: new mongoose.Types.ObjectId(),
            order: 1,
            updatedBy: user._id,
            isHidden: false,
            isLocked: false,
          }),
        ),
      );

      // Complete first 3 chapters
      await Promise.all(
        articles.slice(0, 3).map((article) =>
          Group.updateOne(
            {_id: group._id},
            {
              $push: {
                articleProgress: {
                  article: article._id,
                  completionDate: new Date(),
                },
              },
            },
          ),
        ),
      );

      // Complete the 4th chapter via the controller
      const lastArticle = articles[3];
      const requestMocks = createMocks(group._id, lastArticle._id);
      requestMocks.req.user = {id: user._id.toJSON()};

      await createGroupArticleProgress(requestMocks.req, requestMocks.res);
      await requestMocks.result;

      expect(requestMocks.res.statusCode).toBe(201);

      const post = await StrengthCompleted.findOne({
        group: group._id,
        strength: 'love',
      });

      expect(post).toBeDefined();
      expect(post?.postType).toBe('strength-completed');

      // Verify duplicate is created if we complete the strength again (simulate by removing progress)
      await Group.updateOne(
        {_id: group._id},
        {$pull: {articleProgress: {article: lastArticle._id}}},
      );

      const requestMocks2 = createMocks(group._id, lastArticle._id);
      requestMocks2.req.user = {id: user._id.toJSON()};

      await createGroupArticleProgress(requestMocks2.req, requestMocks2.res);
      await requestMocks2.result;

      const posts = await StrengthCompleted.find({
        group: group._id,
        strength: 'love',
      });
      expect(posts.length).toBe(2);
    });
  });
});
