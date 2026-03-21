import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import {type DocumentType} from '@typegoose/typegoose';
import mongoose from 'mongoose';
import {
  Moment,
  Challenge,
  ProxyPost,
  CoachPost,
  Community,
  UserImage,
  Reaction,
  Comment,
  ChallengeParticipation,
  SprintResult,
  LessonCompleted,
  GoalCompleted,
  Group,
} from '../../../models/index.js';
import {type Moment as MomentDocument} from '../../../models/Post/Moment.js';
import {type Challenge as ChallengeDocument} from '../../../models/Post/Challenge.js';
import {type ProxyPost as ProxyPostDocument} from '../../../models/Post/ProxyPost.js';
import {type CoachPost as CoachPostDocument} from '../../../models/Post/CoachPost.js';
import {type User as UserDocument} from '../../../models/User.js';
import {type Community as CommunityDocument} from '../../../models/Community.js';
import {type UserImage as UserImageDocument} from '../../../models/UserImage.js';
import {type Reaction as ReactionDocument} from '../../../models/Reaction.js';
import {type Comment as CommentDocument} from '../../../models/Comment.js';
import {type ChallengeParticipation as ChallengeParticipationDocument} from '../../../models/ChallengeParticipation.js';
import {type SprintResult as SprintResultDocument} from '../../../models/Post/SprintResult.js';
import {type LessonCompleted as LessonCompletedModel} from '../../../models/Post/LessonCompleted.js';
import {type GoalCompleted as GoalCompletedModel} from '../../../models/Post/GoalCompleted.js';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {registerTestUser} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import routes from '../index.js';

const getPost = applySchemas(routes['/posts/:id'].get);

const createMocks = (id: mongoose.Types.ObjectId) => {
  return createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });
};

describe('getPost', () => {
  let user: DocumentType<UserDocument>;
  let community: DocumentType<CommunityDocument>;
  let userImage: DocumentType<UserImageDocument>;
  let moment: DocumentType<MomentDocument>;
  let proxyMoment: DocumentType<MomentDocument>;
  let proxyPost: DocumentType<ProxyPostDocument>;
  let coachPost: DocumentType<CoachPostDocument>;
  let challenge: DocumentType<ChallengeDocument>;
  let challengeParticipation: DocumentType<ChallengeParticipationDocument>;
  let sprintResult: DocumentType<SprintResultDocument>;
  let lessonCompleted: DocumentType<LessonCompletedModel>;
  let goalCompleted: DocumentType<GoalCompletedModel>;
  let challengeComment: DocumentType<CommentDocument>;
  let momentComment: DocumentType<CommentDocument>;
  let proxyMomentComment: DocumentType<CommentDocument>;
  let sprintResultComment: DocumentType<CommentDocument>;
  let lessonCompletedComment: DocumentType<CommentDocument>;
  let goalCompletedComment: DocumentType<CommentDocument>;
  let coachPostComment: DocumentType<CommentDocument>;
  let coachPostReaction: DocumentType<ReactionDocument>;
  let momentReaction: DocumentType<ReactionDocument>;
  let proxyMomentReaction: DocumentType<ReactionDocument>;
  let challengeReaction: DocumentType<ReactionDocument>;
  let sprintResultReaction: DocumentType<ReactionDocument>;
  let lessonCompletedReaction: DocumentType<ReactionDocument>;
  let goalCompletedReaction: DocumentType<ReactionDocument>;
  let commentReaction: DocumentType<ReactionDocument>;
  let commentComment: DocumentType<CommentDocument>;
  let commentCommentReaction: DocumentType<ReactionDocument>;

  beforeEach(async () => {
    await Promise.all(
      Object.values(mongoose.connection.collections).map(async (collection) => {
        await collection.deleteMany({});
      }),
    );

    user = await registerTestUser({});

    community = new Community({
      name: 'Test community',
      description: 'This is a test community',
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
      users: [user._id],
    });

    proxyMoment = new Moment({
      content: 'This is a test proxy moment',
      images: [userImage],
      strengths: ['love'],
      createdBy: user,
      community: new mongoose.Types.ObjectId(),
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
      users: [user._id],
    });

    challengeParticipation = new ChallengeParticipation({
      user,
      challenge,
    });

    sprintResult = new SprintResult({
      createdBy: user,
      community,
      groupName: 'Test Group',
      strengths: [
        {
          strength: 'love',
          count: 1,
        },
      ],
    });

    const group = await Group.create({
      name: 'Test Group',
      description: 'Test group for getPost tests',
      community: community._id,
      owner: user._id,
      ageGroup: 'preschool',
      language: 'en',
      createdBy: user._id,
    });

    lessonCompleted = new LessonCompleted({
      createdBy: user,
      community,
      group: group._id,
      strength: 'love',
      chapter: 'act',
      ageGroup: 'preschool',
    });

    goalCompleted = new GoalCompleted({
      createdBy: user,
      community,
      group: group._id,
      strength: 'love',
      completedCount: 5,
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

    lessonCompletedComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for lesson completed',
      target: lessonCompleted._id,
      rootTarget: lessonCompleted._id,
      createdBy: user,
      images: [userImage],
    });

    goalCompletedComment = new Comment({
      level: 0,
      community,
      content: 'This is a test comment for goal completed',
      target: goalCompleted._id,
      rootTarget: goalCompleted._id,
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

    lessonCompletedReaction = new Reaction({
      type: 'love',
      community,
      target: lessonCompleted._id,
      rootTarget: lessonCompleted._id,
      createdBy: user,
    });

    goalCompletedReaction = new Reaction({
      type: 'love',
      community,
      target: goalCompleted._id,
      rootTarget: goalCompleted._id,
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
    await lessonCompleted.save();
    await lessonCompletedComment.save();
    await lessonCompletedReaction.save();
    await goalCompleted.save();
    await goalCompletedComment.save();
    await goalCompletedReaction.save();
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
        id: proxyPost._id.toJSON(),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        postType: 'moment',
        isReference: true,
        createdBy: {
          id: user._id.toJSON(),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        images: [
          {
            id: userImage._id.toJSON(),
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
            id: proxyMomentComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for proxy moment',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: proxyMomentReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
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
        id: coachPost._id.toJSON(),
        postType: 'coach-post',
        translations: {
          fi: 'Testi valmentaja viesti',
          en: 'Test coach post',
          sv: 'Test coach post',
        },
        images: [
          {
            id: userImage._id.toJSON(),
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
            id: coachPostComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for coach post',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: coachPostReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
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
        id: moment._id.toJSON(),
        postType: 'moment',
        createdBy: {
          id: user._id.toJSON(),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        images: [
          {
            id: userImage._id.toJSON(),
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
            id: momentComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for moment',
            images: [
              {
                id: userImage._id.toJSON(),
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
                id: commentReaction._id.toJSON(),
                createdBy: {
                  id: user._id.toJSON(),
                  firstName: 'TestFirstName',
                  lastName: 'TestLastName',
                  avatar: 'test-avatar.jpg',
                },
                type: 'love',
                createdAt: expect.any(String),
              },
            ],
            comments: [
              {
                id: commentComment._id.toJSON(),
                createdBy: {
                  id: user._id.toJSON(),
                  firstName: 'TestFirstName',
                  lastName: 'TestLastName',
                  avatar: 'test-avatar.jpg',
                },
                content: 'This is a test comment for comment',
                images: [
                  {
                    id: userImage._id.toJSON(),
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
                    id: commentCommentReaction._id.toJSON(),
                    createdBy: {
                      id: user._id.toJSON(),
                      firstName: 'TestFirstName',
                      lastName: 'TestLastName',
                      avatar: 'test-avatar.jpg',
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
            id: momentReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
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
        id: challenge._id.toJSON(),
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
            id: challengeComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for challenge',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: challengeReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
        participations: [
          {
            id: user._id.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
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
        id: sprintResult._id.toJSON(),
        postType: 'sprint-result',
        createdBy: {
          id: user._id.toJSON(),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        strengths: [{strength: 'love', count: 1}],
        groupName: 'Test Group',
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            id: sprintResultComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for sprint result',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: sprintResultReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe('when post is LessonCompleted', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(lessonCompleted._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: lessonCompleted._id.toJSON(),
        postType: 'lesson-completed',
        createdBy: {
          id: user._id.toJSON(),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        chapter: 'act',
        ageGroup: 'preschool',
        strength: 'love',
        group: {
          id: expect.any(String),
          name: 'Test Group',
          language: 'en',
          description: 'Test group for getPost tests',
          ageGroup: 'preschool',
          articleProgress: [],
          owner: {
            id: user._id.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
        },
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            id: lessonCompletedComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for lesson completed',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: lessonCompletedReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });

  describe('when post is GoalCompleted', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(goalCompleted._id);

      await getPost(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends a response with the post', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual({
        id: goalCompleted._id.toJSON(),
        postType: 'goal-completed',
        createdBy: {
          id: user._id.toJSON(),
          firstName: 'TestFirstName',
          lastName: 'TestLastName',
          avatar: 'test-avatar.jpg',
        },
        strength: 'love',
        group: {
          id: expect.any(String),
          name: 'Test Group',
          language: 'en',
          description: 'Test group for getPost tests',
          ageGroup: 'preschool',
          articleProgress: [],
          owner: {
            id: user._id.toJSON(),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
        },
        completedCount: 5,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        comments: [
          {
            id: goalCompletedComment._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            content: 'This is a test comment for goal completed',
            images: [
              {
                id: userImage._id.toJSON(),
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
            id: goalCompletedReaction._id.toJSON(),
            createdBy: {
              id: user._id.toJSON(),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
            type: 'love',
            createdAt: expect.any(String),
          },
        ],
      });
    });
  });
});
