import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {ArticleCategory, Article, User} from '../../../models/index.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  createTestArticleCategory,
  createTestArticle,
  registerTestUser,
} from '../../../test-utils/testDocuments.js';
import routes from '../index.js';

const updateArticleCategoryEndpoint = applySchemas(
  routes['/article-categories/:id'].patch,
);

describe('updateArticleCategory', () => {
  beforeEach(async () => {
    await Promise.all([
      ArticleCategory.deleteMany({}),
      Article.deleteMany({}),
      User.deleteMany({}),
    ]);
  });

  describe('when category is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocksAsync({
        params: {id: new mongoose.Types.ObjectId().toJSON()},
        body: {
          translations: [
            {language: 'en', name: 'Updated', description: 'Updated'},
          ],
        },
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 404', () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Category not found',
      });
    });
  });

  describe('when updating non-move fields only', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const category = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Original', description: 'Orig'}],
        displayAs: 'list',
        isHidden: false,
        isLocked: false,
      });

      mocks = createMocksAsync({
        params: {id: category._id.toJSON()},
        body: {
          translations: [
            {language: 'en', name: 'Updated', description: 'Updated desc'},
          ],
          displayAs: 'grid',
          isHidden: true,
          isLocked: true,
        },
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 with updated fields', () => {
      expect(mocks.res.statusCode).toBe(200);
      const data = mocks.res._getJSONData();
      expect(data.translations[0].name).toBe('Updated');
      expect(data.translations[0].description).toBe('Updated desc');
      expect(data.displayAs).toBe('grid');
      expect(data.isHidden).toBe(true);
      expect(data.isLocked).toBe(true);
    });
  });

  describe('when moving under a valid parent', () => {
    let mocks: Mocks<Request, Response>;
    let categoryA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let categoryB: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      categoryA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      categoryB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        order: 1,
      });

      mocks = createMocksAsync({
        params: {id: categoryB._id.toJSON()},
        body: {parentCategory: categoryA._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200', () => {
      expect(mocks.res.statusCode).toBe(200);
    });

    it('updates parentCategory and rootCategory', async () => {
      const updated = await ArticleCategory.findById(categoryB._id);
      expect(updated!.parentCategory!.toJSON()).toBe(categoryA._id.toJSON());
      expect(updated!.rootCategory.toJSON()).toBe(categoryA._id.toJSON());
    });
  });

  describe('when moving to root with parentCategory: null', () => {
    let mocks: Mocks<Request, Response>;
    let root: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let child: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      root = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Root', description: 'Root'}],
      });
      child = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Child', description: 'Child'}],
        parentCategory: root._id,
      });

      mocks = createMocksAsync({
        params: {id: child._id.toJSON()},
        body: {parentCategory: null},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200', () => {
      expect(mocks.res.statusCode).toBe(200);
    });

    it('clears parentCategory and sets rootCategory to self', async () => {
      const updated = await ArticleCategory.findById(child._id);
      expect(updated!.parentCategory).toBeUndefined();
      expect(updated!.rootCategory.toJSON()).toBe(child._id.toJSON());
    });
  });

  describe('when moving category under itself', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const category = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Self', description: 'Self'}],
      });

      mocks = createMocksAsync({
        params: {id: category._id.toJSON()},
        body: {parentCategory: category._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Cannot move category under itself',
      });
    });
  });

  describe('when moving parent under its own child (circular)', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      const catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });

      mocks = createMocksAsync({
        params: {id: catA._id.toJSON()},
        body: {parentCategory: catB._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Cannot move category under its own descendant',
      });
    });
  });

  describe('when moving parent under its own grandchild (deep circular)', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      const catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });
      const catC = await createTestArticleCategory({
        translations: [{language: 'en', name: 'C', description: 'C'}],
        parentCategory: catB._id,
      });

      mocks = createMocksAsync({
        params: {id: catA._id.toJSON()},
        body: {parentCategory: catC._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Cannot move category under its own descendant',
      });
    });
  });

  describe('when cascading rootCategory to descendant categories', () => {
    let catA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catB: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catC: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let targetRoot: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      // Tree 1: A -> B -> C
      catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });
      catC = await createTestArticleCategory({
        translations: [{language: 'en', name: 'C', description: 'C'}],
        parentCategory: catB._id,
      });

      // Tree 2: targetRoot (standalone)
      targetRoot = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Target', description: 'Target'}],
        order: 1,
      });

      // Move B (with child C) under targetRoot
      const mocks = createMocksAsync({
        params: {id: catB._id.toJSON()},
        body: {parentCategory: targetRoot._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates rootCategory on the moved category', async () => {
      const updated = await ArticleCategory.findById(catB._id);
      expect(updated!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
    });

    it('cascades rootCategory to descendant category', async () => {
      const updated = await ArticleCategory.findById(catC._id);
      expect(updated!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
    });
  });

  describe('when cascading rootCategory to articles', () => {
    let catA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catB: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let targetRoot: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let articleInA: Awaited<ReturnType<typeof createTestArticle>>;
    let articleInB: Awaited<ReturnType<typeof createTestArticle>>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      // Tree: A -> B
      catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });

      // Articles in both categories
      articleInA = await createTestArticle(user._id, {
        category: catA._id,
        rootCategory: catA._id,
      });
      articleInB = await createTestArticle(user._id, {
        category: catB._id,
        rootCategory: catA._id,
        order: 1,
      });

      // Standalone target
      targetRoot = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Target', description: 'Target'}],
        order: 1,
      });

      // Move A (with child B and articles) under targetRoot
      const mocks = createMocksAsync({
        params: {id: catA._id.toJSON()},
        body: {parentCategory: targetRoot._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates rootCategory on article in moved category', async () => {
      const updated = await Article.findById(articleInA._id);
      expect(updated!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
    });

    it('updates rootCategory on article in descendant category', async () => {
      const updated = await Article.findById(articleInB._id);
      expect(updated!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
    });
  });

  describe('when a root category becomes a child', () => {
    let mocks: Mocks<Request, Response>;
    let rootA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let rootB: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      rootA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Root A', description: 'A'}],
      });
      rootB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Root B', description: 'B'}],
        order: 1,
      });

      // Move rootA under rootB (rootA was its own root, now becomes child)
      mocks = createMocksAsync({
        params: {id: rootA._id.toJSON()},
        body: {parentCategory: rootB._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200', () => {
      expect(mocks.res.statusCode).toBe(200);
    });

    it('changes rootCategory from self to new tree root', async () => {
      const updated = await ArticleCategory.findById(rootA._id);
      expect(updated!.rootCategory.toJSON()).toBe(rootB._id.toJSON());
      expect(updated!.parentCategory!.toJSON()).toBe(rootB._id.toJSON());
    });
  });

  describe('when a child becomes root', () => {
    let catA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catB: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catC: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      // Tree: A -> B -> C, with articles
      catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });
      catC = await createTestArticleCategory({
        translations: [{language: 'en', name: 'C', description: 'C'}],
        parentCategory: catB._id,
      });

      await createTestArticle(user._id, {
        category: catC._id,
        rootCategory: catA._id,
      });

      // Move B to root (B still has child C)
      const mocks = createMocksAsync({
        params: {id: catB._id.toJSON()},
        body: {parentCategory: null},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sets rootCategory to self', async () => {
      const updated = await ArticleCategory.findById(catB._id);
      expect(updated!.parentCategory).toBeUndefined();
      expect(updated!.rootCategory.toJSON()).toBe(catB._id.toJSON());
    });

    it('cascades rootCategory to descendants', async () => {
      const updated = await ArticleCategory.findById(catC._id);
      expect(updated!.rootCategory.toJSON()).toBe(catB._id.toJSON());
    });

    it('cascades rootCategory to articles in descendants', async () => {
      const article = await Article.findOne({category: catC._id});
      expect(article!.rootCategory.toJSON()).toBe(catB._id.toJSON());
    });
  });

  describe('when moving within the same tree', () => {
    let catA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catB: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catC: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      // Tree: A -> B, A -> C
      catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });
      catC = await createTestArticleCategory({
        translations: [{language: 'en', name: 'C', description: 'C'}],
        parentCategory: catA._id,
        order: 1,
      });

      // Move C under B (same root tree)
      const mocks = createMocksAsync({
        params: {id: catC._id.toJSON()},
        body: {parentCategory: catB._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('updates parentCategory', async () => {
      const updated = await ArticleCategory.findById(catC._id);
      expect(updated!.parentCategory!.toJSON()).toBe(catB._id.toJSON());
    });

    it('keeps the same rootCategory', async () => {
      const updated = await ArticleCategory.findById(catC._id);
      expect(updated!.rootCategory.toJSON()).toBe(catA._id.toJSON());
    });
  });

  describe('when invalid parent category ID is provided', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const category = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Test', description: 'Test'}],
      });

      mocks = createMocksAsync({
        params: {id: category._id.toJSON()},
        body: {parentCategory: new mongoose.Types.ObjectId().toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 400', () => {
      expect(mocks.res.statusCode).toBe(400);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Invalid parent category',
      });
    });
  });

  describe('when deep tree is moved (multi-level cascade)', () => {
    let catA: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catB: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catC: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let catD: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let targetRoot: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      // Deep tree: A -> B -> C -> D
      catA = await createTestArticleCategory({
        translations: [{language: 'en', name: 'A', description: 'A'}],
      });
      catB = await createTestArticleCategory({
        translations: [{language: 'en', name: 'B', description: 'B'}],
        parentCategory: catA._id,
      });
      catC = await createTestArticleCategory({
        translations: [{language: 'en', name: 'C', description: 'C'}],
        parentCategory: catB._id,
      });
      catD = await createTestArticleCategory({
        translations: [{language: 'en', name: 'D', description: 'D'}],
        parentCategory: catC._id,
      });

      // Articles at every level
      await createTestArticle(user._id, {
        category: catB._id,
        rootCategory: catA._id,
      });
      await createTestArticle(user._id, {
        category: catD._id,
        rootCategory: catA._id,
        order: 1,
      });

      targetRoot = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Target', description: 'Target'}],
        order: 1,
      });

      // Move B under targetRoot (B has children C -> D)
      const mocks = createMocksAsync({
        params: {id: catB._id.toJSON()},
        body: {parentCategory: targetRoot._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('cascades rootCategory through all descendant levels', async () => {
      const updatedB = await ArticleCategory.findById(catB._id);
      const updatedC = await ArticleCategory.findById(catC._id);
      const updatedD = await ArticleCategory.findById(catD._id);

      expect(updatedB!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
      expect(updatedC!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
      expect(updatedD!.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
    });

    it('cascades rootCategory to articles at all levels', async () => {
      const articles = await Article.find({});
      for (const article of articles) {
        expect(article.rootCategory.toJSON()).toBe(targetRoot._id.toJSON());
      }
    });
  });

  describe('order assignment in new parent siblings', () => {
    let mocks: Mocks<Request, Response>;
    let target: Awaited<ReturnType<typeof createTestArticleCategory>>;
    let moved: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      target = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Target', description: 'T'}],
      });

      // Target already has 2 children
      await createTestArticleCategory({
        translations: [{language: 'en', name: 'Existing1', description: 'E1'}],
        parentCategory: target._id,
        order: 0,
      });
      await createTestArticleCategory({
        translations: [{language: 'en', name: 'Existing2', description: 'E2'}],
        parentCategory: target._id,
        order: 1,
      });

      // Standalone category to move
      moved = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Moved', description: 'M'}],
        order: 1,
      });

      mocks = createMocksAsync({
        params: {id: moved._id.toJSON()},
        body: {parentCategory: target._id.toJSON()},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('assigns order after existing siblings', async () => {
      const updated = await ArticleCategory.findById(moved._id);
      expect(updated!.order).toBe(2);
    });
  });

  describe('when moving a category that is already a root to root', () => {
    let mocks: Mocks<Request, Response>;
    let rootCategory: Awaited<ReturnType<typeof createTestArticleCategory>>;

    beforeEach(async () => {
      rootCategory = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Root', description: 'Root'}],
      });

      // Move to root when already a root (no-op)
      mocks = createMocksAsync({
        params: {id: rootCategory._id.toJSON()},
        body: {parentCategory: null},
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('returns 200 without changes', () => {
      expect(mocks.res.statusCode).toBe(200);
    });

    it('keeps rootCategory as self', async () => {
      const updated = await ArticleCategory.findById(rootCategory._id);
      expect(updated!.parentCategory).toBeUndefined();
      expect(updated!.rootCategory.toJSON()).toBe(rootCategory._id.toJSON());
    });
  });

  describe('response format', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const root = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Root', description: 'Root'}],
      });
      const child = await createTestArticleCategory({
        translations: [{language: 'en', name: 'Child', description: 'Child'}],
        parentCategory: root._id,
      });

      mocks = createMocksAsync({
        params: {id: child._id.toJSON()},
        body: {
          translations: [
            {language: 'en', name: 'Updated', description: 'Updated'},
          ],
        },
      });
      await updateArticleCategoryEndpoint(mocks.req, mocks.res);
      await mocks.result;
    });

    it('includes parentCategory in response', () => {
      const data = mocks.res._getJSONData();
      expect(data.parentCategory).toBeDefined();
    });

    it('includes categoryPath in response', () => {
      const data = mocks.res._getJSONData();
      expect(data.categoryPath).toBeDefined();
      expect(Array.isArray(data.categoryPath)).toBe(true);
    });

    it('includes empty subCategories and articles arrays', () => {
      const data = mocks.res._getJSONData();
      expect(data.subCategories).toEqual([]);
      expect(data.articles).toEqual([]);
    });
  });
});
