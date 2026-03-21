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
  Article,
  ArticleCategory,
} from './models/index.js';
import type {Logger} from './types/logger.js';

const seed = async (logger: Logger) => {
  const adminUser = await User.register(
    {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@admin.com',
      roles: ['super-admin'],
      language: 'en',

      country: 'US',
      organization: 'Test Organization',
      organizationType: 'Test Organization Type',
      organizationRole: 'Test Organization Role',
      registrationType: 'super-admin-created',
    },
    'testadmin123',
  );

  for (let i = 0; i < 10; i++) {
    logger.log(`Creating user ${i}`);
    // eslint-disable-next-line no-await-in-loop
    const newUser = await User.register(
      {
        firstName: 'User',
        lastName: i.toString(),
        email: `${i}user@user.com`,
        language: 'en',
        country: 'US',
        organization: 'Test Organization',
        organizationType: 'Test Organization Type',
        organizationRole: 'Test Organization Role',
        registrationType: 'super-admin-created',
      },
      'testuser123',
    );

    // eslint-disable-next-line no-await-in-loop
    const userCommunity = await Community.create({
      name: 'User Community',
      description: 'User Community Description',
    });

    // eslint-disable-next-line no-await-in-loop
    await userCommunity.upsertMemberAndSave(newUser._id, 'member');

    newUser.selectedCommunity = userCommunity;

    // eslint-disable-next-line no-await-in-loop
    await newUser.save();
  }

  const community = await Community.create({
    name: 'Admin Community',
    description: 'Admin Community Description',
  });

  await SprintResult.create({
    createdBy: adminUser._id,
    community: community._id,
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
    strengths: ['love'],
    community: undefined,
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
    community: undefined,
    showDate: new Date(),
  });

  await Moment.create({
    content: 'This is a test moment',
    strengths: ['love'],
    createdBy: adminUser._id,
    community: community._id,
  });

  await ProxyPost.create({
    postReference: coachPost._id,
    community: community._id,
  });

  await ProxyPost.create({
    postReference: challenge._id,
    community: community._id,
  });

  await SprintResult.create({
    createdBy: adminUser._id,
    community: community._id,
    strengths: [
      {
        strength: 'compassion',
        count: 2,
      },
    ],
  });

  await SprintResult.create({
    createdBy: adminUser._id,
    community: community._id,
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

  await Group.create({
    _id: new mongoose.Types.ObjectId(),
    name: 'Admin Group',
    description: 'Admin Group Description',
    community: community._id,
    owner: adminUser._id,
    createdBy: adminUser._id,
    updatedBy: adminUser._id,
  });

  await community.save();

  adminUser.selectedCommunity = community;

  await adminUser.save();

  logger.log(JSON.stringify(adminUser, null, 2));

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
    parentCategory: pedagogy._id,
    rootCategory: pedagogy._id,
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
    parentCategory: pedagogy._id,
    rootCategory: pedagogy._id,
    displayAs: 'grid',
    thumbnail: '/images/cards/v1-learn-material.png',
    order: 2,
    isHidden: false,
    isLocked: false,
  });

  await Article.create({
    translations: [
      {
        language: 'en',
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
    category: crashCourse._id,
    rootCategory: pedagogy._id,
    thumbnail: '/images/cards/v1-learn-material.png',
    length: '5 min',
    strengths: ['love'],
    order: 1,
    updatedBy: adminUser._id,
    isHidden: false,
    isLocked: false,
  });
};

export default seed;
