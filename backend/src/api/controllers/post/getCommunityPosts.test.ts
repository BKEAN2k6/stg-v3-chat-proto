import {beforeEach, describe, expect, it} from 'vitest';
import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {applySchemas} from '../../../test-utils/applySchemas.js';
import {
  registerTestUser,
  createTestGroup,
} from '../../../test-utils/testDocuments.js';
import {
  createMocksAsync,
  type Mocks,
} from '../../../test-utils/nodeMockHttpAsync.js';
import {
  Community,
  Moment,
  Challenge,
  ProxyPost,
  ChallengeParticipation,
  Comment,
  SprintResult,
  LessonCompleted,
  GoalCompleted,
  StrengthCompleted,
  Reaction,
  UserImage,
  CoachPost,
} from '../../../models/index.js';
import routes from '../index.js';

const getCommunityPosts = applySchemas(routes['/communities/:id/posts'].get);

const createMocks = (id: mongoose.Types.ObjectId) =>
  createMocksAsync({
    params: {
      id: id.toJSON(),
    },
  });

describe('getCommunityPosts', () => {
  describe('when community is not found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      mocks = createMocks(new mongoose.Types.ObjectId());

      await getCommunityPosts(mocks.req, mocks.res);
      await mocks.result;
    });

    it('sends an error response', async () => {
      expect(mocks.res.statusCode).toBe(404);
      expect(mocks.res._getJSONData()).toEqual({
        error: 'Community not found',
      });
    });
  });

  describe('when community is found', () => {
    let mocks: Mocks<Request, Response>;

    beforeEach(async () => {
      const user = await registerTestUser({});

      const community = new Community({
        name: 'Test community',
        description: 'This is a test community',
      });

      const userImage = new UserImage({
        createdBy: user,
        thumbnailImageUrl: 'testThumbnailImage.jpg',
        resizedImageUrl: 'testResizedImage.jpg',
        originalImageUrl: 'testOriginalImage.jpg',
        community: community._id,
        aspectRatio: 1,
      });

      const moment = new Moment({
        content: 'This is a test moment',
        images: [userImage],
        strengths: ['love'],
        createdBy: user,
        community,
        users: [user._id],
        createdAt: new Date(Date.now() - 8000),
      });

      const proxyMoment = new Moment({
        content: 'This is a test proxy moment',
        images: [userImage],
        strengths: ['love'],
        createdBy: user,
        community: new mongoose.Types.ObjectId(),
        users: [user._id],
        createdAt: new Date(Date.now() - 7000),
      });

      const proxyPost = new ProxyPost({
        postReference: proxyMoment,
        community,
        createdAt: new Date(Date.now() - 7000),
      });

      const challenge = new Challenge({
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
        createdAt: new Date(Date.now() - 9000),
      });

      const challengeParticipation = new ChallengeParticipation({
        user,
        challenge,
      });

      const group = await createTestGroup(user._id, community._id);

      const sprintResult = new SprintResult({
        createdBy: user,
        community,
        groupName: 'Test Group',
        strengths: [
          {
            strength: 'love',
            count: 1,
          },
        ],
        createdAt: new Date(Date.now() - 6000),
      });

      const lessonCompleted = new LessonCompleted({
        strength: 'love',
        chapter: 'act',
        ageGroup: 'preschool',
        group: group._id,
        createdBy: user,
        community,
        createdAt: new Date(Date.now() - 5000),
      });

      const goalCompleted = new GoalCompleted({
        strength: 'love',
        createdBy: user,
        group: group._id,
        completedCount: 5,
        community,
        createdAt: new Date(Date.now() - 4000),
      });

      const strengthCompleted = new StrengthCompleted({
        strength: 'courage',
        createdBy: user,
        group: group._id,
        community,
        createdAt: new Date(Date.now() - 3500),
      });

      const challengeComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for challenge',
        target: challenge._id,
        rootTarget: challenge._id,
        createdBy: user,
        images: [userImage],
      });

      const momentComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for moment',
        target: moment._id,
        rootTarget: moment._id,
        createdBy: user,
        images: [userImage],
      });

      const proxyMomentComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for proxy moment',
        target: proxyPost._id,
        rootTarget: proxyPost._id,
        createdBy: user,
        images: [userImage],
      });

      const sprintResultComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for sprint result',
        target: sprintResult._id,
        rootTarget: sprintResult._id,
        createdBy: user,
        images: [userImage],
      });

      const lessonCompletedComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for lesson completed',
        target: lessonCompleted._id,
        rootTarget: lessonCompleted._id,
        createdBy: user,
        images: [userImage],
      });

      const goalCompletedComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for goal completed',
        target: goalCompleted._id,
        rootTarget: goalCompleted._id,
        createdBy: user,
        images: [userImage],
      });

      const strengthCompletedComment = new Comment({
        level: 0,
        community,
        content: 'This is a test comment for strength completed',
        target: strengthCompleted._id,
        rootTarget: strengthCompleted._id,
        createdBy: user,
        images: [userImage],
      });

      const momentReaction = new Reaction({
        type: 'love',
        community,
        target: moment._id,
        rootTarget: moment._id,
        createdBy: user,
      });

      const proxyMomentReaction = new Reaction({
        type: 'love',
        community,
        target: proxyPost._id,
        rootTarget: proxyPost._id,
        createdBy: user,
      });

      const challengeReaction = new Reaction({
        type: 'love',
        community,
        target: challenge._id,
        rootTarget: challenge._id,
        createdBy: user,
      });

      const sprintResultReaction = new Reaction({
        type: 'love',
        community,
        target: sprintResult._id,
        rootTarget: sprintResult._id,
        createdBy: user,
      });

      const lessonCompletedReaction = new Reaction({
        type: 'love',
        community,
        target: lessonCompleted._id,
        rootTarget: lessonCompleted._id,
        createdBy: user,
      });

      const goalCompletedReaction = new Reaction({
        type: 'love',
        community,
        target: goalCompleted._id,
        rootTarget: goalCompleted._id,
        createdBy: user,
      });

      const strengthCompletedReaction = new Reaction({
        type: 'courage',
        community,
        target: strengthCompleted._id,
        rootTarget: strengthCompleted._id,
        createdBy: user,
      });

      const commentReaction = new Reaction({
        type: 'love',
        community,
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: user,
      });

      const commentComment = new Comment({
        level: 1,
        community,
        content: 'This is a test comment for comment',
        target: momentComment._id,
        rootTarget: moment._id,
        createdBy: user,
        images: [userImage],
      });

      const commentCommentReaction = new Reaction({
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
      await lessonCompleted.save();
      await goalCompleted.save();
      await strengthCompleted.save();
      await sprintResultComment.save();
      await sprintResultReaction.save();
      await lessonCompletedComment.save();
      await lessonCompletedReaction.save();
      await goalCompletedComment.save();
      await goalCompletedReaction.save();
      await strengthCompletedComment.save();
      await strengthCompletedReaction.save();
      await commentReaction.save();
      await commentComment.save();
      await commentCommentReaction.save();

      const coachPost = await CoachPost.findOne({community: community._id});
      expect(coachPost).toBeDefined();
      if (coachPost) {
        await mongoose.connection
          .db!.collection('posts')
          .updateOne(
            {_id: coachPost._id},
            {$set: {createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000)}},
          );
      }

      mocks = createMocks(community._id);

      await getCommunityPosts(mocks.req, mocks.res);
      await mocks.result;
    });

    it('responds with the community posts', async () => {
      expect(mocks.res.statusCode).toBe(200);
      expect(mocks.res._getJSONData()).toEqual([
        {
          id: expect.any(String),
          postType: 'strength-completed',
          strength: 'courage',
          group: {
            id: expect.any(String),
            name: expect.any(String),
            language: expect.any(String),
            description: expect.any(String),
            ageGroup: expect.any(String),
            articleProgress: expect.any(Array),
            owner: {
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
          },
          createdBy: {
            id: expect.any(String),
            avatar: 'test-avatar.jpg',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for strength completed',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'courage',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
          postType: 'goal-completed',
          strength: 'love',
          group: {
            id: expect.any(String),
            name: expect.any(String),
            language: expect.any(String),
            description: expect.any(String),
            ageGroup: expect.any(String),
            articleProgress: expect.any(Array),
            owner: {
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
          },
          completedCount: 5,
          createdBy: {
            id: expect.any(String),
            avatar: 'test-avatar.jpg',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for goal completed',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
          postType: 'lesson-completed',
          strength: 'love',
          ageGroup: 'preschool',
          chapter: 'act',
          group: {
            id: expect.any(String),
            name: expect.any(String),
            language: expect.any(String),
            description: expect.any(String),
            ageGroup: expect.any(String),
            articleProgress: expect.any(Array),
            owner: {
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
          },
          createdBy: {
            id: expect.any(String),
            avatar: 'test-avatar.jpg',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for lesson completed',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
          postType: 'sprint-result',
          strengths: [{strength: 'love', count: 1}],
          groupName: 'Test Group',
          createdBy: {
            id: expect.any(String),
            avatar: 'test-avatar.jpg',
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
          },
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [
            {
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for sprint result',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          postType: 'moment',
          isReference: true,
          createdBy: {
            id: expect.any(String),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
          images: [
            {
              id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for proxy moment',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
          postType: 'moment',
          createdBy: {
            id: expect.any(String),
            firstName: 'TestFirstName',
            lastName: 'TestLastName',
            avatar: 'test-avatar.jpg',
          },
          images: [
            {
              id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for moment',
              images: [
                {
                  id: expect.any(String),
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
                  id: expect.any(String),
                  createdBy: {
                    id: expect.any(String),
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
                  id: expect.any(String),
                  createdBy: {
                    id: expect.any(String),
                    firstName: 'TestFirstName',
                    lastName: 'TestLastName',
                    avatar: 'test-avatar.jpg',
                  },
                  content: 'This is a test comment for comment',
                  images: [
                    {
                      id: expect.any(String),
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
                      id: expect.any(String),
                      createdBy: {
                        id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              type: 'love',
              createdAt: expect.any(String),
            },
          ],
        },
        {
          id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
                firstName: 'TestFirstName',
                lastName: 'TestLastName',
                avatar: 'test-avatar.jpg',
              },
              content: 'This is a test comment for challenge',
              images: [
                {
                  id: expect.any(String),
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
              id: expect.any(String),
              createdBy: {
                id: expect.any(String),
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
              id: expect.any(String),
              firstName: 'TestFirstName',
              lastName: 'TestLastName',
              avatar: 'test-avatar.jpg',
            },
          ],
        },
        {
          id: expect.any(String),
          postType: 'coach-post',
          translations: {
            fi:
              '![Tervetuloa matkalle vahvuudesta vahvuuteen!](https://new.seethegood.app/images/welcome/fi-welcometo.jpg)\n' +
              '**Tervetuloa matkalle vahvuudesta vahvuuteen!**\n' +
              '\n' +
              'Tutkimukseen perustuva Huomaa hyvä! -digipalvelu tarjoaa helppokäyttöisen ratkaisun tunne- ja vuorovaikutustaitojen opettamiseen!\n' +
              '\n' +
              'Huomaa hyvä! tuo kaikkien vahvuudet esille. Kun huomaamme hyvää toisissamme,  puhumme siitä ja opetamme tunne- ja vuorovaikutustaitoja, näemme tulokset luokkahuoneessa ja arjessa. Hyvinvoivat lapset ja nuoret, joilla on vahvat kognitiiviset- ja sosioemotionaaliset taidot oppivat parhaiten ja kasvavat hyvinvoiviksi ja onnellisiksi aikuisiksi. Matka vahvuudesta vahvuuteen antaa tukevat eväät ihmisenä olemiseen ja kasvamiseen. Tämä ei ole vain oikea tapa elää vaan myös oikea tapa oppia!\n' +
              '\n' +
              'Ota heti tällä viikolla käyttöösi Huomaa hyvä! -palvelu ja kokeile innostavia oppimateriaaleja, esimerkiksi:\n' +
              '* [Vahvuusvariksen oppituokiot](/article-categories/6673e91beb3b6fe4f7358876)  - tutkitusti toimivaa materiaalia tunne- ja vuorovaikutustaitoihin\n' +
              '* [Vahvuusvariksen tanssit](/article-categories/66d014e06a2375334d8ceb8a) - oppilaat rakastavat näitä\n' +
              '* [Vahvuustuokio](/games/sprint) - jokainen tarvitsee positiivista palautetta\n' +
              '\n' +
              'Happy kids learn best!\n' +
              'Kaisa Koutsi\n',
            en:
              '![Welcome on a journey from strength to strength!](https://new.seethegood.app/images/welcome/en-welcometo.jpg)\n' +
              '**Welcome on a journey from strength to strength!**\n' +
              '\n' +
              'See the Good! is a science-based solution to teach about social and emotional skills!\n' +
              '\n' +
              'Our guiding principle is simple: when you see the good in people, speak about it and teach socio-emotional skills, you see the results in the classroom and beyond. Happy children with strong cognitive, social and emotional skills become happier adults later in life. Going from strength to strength to take on any future challenge that lies ahead. It’s not just the right thing to do. It’s the right way to learn. \n' +
              '\n' +
              'This week, we recommend trying some of our See the Good! resources, such as:\n' +
              "* [Strength Crow's lessons](/article-categories/6673e91beb3b6fe4f7358876) - focusing on socio-emotional skills\n" +
              "* [Strength Crow's dances](/article-categories/66d014e06a2375334d8ceb8a) - the students love them!\n" +
              '* [Strength Sprint](/games/sprint) - positive feedback for everyone\n' +
              '\n' +
              'Happy kids learn best!\n' +
              'Kaisa Coach',
            sv:
              '![Välkommen på resan från styrka till styrka!](https://new.seethegood.app/images/welcome/sv-welcometo.jpg)\n' +
              '**Välkommen på resan från styrka till styrka!**\n' +
              '\n' +
              'Den evidensbaserade lösningen för att undervisa om sociala och emotionella färdigheter!\n' +
              'See the Good! lyfter fram allas styrkor. När vi ser det goda i varandra, pratar om det och lär ut socioemotionella färdigheter, ser vi resultaten både i klassrummet och i vardagen.\n' +
              '\n' +
              'Välmående barn och unga med starka kognitiva och socioemotionella färdigheter lär sig bäst och utvecklas till välmående och lyckliga vuxna. Resan från styrka till styrka ger en stabil grund för att växa och utvecklas som människa. Det här är inte bara det rätta sättet att leva – det är också det rätta sättet att lära!\n' +
              '\n' +
              'Passa på att upptäcka den nya tjänsten och prova See the Good!-materialet med din grupp redan denna vecka. Här är några populära exempel:\n' +
              '* [Styrkekråkans lektioner](/article-categories/6673e91beb3b6fe4f7358876) - evidensbaserat material för att träna på socioemotionella färdigheter\n' +
              '* [Styrkekråkans danser](/article-categories/66d014e06a2375334d8ceb8a) - en riktig favorit bland eleverna! (linkki puuttuu)\n' +
              '* [Styrkesprinten](/games/sprint) - ett utmärkt sätt att sprida positiv feedback till alla i gruppen.\n' +
              '\n' +
              'Happy kids learn best! \n' +
              'Kaisa Coach\n',
          },
          images: [],
          strengths: [],
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          comments: [],
          reactions: [],
        },
      ]);
    });
  });
});
