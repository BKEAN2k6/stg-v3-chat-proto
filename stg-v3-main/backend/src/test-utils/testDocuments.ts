import mongoose from 'mongoose';
import {
  User,
  Group,
  Community,
  BillingContact,
  BillingGroup,
  ArticleCategory,
  Article,
} from '../models/index.js';

export async function registerTestUser(
  userInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
    language?: string;
    country?: string;
    organization?: string;
    organizationType?: string;
    organizationRole?: string;
    registrationType?: 'individual' | 'onboarding' | 'super-admin-created';
    roles?: string[];
    avatar?: string;
    selectedCommunity?: string;
    lastActiveGroups?: Record<string, string>;
  },
  password?: string,
) {
  return User.register(
    {
      firstName: 'TestFirstName',
      lastName: 'TestLastName',
      email: 'test@test.com',
      avatar: 'test-avatar.jpg',
      language: 'en',
      country: 'us',
      organization: 'Test Organization',
      organizationType: 'Test Type',
      organizationRole: 'Test Role',
      registrationType: 'individual',
      roles: [],
      ...userInfo,
    },
    password ?? 'password',
  );
}

export async function createTestGroup(
  userId?: mongoose.Types.ObjectId | string,
  communityId?: mongoose.Types.ObjectId | string,
  groupInfo: {
    name?: string;
    description?: string;
    ageGroup?: string;
    language?: string;
  } = {},
) {
  const owner = userId
    ? userId.toString()
    : new mongoose.Types.ObjectId().toString();
  const community = communityId
    ? communityId.toString()
    : new mongoose.Types.ObjectId().toString();
  return Group.create({
    name: 'Test Group',
    description: 'Test Group Description',
    community,
    owner,
    createdBy: owner,
    updatedBy: owner,
    ageGroup: 'preschool',
    language: 'en',
    articleProgress: [],
    ...groupInfo,
  });
}

export async function createTestCommunity(
  communityInfo: {
    name?: string;
    description?: string;
    avatar?: string;
    language?: string;
    timezone?: string;
    subscription?:
      | {statusValidUntil?: Date; end?: Date; status?: string}
      | undefined;
    billingGroup?: mongoose.Types.ObjectId | string;
  } = {},
) {
  const {subscription, ...communityRest} = communityInfo;

  const {end, ...restSubscription} = subscription ?? {};
  const normalizedSubscription =
    subscription && (subscription.statusValidUntil ?? end)
      ? {
          ...restSubscription,
          statusValidUntil: subscription.statusValidUntil ?? end,
        }
      : subscription;

  return Community.create({
    name: 'Test Community',
    description: 'Test Community Description',
    ...communityRest,
    ...(normalizedSubscription ? {subscription: normalizedSubscription} : {}),
  });
}

export async function createTestBillingContact(
  contactInfo: {
    name?: string;
    email?: string;
    crmLink?: string;
    notes?: string;
  } = {},
) {
  return BillingContact.create({
    name: 'Billing Contact',
    email: 'billing@example.com',
    crmLink: 'https://crm.example.com/contacts/123',
    ...contactInfo,
  });
}

export async function createTestBillingGroup(
  billingContactId?: mongoose.Types.ObjectId | string,
  billingGroupInfo: {
    name?: string;
    notes?: string;
  } = {},
) {
  let billingContact = billingContactId?.toString();

  if (!billingContact) {
    const createdContact = await createTestBillingContact();
    billingContact = createdContact._id.toString();
  }

  return BillingGroup.create({
    name: 'Billing Group',
    billingContact,
    ...billingGroupInfo,
  });
}

export async function createTestArticleCategory(
  categoryInfo: {
    translations?: Array<{
      language: string;
      name: string;
      description: string;
    }>;
    parentCategory?: mongoose.Types.ObjectId;
    rootCategory?: mongoose.Types.ObjectId;
    thumbnail?: string;
    displayAs?: 'list' | 'grid';
    order?: number;
    isHidden?: boolean;
    isLocked?: boolean;
  } = {},
) {
  const id = new mongoose.Types.ObjectId();

  let {rootCategory} = categoryInfo;
  if (!rootCategory && categoryInfo.parentCategory) {
    const parent = await ArticleCategory.findById(categoryInfo.parentCategory);
    rootCategory = parent!.rootCategory;
  }

  rootCategory ??= id;

  await ArticleCategory.collection.insertOne({
    _id: id,
    translations: categoryInfo.translations ?? [
      {language: 'en', name: 'Test Category', description: 'Test description'},
    ],
    thumbnail: categoryInfo.thumbnail ?? '',
    displayAs: categoryInfo.displayAs ?? 'list',
    order: categoryInfo.order ?? 0,
    isHidden: categoryInfo.isHidden ?? false,
    isLocked: categoryInfo.isLocked ?? false,
    rootCategory,
    ...(categoryInfo.parentCategory
      ? {parentCategory: categoryInfo.parentCategory}
      : {}),
  });

  const category = await ArticleCategory.findById(id);
  return category!;
}

export async function createTestArticle(
  userId: mongoose.Types.ObjectId,
  articleInfo: {
    translations?: Array<{
      language: string;
      title: string;
      description: string;
      content?: string[];
    }>;
    category: mongoose.Types.ObjectId;
    rootCategory: mongoose.Types.ObjectId;
    thumbnail?: string;
    order?: number;
    length?: string;
    strengths?: string[];
    isHidden?: boolean;
    isLocked?: boolean;
    isFree?: boolean;
  },
) {
  return Article.create({
    translations: [
      {
        language: 'en',
        title: 'Test Article',
        description: 'Test description',
        content: [],
      },
    ],
    thumbnail: '',
    order: 0,
    length: '5 min',
    strengths: [],
    isHidden: false,
    isLocked: false,
    isFree: false,
    isTimelineArticle: false,
    timelineChapter: 'start',
    timelineAgeGroup: 'preschool',
    timelineStrength: 'kindness',
    updatedBy: userId,
    ...articleInfo,
  });
}
