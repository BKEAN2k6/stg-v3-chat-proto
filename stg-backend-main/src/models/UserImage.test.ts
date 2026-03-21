import {
  expect,
  it,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
} from '@jest/globals';
import mongoose from 'mongoose';
import {UserImage, AclItem} from '.';

describe('UserImage model', () => {
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

  describe('when a new document is created', () => {
    let userImageId: mongoose.Types.ObjectId;
    let communityId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      communityId = new mongoose.Types.ObjectId();

      const userImage = await UserImage.create({
        createdBy: new mongoose.Types.ObjectId(),
        originalImageUrl: 'test-original-image.jpg',
        resizedImageUrl: 'test-resized-image.jpg',
        thumbnailImageUrl: 'test-thumbnail-image.jpg',
        aspectRatio: 1.5,
        community: communityId,
      });

      userImageId = userImage._id;
    });

    it('creates an acl item for the post image', async () => {
      const aclItem = await AclItem.findOne({resourceId: userImageId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: userImageId.toHexString(),
        parent: communityId.toHexString(),
        roles: [],
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const userImage = await UserImage.create({
        createdBy: new mongoose.Types.ObjectId(),
        originalImageUrl: 'test-original-image.jpg',
        resizedImageUrl: 'test-resized-image.jpg',
        thumbnailImageUrl: 'test-thumbnail-image.jpg',
        aspectRatio: 1.5,
        community: new mongoose.Types.ObjectId(),
      });

      resourceId = userImage._id;
      await UserImage.deleteOne({_id: userImage._id});
    });

    it('removes the acl item for the post image', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const userImage = await UserImage.create({
        createdBy: new mongoose.Types.ObjectId(),
        originalImageUrl: 'test-original-image.jpg',
        resizedImageUrl: 'test-resized-image.jpg',
        thumbnailImageUrl: 'test-thumbnail-image.jpg',
        aspectRatio: 1.5,
        community: new mongoose.Types.ObjectId(),
      });

      resourceId = userImage._id;
      await userImage.deleteOne();
    });

    it('removes the acl item for the post mage', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });
});
