import mongoose from 'mongoose';
import {
  User,
  Community,
  Group,
  Moment,
  Challenge,
  SprintResult,
  ProxyPost,
  CoachPost,
  ChallengeData,
  Article,
  ArticleCategory,
  StrenghtPeriod,
} from './models';
import type {Logger} from './types/logger';

const seed = async (logger: Logger) => {
  const adminUser = await User.register(
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      roles: ['super-admin'],
      language: 'en',
    },
    'testadmin123',
  );

  const users = [];

  for (let i = 0; i < 10; i++) {
    // eslint-disable-next-line no-await-in-loop
    const newUser = await User.register(
      {
        firstName: 'User',
        lastName: i.toString(),
        email: `${i}user@user.com`,
        language: 'en',
      },
      'testuser123',
    );

    users.push(newUser);
  }

  const community = await Community.create({
    name: 'Admin Community',
    description: 'Admin Community Description',
    groups: [],
  });

  const userCommunity = await Community.create({
    name: 'User Community',
    description: 'User Community Description',
    groups: [],
  });

  await SprintResult.create({
    createdBy: adminUser,
    community,
    strengths: [
      {
        strength: 'love',
        count: 1,
      },
      {
        strength: 'compassion',
        count: 2,
      },
    ],
  });

  const coachPost = await CoachPost.create({
    translations: {
      en: 'Test CoachPost',
      fi: 'Testi CoachPost',
      sv: 'Test CoachPost',
    },
    strength: 'love',
    community: null,
    showDate: new Date(),
  });

  const challenge = await Challenge.create({
    translations: {
      en: 'Test challenge',
      fi: 'Testi haaste',
      sv: 'Test utmaning',
    },
    theme: 'default',
    strength: 'love',
    community: null,
    showDate: new Date(),
  });

  await Moment.create({
    content: 'This is a test moment',
    strengths: ['love'],
    createdBy: adminUser,
    community,
  });

  await ProxyPost.create({
    postReference: coachPost,
    community: userCommunity,
  });

  await ProxyPost.create({
    postReference: coachPost,
    community,
  });

  await ProxyPost.create({
    postReference: challenge,
    community: userCommunity,
  });

  await ProxyPost.create({
    postReference: challenge,
    community,
  });

  await SprintResult.create({
    createdBy: adminUser,
    community,
    strengths: [
      {
        strength: 'compassion',
        count: 2,
      },
    ],
  });

  await SprintResult.create({
    createdBy: adminUser,
    community,
    strengths: [
      {
        strength: 'love',
        count: 1,
      },
      {
        strength: 'compassion',
        count: 2,
      },
      {
        strength: 'courage',
        count: 3,
      },
      {
        strength: 'perseverance',
        count: 4,
      },
      {
        strength: 'loveOfBeauty',
        count: 5,
      },
    ],
  });

  await community.upsertMemberAndSave(adminUser._id, 'admin');

  for (const memberUser of users) {
    // eslint-disable-next-line no-await-in-loop
    await userCommunity.upsertMemberAndSave(memberUser._id, 'member');
  }

  const group = await Group.create({
    _id: new mongoose.Types.ObjectId(),
    name: 'Admin Group',
    description: 'Admin Group Description',
    community: community._id,
  });

  community.groups.push(group._id);
  await community.save();

  adminUser.selectedCommunity = community;

  await adminUser.save();

  for (const memberUser of users) {
    memberUser.selectedCommunity = userCommunity;

    // eslint-disable-next-line no-await-in-loop
    await memberUser.save();
  }

  logger.log(JSON.stringify(adminUser, null, 2));

  await ChallengeData.create({
    translations: {
      fi: 'Stop!\nAnna oppilaille tänään palautetta ystävällisyydestä.\n\n"Huomasin, miten ystävällisesti toimit!"\ntai\n“Ystävällisyytesi ilahduttaa!"',
      sv: 'Stopp!\nGe dina elever feedback på deras vänlighet i dag.\n\n"Jag har märkt hur vänligt du är!"\neller\n"Din vänlighet gör mig glad!"',
      en: 'Stop!\nGive your students feedback on kindness today.\n\n"I noticed how kind you are!"\nor\n"Your kindness makes me happy!"',
    },
    theme: 'default',
    strength: 'love',
    showDate: new Date(),
  });

  const materialDatabase = new ArticleCategory({
    _id: new mongoose.Types.ObjectId('6673e91beb3b6fe4f7358876'), // Same as in production
    translations: [
      {
        language: 'en',
        name: 'Material database',
        description: 'Material database category description',
      },
      {
        language: 'fi',
        name: 'Materiaalitietokanta',
        description: 'Materiaalitietokanta kuvaus',
      },
      {
        language: 'sv',
        name: 'Materialdatabas',
        description: 'Materialdatabas beskrivning',
      },
    ],
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 0,
    isHidden: false,
    isLocked: false,
  });
  materialDatabase.rootCategory = materialDatabase._id;
  await materialDatabase.save();

  const pedagogy = new ArticleCategory({
    _id: new mongoose.Types.ObjectId('66ac78e02ed90a795b22240e'), // Same as in production
    translations: [
      {
        language: 'en',
        name: 'Pedagogy',
        description: 'Pedagogy description',
      },
      {
        language: 'fi',
        name: 'Pedagogiikka',
        description: 'Pedagogiikka kuvaus',
      },
      {
        language: 'sv',
        name: 'Pedagogik',
        description: 'Pedagogik beskrivning',
      },
    ],
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 0,
    isHidden: false,
    isLocked: false,
  });
  pedagogy.rootCategory = pedagogy._id;
  await pedagogy.save();

  const videosCategory = new ArticleCategory({
    _id: new mongoose.Types.ObjectId('66d014e06a2375334d8ceb8a'), // Same as in production
    translations: [
      {
        language: 'en',
        name: 'Videos',
        description: 'Videos description',
      },
      {
        language: 'fi',
        name: 'Videot',
        description: 'Videot kuvaus',
      },
      {
        language: 'sv',
        name: ' Videor',
        description: 'Videor beskrivning',
      },
    ],
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 0,
    isHidden: false,
    isLocked: false,
  });
  videosCategory.rootCategory = videosCategory._id;
  await videosCategory.save();

  const exerciseCategory = new ArticleCategory({
    _id: new mongoose.Types.ObjectId('66d015116a2375334d8cebb0'), // Same as in production
    parentCategory: new mongoose.Types.ObjectId('66d014e06a2375334d8ceb8a'),
    thumbnail: 'article-thubmnail-5d4349a2.jpg',
    displayAs: 'grid',
    translations: [
      {language: 'fi', name: 'Harjoitus', description: ' '},
      {language: 'en', name: 'Exercise', description: ' '},
      {language: 'sv', name: 'Övning', description: ' '},
    ],
    isHidden: false,
    isLocked: false,
    rootCategory: new mongoose.Types.ObjectId('66d014e06a2375334d8ceb8a'),
    order: 0,
  });
  await exerciseCategory.save();

  const exerciseVideo = new Article({
    _id: new mongoose.Types.ObjectId('66d02d296a2375334d8d0116'),
    translations: [
      {
        language: 'fi',
        description: ' ',
        title: 'Ystävällisyys-jumppa',
        content: ['---\nlayout: full\n---\nhttps://vimeo.com/606558069'],
      },
    ],
    tags: [],
    thumbnail: 'article-thubmnail-148c5196.jpg',
    length: '3 min',
    strengths: ['kindness'],
    category: new mongoose.Types.ObjectId('66d015116a2375334d8cebb0'),
    rootCategory: new mongoose.Types.ObjectId('66d014e06a2375334d8ceb8a'),
    updatedBy: adminUser,
    order: 0,
    isHidden: false,
    isLocked: false,
  });
  await exerciseVideo.save();

  const crashCourse = await ArticleCategory.create({
    translations: [
      {
        language: 'en',
        name: 'Crash Course',
        description: 'Crash Course description',
      },
      {
        language: 'fi',
        name: 'Pikakurssi',
        description: 'Pikakurssi kuvaus',
      },
      {
        language: 'sv',
        name: 'Snabbkurs',
        description: 'Snabbkurs beskrivning',
      },
    ],
    parentCategory: pedagogy,
    rootCategory: pedagogy,
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 1,
    isHidden: false,
    isLocked: false,
  });

  await ArticleCategory.create({
    translations: [
      {
        language: 'en',
        name: 'Getting Started',
        description: 'Getting Started description',
      },
      {
        language: 'fi',
        name: 'Aloittelijalle',
        description: 'Aloittelijalle kuvaus',
      },
      {
        language: 'sv',
        name: 'Komma igång',
        description: 'Komma igång beskrivning',
      },
    ],
    parentCategory: pedagogy,
    rootCategory: pedagogy,
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 2,
    isHidden: false,
    isLocked: false,
  });

  const article = await Article.create({
    translations: [
      {
        language: 'en',
        source: true,
        title: 'Crash Course Test Material 1',
        description: 'Crash Course Test Material Description 1',
        content: ['Test material content 1'],
      },
      {
        language: 'fi',
        title: 'Pikakurssi Testimateriaali 1',
        description: 'Pikakurssi Testimateriaali Kuvaus 1',
        content: ['Testimateriaalin sisältö 1'],
      },
    ],
    category: crashCourse,
    rootCategory: pedagogy,
    thumbnail: '/images/cards/v1-learn-material.png',
    length: '5 min',
    strengths: ['love'],
    language: 'en',
    order: 0,
    updatedBy: adminUser,
    isHidden: false,
    isLocked: false,
  });

  await Article.create({
    translations: [
      {
        language: 'en',
        source: true,
        title: 'Crash Course Test Material 2',
        description: 'Crash Course Test Material Description 2',
        content: ['Test material content 2'],
      },
      {
        language: 'sv',
        title: 'Snabbkurs Testmaterial 2',
        description: 'Snabbkurs Testmaterial Beskrivning 2',
        content: ['Testmaterialin innehåll 2'],
      },
    ],
    category: crashCourse,
    rootCategory: pedagogy,
    thumbnail: '/images/cards/v1-learn-material.png',
    length: '5 min',
    strengths: ['love'],
    language: 'en',
    order: 1,
    updatedBy: adminUser,
    isHidden: false,
    isLocked: false,
  });

  const periodStart = new Date();

  await StrenghtPeriod.create({
    timeline: [
      {
        articleId: article,
        // One week before
        start: new Date(periodStart.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        articleId: article,
        start: periodStart,
      },
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
    ],
    strength: 'love',
  });

  await StrenghtPeriod.create({
    timeline: [
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 21 * 24 * 60 * 60 * 1000),
      },
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 28 * 24 * 60 * 60 * 1000),
      },
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 35 * 24 * 60 * 60 * 1000),
      },
      {
        articleId: article,
        start: new Date(periodStart.getTime() + 42 * 24 * 60 * 60 * 1000),
      },
    ],
    strength: 'kindness',
  });
};

export default seed;
