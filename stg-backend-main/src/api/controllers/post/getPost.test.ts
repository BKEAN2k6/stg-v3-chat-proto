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
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  Moment,
  Challenge,
  ProxyPost,
  CoachPost,
  User,
  Community,
  Group,
  UserImage,
  Reaction,
  Comment,
  ChallengeParticipation,
  SprintResult,
} from '../../../models';
import {type Moment as MomentDocument} from '../../../models/Post/Moment';
import {type Challenge as ChallengeDocument} from '../../../models/Post/Challenge';
import {type ProxyPost as ProxyPostDocument} from '../../../models/Post/ProxyPost';
import {type CoachPost as CoachPostDocument} from '../../../models/Post/CoachPost';
import {type User as UserDocument} from '../../../models/User';
import {type Community as CommunityDocument} from '../../../models/Community';
import {type Group as GroupDocument} from '../../../models/Group';
import {type UserImage as UserImageDocument} from '../../../models/UserImage';
import {type Reaction as ReactionDocument} from '../../../models/Reaction';
import {type Comment as CommentDocument} from '../../../models/Comment';
import {type ChallengeParticipation as ChallengeParticipationDocument} from '../../../models/ChallengeParticipation';
import {type SprintResult as SprintResultDocument} from '../../../models/Post/SprintResult';
import {applySchemas} from '../../../test-utils/applySchemas';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync';
import routes from '../index';

const getPost = applySchemas(routes['/posts/:id'].get);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toHexString(),
    },
    logger: {
      log: jest.fn(),
    },
  });
};

describe('getPost', () => {
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

  let user: DocumentType<UserDocument>;
  let community: DocumentType<CommunityDocument>;
  let group: DocumentType<GroupDocument>;
  let userImage: DocumentType<UserImageDocument>;
  let moment: DocumentType<MomentDocument>;
  let proxyMoment: DocumentType<MomentDocument>;
  let proxyPost: DocumentType<ProxyPostDocument>;
  let coachPost: DocumentType<CoachPostDocument>;
  let challenge: DocumentType<ChallengeDocument>;
  let challengeParticipation: DocumentType<ChallengeParticipationDocument>;
  let sprintResult: DocumentType<SprintResultDocument>;
  let challengeComment: DocumentType<CommentDocument>;
  let momentComment: DocumentType<CommentDocument>;
  let proxyMomentComment: DocumentType<CommentDocument>;
  let sprintResultComment: DocumentType<CommentDocument>;
  let coachPostComment: DocumentType<CommentDocument>;
  let coachPostReaction: DocumentType<ReactionDocument>;
  let momentReaction: DocumentType<ReactionDocument>;
  let proxyMomentReaction: DocumentType<ReactionDocument>;
  let challengeReaction: DocumentType<ReactionDocument>;
  let sprintResultReaction: DocumentType<ReactionDocument>;
  let commentReaction: DocumentType<ReactionDocument>;
  let commentComment: DocumentType<CommentDocument>;
  let commentCommentReaction: DocumentType<ReactionDocument>;

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => {
        await collection.deleteMany({});
      }),
    );

    user = await User.create({
      email: 'test@test.com',
      avatar: 'testProfileImage.jpg',
      firstName: 'Test',
      lastName: 'User',
    });

    community = new Community({
      name: 'Test community',
      description: 'This is a test community',
    });

    group = new Group({
      name: 'Test group',
      description: 'This is a test group',
      community: community._id,
    });

    userImage = new UserImage({
      createdBy: user,
      thumbnailImageUrl: 'testThumbnailImage.jpg',
      resizedImageUrl: 'testResizedImage.jpg',
      originalImageUrl: 'testOriginalImage.jpg',
      community: community._id,
      aspectRatio: 1,
    });

    moment = new Moment({
      content: 'This is a test moment',
      images: [userImage],
      strengths: ['love'],
      createdBy: user,
      community,
      groups: [group._id],
      users: [user._id],
    });

    proxyMoment = new Moment({
      content: 'This is a test proxy moment',
      images: [userImage],
      strengths: ['love'],
      createdBy: user,
      community: new mongoose.Types.ObjectId(),
      groups: [group._id],
      users: [user._id],
    });

    proxyPost = new ProxyPost({
      postReference: proxyMoment,
      community,
    });

    coachPost = new CoachPost({
      translations: {
        en: 'Test coach post',
        fi: 'Testi valmentaja viesti',
        sv: 'Test coach post',
      },
      showDate: new Date(0),
      images: [userImage],
      strengths: ['love'],
    });

    challenge = new Challenge({
      translations: {
        en: 'Test challenge',
        fi: 'Testi haaste',
        sv: 'Test utmaning',
      },
      theme: 'default',
      showDate: new Date(),
      strength: 'love',
      community,
      groups: [group._id],
      users: [user._id],
    });

    challengeParticipation = new ChallengeParticipation({
      user,
      challenge,
    });

    sprintResult = new SprintResult({
      createdBy: user,
      community,
      strengths: [
        {
          strength: 'love',
          count: 1,
        },
      ],
    });

    challengeComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for challenge',
      target: challenge._id,
      rootTarget: challenge._id,
      createdBy: user,
      images: [userImage],
    });

    momentComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for moment',
      target: moment._id,
      rootTarget: moment._id,
      createdBy: user,
      images: [userImage],
    });

    proxyMomentComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for proxy moment',
      target: proxyPost._id,
      rootTarget: proxyPost._id,
      createdBy: user,
      images: [userImage],
    });

    sprintResultComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for sprint result',
      target: sprintResult._id,
      rootTarget: sprintResult._id,
      createdBy: user,
      images: [userImage],
    });

    coachPostComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for coach post',
      target: coachPost._id,
      rootTarget: coachPost._id,
      createdBy: user,
      images: [userImage],
    });

    coachPostReaction = new Reaction({
      type: 'love',
      community,
      target: coachPost._id,
      rootTarget: coachPost._id,
      createdBy: user,
    });

    momentReaction = new Reaction({
      type: 'love',
      community,
      target: moment._id,
      rootTarget: moment._id,
      createdBy: user,
    });

    proxyMomentReaction = new Reaction({
      type: 'love',
      community,
      target: proxyPost._id,
      rootTarget: proxyPost._id,
      createdBy: user,
    });

    challengeReaction = new Reaction({
      type: 'love',
      community,
      target: challenge._id,
      rootTarget: challenge._id,
      createdBy: user,
    });

    sprintResultReaction = new Reaction({
      type: 'love',
      community,
      target: sprintResult._id,
      rootTarget: sprintResult._id,
      createdBy: user,
    });

    commentReaction = new Reaction({
      type: 'love',
      community,
      target: momentComment._id,
      rootTarget: moment._id,
      createdBy: user,
    });

    commentComment = new Comment({
      level: 1,
      community,
      content: 'This is a test comment for comment',
      target: momentComment._id,
      rootTarget: moment._id,
      createdBy: user,
      images: [userImage],
    });

    commentCommentReaction = new Reaction({
      type: 'compassion',
      community,
      target: commentComment._id,
      rootTarget: moment._id,
      createdBy: user,
    });

    await group.save();
    await userImage.save();
    await community.save();
    await challenge.save();
    await challengeParticipation.save();
    await challengeComment.save();
    await challengeReaction.save();
    await moment.save();
    await momentComment.save();
    await momentReaction.save();
    await proxyPost.save();
    await proxyMoment.save();
    await proxyMomentComment.save();
    await proxyMomentReaction.save();
    await sprintResult.save();
    await sprintResultComment.save();
    await sprintResultReaction.save();
    await coachPost.save();
    await coachPostComment.save();
    await coachPostReaction.save();
    await commentReaction.save();
    await commentComment.save();
    await commentCommentReaction.save();
  });

  describe('when post is ProxyPost', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(proxyPost._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: proxyPost._id.toHexString(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        postType: 'moment',
        isReference: true,
        createdBy: {
          _id: user._id.toHexString(),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        images: [
          {
            _id: userImage._id.toHexString(),
            originalImageUrl: 'testOriginalImage.jpg',
            resizedImageUrl: 'testResizedImage.jpg',
            thumbnailImageUrl: 'testThumbnailImage.jpg',
            aspectRatio: 1,
          },
        ],
        content: 'This is a test proxy moment',
        strengths: ['love'],
        comments: [
          {
            _id: proxyMomentComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for proxy moment',
            images: [
              {
                _id: userImage._id.toHexString(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [],
            comments: [],
          },
        ],
        reactions: [
          {
            _id: proxyMomentReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe('when post is CoachPost', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(coachPost._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: coachPost._id.toHexString(),
        postType: 'coach-post',
        translations: {
          fi: 'Testi valmentaja viesti',
          en: 'Test coach post',
          sv: 'Test coach post',
        },
        images: [
          {
            _id: userImage._id.toHexString(),
            originalImageUrl: 'testOriginalImage.jpg',
            resizedImageUrl: 'testResizedImage.jpg',
            thumbnailImageUrl: 'testThumbnailImage.jpg',
            aspectRatio: 1,
          },
        ],
        strengths: ['love'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            _id: coachPostComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for coach post',
            images: [
              {
                _id: userImage._id.toHexString(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [],
            comments: [],
          },
        ],
        reactions: [
          {
            _id: coachPostReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe('when post is Moment', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(moment._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: moment._id.toHexString(),
        postType: 'moment',
        createdBy: {
          _id: user._id.toHexString(),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        images: [
          {
            _id: userImage._id.toHexString(),
            originalImageUrl: 'testOriginalImage.jpg',
            resizedImageUrl: 'testResizedImage.jpg',
            thumbnailImageUrl: 'testThumbnailImage.jpg',
            aspectRatio: 1,
          },
        ],
        content: 'This is a test moment',
        strengths: ['love'],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            _id: momentComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for moment',
            images: [
              {
                _id: userImage._id.toHexString(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [
              {
                _id: commentReaction._id.toHexString(),
                createdBy: {
                  _id: user._id.toHexString(),
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: 'testProfileImage.jpg',
                },
                type: 'love',
                createdAt: expect.any(String),
              },
            ],
            comments: [
              {
                _id: commentComment._id.toHexString(),
                createdBy: {
                  _id: user._id.toHexString(),
                  firstName: 'Test',
                  lastName: 'User',
                  avatar: 'testProfileImage.jpg',
                },
                content: 'This is a test comment for comment',
                images: [
                  {
                    _id: userImage._id.toHexString(),
                    originalImageUrl: 'testOriginalImage.jpg',
                    resizedImageUrl: 'testResizedImage.jpg',
                    thumbnailImageUrl: 'testThumbnailImage.jpg',
                    aspectRatio: 1,
                  },
                ],
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                reactions: [
                  {
                    _id: commentCommentReaction._id.toHexString(),
                    createdBy: {
                      _id: user._id.toHexString(),
                      firstName: 'Test',
                      lastName: 'User',
                      avatar: 'testProfileImage.jpg',
                    },
                    type: 'compassion',
                    createdAt: expect.any(String),
                  },
                ],
                comments: [],
              },
            ],
          },
        ],
        reactions: [
          {
            _id: momentReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe('when post is Challenge', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(challenge._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: challenge._id.toHexString(),
        postType: 'challenge',
        translations: {
          fi: 'Testi haaste',
          en: 'Test challenge',
          sv: 'Test utmaning',
        },
        theme: 'default',
        strength: 'love',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            _id: challengeComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for challenge',
            images: [
              {
                _id: userImage._id.toHexString(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [],
            comments: [],
          },
        ],
        reactions: [
          {
            _id: challengeReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        participations: [
          {
            _id: user._id.toHexString(),
            firstName: 'Test',
            lastName: 'User',
            avatar: 'testProfileImage.jpg',
          },
        ],
      });
    });
  });

  describe('when post is SprintResult', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(sprintResult._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        _id: sprintResult._id.toHexString(),
        postType: 'sprint-result',
        createdBy: {
          _id: user._id.toHexString(),
          firstName: 'Test',
          lastName: 'User',
          avatar: 'testProfileImage.jpg',
        },
        strengths: [{strength: 'love', count: 1}],
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            _id: sprintResultComment._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            content: 'This is a test comment for sprint result',
            images: [
              {
                _id: userImage._id.toHexString(),
                originalImageUrl: 'testOriginalImage.jpg',
                resizedImageUrl: 'testResizedImage.jpg',
                thumbnailImageUrl: 'testThumbnailImage.jpg',
                aspectRatio: 1,
              },
            ],
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            reactions: [],
            comments: [],
          },
        ],
        reactions: [
          {
            _id: sprintResultReaction._id.toHexString(),
            createdBy: {
              _id: user._id.toHexString(),
              firstName: 'Test',
              lastName: 'User',
              avatar: 'testProfileImage.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });
});
