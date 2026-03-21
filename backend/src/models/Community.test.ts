import {beforeEach, describe, expect, it} from 'vitest';
import mongoose from 'mongoose';
import {type DocumentType} from '@typegoose/typegoose';
import {registerTestUser} from '../test-utils/testDocuments.js';
import {type Community as CommunityDocument} from './Community.js';
import {type User as UserDocument} from './User.js';
import {
  Community,
  AclItem,
  CommunityMembership,
  Challenge,
  Post,
  User,
  Group,
} from './index.js';

describe('Community model', () => {
  describe('when a new document is created', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      await Challenge.create({
        translations: {
          en: 'test translation',
          fi: 'testi käännös',
          sv: 'test översättning',
        },
        theme: 'default',
        strength: 'love',
        showDate: new Date(),
      });

      resourceId = community._id;
    });

    it('creates an acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: resourceId.toJSON(),
        roles: [],
        __v: 0,
      });
    });

    it('creates the timed posts for the community', async () => {
      const posts = await Post.find({community: resourceId});
      const jsonPosts = posts.map((p: {toJSON(): unknown}) => p.toJSON());
      expect(jsonPosts).toContainEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        id: expect.any(String),
        community: expect.any(mongoose.Types.ObjectId),
        postType: 'coach-post',
        deleted: false,
        translations: {
          fi: '![Tervetuloa matkalle vahvuudesta vahvuuteen!](https://new.seethegood.app/images/welcome/fi-welcometo.jpg)\n**Tervetuloa matkalle vahvuudesta vahvuuteen!**\n\nTutkimukseen perustuva Huomaa hyvä! -digipalvelu tarjoaa helppokäyttöisen ratkaisun tunne- ja vuorovaikutustaitojen opettamiseen!\n\nHuomaa hyvä! tuo kaikkien vahvuudet esille. Kun huomaamme hyvää toisissamme,  puhumme siitä ja opetamme tunne- ja vuorovaikutustaitoja, näemme tulokset luokkahuoneessa ja arjessa. Hyvinvoivat lapset ja nuoret, joilla on vahvat kognitiiviset- ja sosioemotionaaliset taidot oppivat parhaiten ja kasvavat hyvinvoiviksi ja onnellisiksi aikuisiksi. Matka vahvuudesta vahvuuteen antaa tukevat eväät ihmisenä olemiseen ja kasvamiseen. Tämä ei ole vain oikea tapa elää vaan myös oikea tapa oppia!\n\nOta heti tällä viikolla käyttöösi Huomaa hyvä! -palvelu ja kokeile innostavia oppimateriaaleja, esimerkiksi:\n* [Vahvuusvariksen oppituokiot](/article-categories/6673e91beb3b6fe4f7358876)  - tutkitusti toimivaa materiaalia tunne- ja vuorovaikutustaitoihin\n* [Vahvuusvariksen tanssit](/article-categories/66d014e06a2375334d8ceb8a) - oppilaat rakastavat näitä\n* [Vahvuustuokio](/games/sprint) - jokainen tarvitsee positiivista palautetta\n\nHappy kids learn best!\nKaisa Koutsi\n',
          en: "![Welcome on a journey from strength to strength!](https://new.seethegood.app/images/welcome/en-welcometo.jpg)\n**Welcome on a journey from strength to strength!**\n\nSee the Good! is a science-based solution to teach about social and emotional skills!\n\nOur guiding principle is simple: when you see the good in people, speak about it and teach socio-emotional skills, you see the results in the classroom and beyond. Happy children with strong cognitive, social and emotional skills become happier adults later in life. Going from strength to strength to take on any future challenge that lies ahead. It’s not just the right thing to do. It’s the right way to learn. \n\nThis week, we recommend trying some of our See the Good! resources, such as:\n* [Strength Crow's lessons](/article-categories/6673e91beb3b6fe4f7358876) - focusing on socio-emotional skills\n* [Strength Crow's dances](/article-categories/66d014e06a2375334d8ceb8a) - the students love them!\n* [Strength Sprint](/games/sprint) - positive feedback for everyone\n\nHappy kids learn best!\nKaisa Coach",
          sv: '![Välkommen på resan från styrka till styrka!](https://new.seethegood.app/images/welcome/sv-welcometo.jpg)\n**Välkommen på resan från styrka till styrka!**\n\nDen evidensbaserade lösningen för att undervisa om sociala och emotionella färdigheter!\nSee the Good! lyfter fram allas styrkor. När vi ser det goda i varandra, pratar om det och lär ut socioemotionella färdigheter, ser vi resultaten både i klassrummet och i vardagen.\n\nVälmående barn och unga med starka kognitiva och socioemotionella färdigheter lär sig bäst och utvecklas till välmående och lyckliga vuxna. Resan från styrka till styrka ger en stabil grund för att växa och utvecklas som människa. Det här är inte bara det rätta sättet att leva – det är också det rätta sättet att lära!\n\nPassa på att upptäcka den nya tjänsten och prova See the Good!-materialet med din grupp redan denna vecka. Här är några populära exempel:\n* [Styrkekråkans lektioner](/article-categories/6673e91beb3b6fe4f7358876) - evidensbaserat material för att träna på socioemotionella färdigheter\n* [Styrkekråkans danser](/article-categories/66d014e06a2375334d8ceb8a) - en riktig favorit bland eleverna! (linkki puuttuu)\n* [Styrkesprinten](/games/sprint) - ett utmärkt sätt att sprida positiv feedback till alla i gruppen.\n\nHappy kids learn best! \nKaisa Coach\n',
          _id: expect.any(mongoose.Types.ObjectId),
        },
        showDate: expect.any(Date),
        images: [],
        strengths: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        isProcessing: false,
        __v: 0,
      });

      expect(jsonPosts).toContainEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        id: expect.any(String),
        createdAt: expect.any(Date),
        community: expect.any(mongoose.Types.ObjectId),
        postType: 'proxy-post',
        deleted: false,
        postReference: expect.any(mongoose.Types.ObjectId),
        updatedAt: expect.any(Date),
        __v: 0,
      });
    });
  });

  describe('when a new document is removed with model deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      resourceId = community._id;
      await Community.deleteOne({_id: community._id});
    });

    it('removes the acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('when a new document is removed with document deleteOne', () => {
    let resourceId: mongoose.Types.ObjectId;

    beforeEach(async () => {
      const community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      resourceId = community._id;
      await community.deleteOne();
    });

    it('removes the acl item for the community', async () => {
      const aclItem = await AclItem.findOne({resourceId});
      expect(aclItem).toBeNull();
    });
  });

  describe('upsertMemberAndSave', () => {
    describe('when the user is not a member yet', () => {
      let community: DocumentType<CommunityDocument>;
      let user: DocumentType<UserDocument>;

      beforeEach(async () => {
        await User.deleteMany({});
        community = await Community.create({
          name: 'test community',
          description: 'test description',
        });

        user = await registerTestUser({});
        await community.upsertMemberAndSave(user._id, 'member');
      });

      it('creates a community membership', async () => {
        const membership = await CommunityMembership.findOne({
          community: community._id,
          user: user._id,
        });
        expect(membership?.role).toBe('member');
      });

      it('adds the user to the acl item', async () => {
        const aclItem = await AclItem.findOne({resourceId: community._id});
        expect(aclItem?.toJSON()).toEqual({
          _id: expect.any(mongoose.Types.ObjectId),
          resourceId: community._id.toJSON(),
          roles: [
            {
              _id: expect.any(mongoose.Types.ObjectId),
              user: user._id,
              role: 'community-member',
            },
          ],
          __v: 0,
        });
      });

      it('creates a group for the user', async () => {
        const group = await Group.findOne({
          community: community._id,
          owner: user._id,
        });

        expect(group?.toJSON()).toEqual({
          _id: expect.any(mongoose.Types.ObjectId),
          name: "TestFirstName's group",
          description: "TestFirstName TestLastName's group.",
          community: community._id,
          owner: user._id,
          ageGroup: 'preschool',
          language: user.language,
          createdBy: user._id,
          updatedBy: user._id,
          articleProgress: [],
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          __v: 0,
          id: expect.any(String),
        });
      });
    });

    describe('when the user is a member already', () => {
      let community: DocumentType<CommunityDocument>;
      let user: DocumentType<UserDocument>;

      beforeEach(async () => {
        await User.deleteMany({});
        community = await Community.create({
          name: 'test community',
          description: 'test description',
        });

        user = await registerTestUser({});
        await CommunityMembership.create({
          community: community._id,
          user: user._id,
          role: 'member',
        });
        await community.upsertMemberAndSave(user._id, 'admin');
      });

      it('updates the community membership', async () => {
        const membership = await CommunityMembership.findOne({
          community: community._id,
          user: user._id,
        });
        expect(membership?.role).toBe('admin');
      });

      it('updates the acl item', async () => {
        const aclItem = await AclItem.findOne({resourceId: community._id});
        expect(aclItem?.toJSON()).toEqual({
          _id: expect.any(mongoose.Types.ObjectId),
          resourceId: community._id.toJSON(),
          roles: [
            {
              _id: expect.any(mongoose.Types.ObjectId),
              user: user._id,
              role: 'community-admin',
            },
          ],
          __v: 0,
        });
      });
    });
  });

  describe('removeMemberAndSave', () => {
    let community: DocumentType<CommunityDocument>;
    let user: DocumentType<UserDocument>;

    beforeEach(async () => {
      await User.deleteMany({});
      community = await Community.create({
        name: 'test community',
        description: 'test description',
      });

      user = await registerTestUser({});
      await community.upsertMemberAndSave(user._id, 'member');
      await community.removeMemberAndSave(user._id);
    });

    it('removes the community membership', async () => {
      const membership = await CommunityMembership.findOne({
        community: community._id,
        user,
      });
      expect(membership).toBeNull();
    });

    it('removes the user from the acl item', async () => {
      const aclItem = await AclItem.findOne({resourceId: community._id});
      expect(aclItem?.toJSON()).toEqual({
        _id: expect.any(mongoose.Types.ObjectId),
        resourceId: community._id.toJSON(),
        roles: [],
        __v: 0,
      });
    });
  });
});
