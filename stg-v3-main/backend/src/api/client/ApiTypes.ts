// This file is auto-generated

export type UserInfo = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};
export type UserImage = {
  id: string;
  originalImageUrl: string;
  resizedImageUrl: string;
  thumbnailImageUrl: string;
  aspectRatio: number;
};
export type Community = {
  id: string;
  name: string;
  description: string;
  language: LanguageCode;
  avatar?: string;
  timezone: string;
  billingGroup?: string;
  subscriptionStatusValidUntil?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionEnds?: boolean;
};
export type CommunityStats = {
  topStrengths: Array<{
    strength: StrengthSlug;
    count: number;
  }>;
  leaderboard: Array<{
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    count: number;
  }>;
};
export type Post =
  | Challenge
  | CoachPost
  | Moment
  | SprintResult
  | LessonCompleted
  | OnboardingCompleted
  | GoalCompleted
  | StrengthCompleted;
export type Challenge = {
  id: string;
  comments: Comment[];
  reactions: Reaction[];
  participations: UserInfo[];
  createdAt: string;
  updatedAt: string;
  postType: 'challenge';
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  theme: ChallengeTheme;
  strength: StrengthSlug;
  isReference?: boolean;
};
export type Moment = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'moment';
  content: string;
  /**
   * @maxItems 5
   */
  images: UserImage[];
  strengths: StrengthSlug[];
  isReference?: boolean;
};
export type SprintResult = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'sprint-result';
  groupName: string;
  strengths: Array<{
    strength: StrengthSlug;
    count: number;
  }>;
};
export type LessonCompleted = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'lesson-completed';
  strength: StrengthSlug;
  chapter: ArticleChapter;
  ageGroup: AgeGroup;
  group: Group;
};
export type OnboardingCompleted = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'onboarding-completed';
};
export type GoalCompleted = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'goal-completed';
  strength: StrengthSlug;
  group: Group;
  completedCount: number;
};
export type StrengthCompleted = {
  id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'strength-completed';
  strength: StrengthSlug;
  group: Group;
};
export type Comment = {
  id: string;
  createdBy: UserInfo;
  content: string;
  /**
   * @maxItems 5
   */
  images: UserImage[];
  reactions: Reaction[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};
export type ReactionType =
  | 'like'
  | 'compassion'
  | 'courage'
  | 'creativity'
  | 'humour'
  | 'love'
  | 'perseverance';
export type Reaction = {
  id: string;
  createdBy: UserInfo;
  type: ReactionType;
  createdAt: string;
};
export type ChallengeData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  theme: ChallengeTheme;
  strength: StrengthSlug;
  showDate: string;
  isProcessing: boolean;
  postType: 'challenge';
};
export type StrengthSlug =
  | 'carefulness'
  | 'compassion'
  | 'courage'
  | 'creativity'
  | 'curiosity'
  | 'enthusiasm'
  | 'fairness'
  | 'forgiveness'
  | 'gratitude'
  | 'grit'
  | 'honesty'
  | 'hope'
  | 'humour'
  | 'judgement'
  | 'kindness'
  | 'leadership'
  | 'love'
  | 'loveOfBeauty'
  | 'loveOfLearning'
  | 'modesty'
  | 'perseverance'
  | 'perspective'
  | 'selfRegulation'
  | 'socialIntelligence'
  | 'spirituality'
  | 'teamwork';
export type Article = {
  id: string;
  translations: ArticleTranslation[];
  thumbnail: string;
  length: string;
  strengths: StrengthSlug[];
  category: string;
  order: number;
  updatedAt: string;
  createdAt: string;
  updatedBy: UserInfo;
  categoryPath: Array<{
    id: string;
    translations: Array<{
      language: LanguageCode;
      name: string;
    }>;
  }>;
  isHidden: boolean;
  isLocked: boolean;
  isFree: boolean;
  isTimelineArticle: boolean;
  timelineChapter: ArticleChapter;
  timelineAgeGroup: AgeGroup;
  timelineStrength: StrengthSlug;
};
export type ArticleTranslation = {
  language: LanguageCode;
  title: string;
  description: string;
  content: string[];
  thumbnail?: string;
  requiresUpdate: boolean;
};
export type ArticleCategory = {
  id: string;
  parentCategory?: string;
  subCategories: ArticleCategory[];
  thumbnail: string;
  displayAs: 'list' | 'grid';
  translations: ArticleCategoryTranslation[];
  order: number;
  articles: Array<{
    id: string;
    translations: Array<{
      language: LanguageCode;
      title: string;
      description: string;
      thumbnail?: string;
    }>;
    order: number;
    thumbnail: string;
    length: string;
    strengths: StrengthSlug[];
    isHidden: boolean;
    isLocked: boolean;
    isFree: boolean;
  }>;
  categoryPath: Array<{
    id: string;
    translations: Array<{
      language: LanguageCode;
      name: string;
    }>;
  }>;
  isHidden: boolean;
  isLocked: boolean;
};
export type ArticleCategoryTranslation = {
  language: LanguageCode;
  name: string;
  description: string;
  thumbnail?: string;
};
export type ArticleCategoryListItem = {
  id: string;
  rootCategory: string;
  parentCategory?: string;
  thumbnail: string;
  displayAs: 'list' | 'grid';
  translations: Array<{
    language: LanguageCode;
    name: string;
    description: string;
    thumbnail?: string;
  }>;
  order: number;
  subCategories: ArticleCategoryListItem[];
  articles: Array<{
    id: string;
    category: string;
    rootCategory: string;
    translations: Array<{
      language: LanguageCode;
      title: string;
      description: string;
      thumbnail?: string;
      requiresUpdate: boolean;
    }>;
    order: number;
    isFree: boolean;
  }>;
  isHidden: boolean;
  isLocked: boolean;
};
export type CoachPost = {
  id: string;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'coach-post';
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  images: UserImage[];
  strengths: StrengthSlug[];
  isReference?: boolean;
};
export type CoachPostData = {
  id: string;
  createdAt: string;
  updatedAt: string;
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  showDate: string;
  isProcessing: boolean;
  images: UserImage[];
  strengths: StrengthSlug[];
  postType: 'coach-post';
};
export type ProxyPostData = ChallengeData | CoachPostData;
export type Notification =
  | PostReactionNotification
  | PostCommentNotification
  | CommentReactionNotification
  | CommentCommentNotification
  | CommunityInvitationNotification;
export type CommentReactionNotification = {
  id: string;
  notificationType: 'comment-reaction-notification';
  isRead: boolean;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetComment: {
    id: string;
    content: string;
  };
  targetPost: {
    id: string;
  };
  createdAt: string;
};
export type CommentCommentNotification = {
  id: string;
  notificationType: 'comment-comment-notification';
  isRead: boolean;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetComment: {
    id: string;
    content: string;
  };
  targetPost: {
    id: string;
  };
  comment: {
    id: string;
    content: string;
  };
  createdAt: string;
};
export type PostCommentNotification = {
  id: string;
  notificationType: 'post-comment-notification';
  isRead: boolean;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetPost: {
    id: string;
    postType: 'moment' | 'sprint-result';
    content?: string;
  };
  createdAt: string;
};
export type PostReactionNotification = {
  id: string;
  notificationType: 'post-reaction-notification';
  isRead: boolean;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetPost: {
    id: string;
    postType: 'moment' | 'sprint-result';
    content?: string;
  };
  createdAt: string;
};
export type HostSprint = {
  id: string;
  isCompleted: boolean;
  isEnded: boolean;
  isCodeActive: boolean;
  expectedStrengthCount: number;
  players: GroupGamePlayer[];
  sharedStrengths: Array<{
    strength: StrengthSlug;
    from: string;
    to: string;
  }>;
  updatedAt: string;
};
export type ChallengeTheme = 'default' | 'holiday-calendar';
export type CommunityMemberInvitation = {
  id: string;
  email: string;
  createdAt: string;
};
export type CommunityInvitationNotification = {
  id: string;
  notificationType: 'community-invitation-notification';
  isRead: boolean;
  actor: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  community: {
    id: string;
    name: string;
  };
  createdAt: string;
};
export type StrengthGoal = {
  id: string;
  description?: string;
  strength: StrengthSlug;
  target: number;
  targetDate: string;
  isSystemCreated?: boolean;
  createdAt: string;
  updatedAt: string;
  group: {
    id: string;
    name: string;
  };
  events: Array<{
    createdAt: string;
  }>;
};
export type LanguageCode = 'fi' | 'en' | 'sv';
export type UserRetention = {
  daily: Array<{
    date: string;
    interval: number;
    visitors: number;
    returnVisitors: number;
    percentage: number;
  }>;
  weekly: Array<{
    date: string;
    interval: number;
    visitors: number;
    returnVisitors: number;
    percentage: number;
  }>;
  monthly: Array<{
    date: string;
    interval: number;
    visitors: number;
    returnVisitors: number;
    percentage: number;
  }>;
};
export type Group = {
  id: string;
  name: string;
  description: string;
  owner: UserInfo;
  language: LanguageCode;
  ageGroup: AgeGroup;
  articleProgress: ArticleProgressEntry[];
};
export type AgeGroup = 'preschool' | '7-8' | '9-10' | '11-12' | '13-15';
export type ArticleProgressEntry = {
  article: string;
  completionDate: string;
};
export type AnimationImageAsset = {
  assetId: string;
  assetType: 'image';
  name: string;
  renderType: string;
  width: number;
  height: number;
  color: {
    r: number;
    g: number;
    b: number;
    a: number;
  };
  fontSize: number;
  translations: {
    en: string;
    fi: string;
    sv: string;
  };
};
export type AnimationAudioAsset = {
  assetId: string;
  assetType: 'audio';
  name: string;
  renderType: string;
  translations: {
    en: string;
    fi: string;
    sv: string;
  };
};
export type AnimationSegment = {
  start: number;
  stop: number;
  autoplay: boolean;
  loop: boolean;
  showToolbar: boolean;
};
export type AnimationLottie = {
  assets: Array<{
    id: string;
    p?: string;
    w?: number;
    h?: number;
    u?: string;
  }>;
  nm?: string;
  op?: number;
  customSegments?: unknown[];
  fr?: number;
  loop?: boolean;
};
export type ArticleChapter = 'start' | 'speak' | 'act' | 'assess';
export type TimelineArticle = {
  id: string;
  strength: StrengthSlug;
  chapter: ArticleChapter;
  ageGroup: AgeGroup;
};
export type TopUsers = {
  daily: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    visitCount: number;
    country: string;
  }>;
  weekly: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    visitCount: number;
    country: string;
  }>;
  monthly: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    organization: string;
    visitCount: number;
    country: string;
  }>;
};
export type QuestionSet = {
  id: string;
  type: 'quiz' | 'questionnaire';
  title: Array<{
    language: LanguageCode;
    text: string;
  }>;
  description: Array<{
    language: LanguageCode;
    text: string;
  }>;
  questions: Array<{
    id: string;
    instruction: Array<{
      language: LanguageCode;
      text: string;
    }>;
    explanation: Array<{
      language: LanguageCode;
      text: string;
    }>;
    strength?: StrengthSlug;
    multiSelect: boolean;
    choices: Array<{
      id: string;
      points: number;
      label: Array<{
        language: LanguageCode;
        text: string;
      }>;
      isCorrect: boolean;
    }>;
  }>;
};
export type StrengthGroup =
  | 'wisdom'
  | 'humanity'
  | 'justice'
  | 'courage'
  | 'temperance'
  | 'transcendence';
export type GroupGamePlayer = {
  id: string;
  nickname: string;
  color: string;
  avatar: string;
};
export type NewUsers = Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  createdAt: string;
  country: string;
}>;
export type BillingContact = {
  id: string;
  name: string;
  email: string;
  crmLink?: string;
  notes?: string;
};
export type BillingGroup = {
  id: string;
  name: string;
  notes?: string;
  lastSubscriptionEnd?: string;
  billingContact: BillingContact;
  communities: BillingGroupCommunity[];
};
export type BillingGroupCommunity = {
  id: string;
  name: string;
  timezone: string;
  subscriptionStatusValidUntil?: string;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionUpdatedAt?: string;
  subscriptionUpdatedBy?: UserInfo;
};
export type SubscriptionStatus =
  | 'free-trial'
  | 'active-online'
  | 'active-manual'
  | 'grace'
  | 'expired';
export type SubscriptionHistoryEntry = {
  statusValidUntil?: string;
  status?: SubscriptionStatus;
  subscriptionEnds?: boolean;
  updatedAt?: string;
  updatedBy?: UserInfo;
};
export type AiGuidanceResponse = {
  title: string;
  suggestionText: string;
  activityType: 'lesson' | 'game' | 'goal';
  activityId?: string;
  logId: string;
};
export type GroupStats = {
  diplomas: {
    count: number;
    updatedAt?: string;
  };
  lessons: {
    count: number;
    updatedAt?: string;
  };
  games: {
    count: number;
    updatedAt?: string;
    byType: Array<{
      slug: 'memory-game' | 'sprint';
      count: number;
    }>;
  };
  goals: {
    count: number;
    updatedAt?: string;
  };
  streak: number;
};
export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  language: LanguageCode;
  country: string;
  organization: string;
  organizationType: string;
  organizationRole: string;
};
export type LoginRequest = {
  email: string;
  password: string;
  rememberMe?: boolean;
  invitationCode?: string;
};
export type MagicLoginResponse = {
  allowPasswordChange: boolean;
  forcePasswordChange: boolean;
};
export type MagicLoginRequest = {
  token: string;
};
export type EmailAuthRequest = {
  email: string;
  resetPassword?: boolean;
};
export type CodeAuthRequest = {
  invitationCode: string;
  email: string;
  firstName: string;
  lastName: string;
  language: LanguageCode;
  country: string;
  organization: string;
  organizationType: string;
  organizationRole: string;
  password: string;
};
export type CheckEmailExistsResponse = {
  exists: boolean;
};
export type CheckEmailExistsRequest = {
  email: string;
};
export type ConfirmEmailRequest = {
  token: string;
};
export type CreateChallengeParticipationParameters = {
  id: string;
};
export type CreateChallengeParticipationResponse = UserInfo;
export type GetUsersResponse = Array<{
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: LanguageCode;
  isEmailVerified: boolean;
  roles: Array<'super-admin'>;
}>;
export type GetUsersQuery = {
  search?: string;
  limit?: string;
  skip?: string;
  sort?: string;
};
export type GetMeResponse = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: LanguageCode;
  roles: Array<'super-admin'>;
  communities: Array<{
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'admin' | 'owner';
    memberCount: number;
    subscriptionStatus: SubscriptionStatus;
  }>;
  selectedCommunity: string;
  consents: {
    vimeo: boolean;
  };
  hasSetConsents: boolean;
  introSlidesRead?: string;
};
export type UpdateMeResponse = {
  selectedCommunity: string;
  firstName: string;
  lastName: string;
  language: LanguageCode;
  avatar: string;
  consents: {
    vimeo: boolean;
  };
  hasSetConsents: boolean;
  introSlidesRead?: string;
};
export type UpdateMeRequest = {
  selectedCommunity?: string;
  firstName?: string;
  lastName?: string;
  language?: LanguageCode;
  password?: string;
  newPassword?: string;
  avatar?: string;
  consents?: {
    vimeo: boolean;
  };
  hasSetConsents?: boolean;
  introSlidesRead?: string;
};
export type UpdateMyEmailResponse = {
  code: string;
};
export type UpdateMyEmailRequest = {
  email: string;
  password: string;
};
export type GetUserParameters = {
  id: string;
};
export type GetUserResponse = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: LanguageCode;
  isEmailVerified: boolean;
  roles: Array<'super-admin'>;
};
export type UpdateUserParameters = {
  id: string;
};
export type UpdateUserResponse = {
  firstName: string;
  lastName: string;
  email: string;
  language: LanguageCode;
  isEmailVerified: boolean;
  roles: Array<'super-admin'>;
};
export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  language?: LanguageCode;
  isEmailVerified?: boolean;
  password?: string;
  roles?: Array<'super-admin'>;
};
export type GetUserCommunitiesParameters = {
  id: string;
};
export type GetUserCommunitiesResponse = Array<{
  id: string;
  name: string;
  role: 'member' | 'admin' | 'owner';
}>;
export type UpdateMeAvatarResponse = {
  avatar: string;
};
export type GetMyNotificationsResponse = Array<
  | CommentReactionNotification
  | CommentCommentNotification
  | PostCommentNotification
  | PostReactionNotification
  | CommunityInvitationNotification
>;
export type UpdateMyNotificationsReadRequest = {
  date: string;
};
export type CreateMyCommunityJoinRequest = {
  code: string;
};
export type GetMyCommunityInvitationsResponse = Array<{
  id: string;
  community: {
    id: string;
    name: string;
  };
  message: string;
  cretedAt?: string;
  createdBy: UserInfo;
}>;
export type UpdateMyCommunityInvitationParameters = {
  id: string;
};
export type UpdateMyCommunityInvitationRequest = {
  status: 'accepted';
};
export type GetMyLastActiveGroupsResponse = Record<string, string>;
export type UpdateMyLastActiveGroupsParameters = {
  id: string;
};
export type UpdateMyLastActiveGroupsResponse = Record<string, string>;
export type UpdateMyLastActiveGroupsRequest = string;
export type GetCommunityGroupsParameters = {
  id: string;
};
export type GetCommunityGroupsResponse = Group[];
export type CreateCommunityGroupParameters = {
  id: string;
};
export type CreateCommunityGroupResponse = Group;
export type CreateCommunityGroupRequest = {
  name: string;
  description: string;
  owner: string;
};
export type GetGroupParameters = {
  id: string;
};
export type GetGroupResponse = Group;
export type UpdateGroupParameters = {
  id: string;
};
export type UpdateGroupResponse = Group;
export type UpdateGroupRequest = {
  name?: string;
  description?: string;
  owner?: string;
  language?: LanguageCode;
  ageGroup?: AgeGroup;
};
export type CreateGroupArticleProgressParameters = {
  id: string;
};
export type CreateGroupArticleProgressResponse = ArticleProgressEntry;
export type CreateGroupArticleProgressRequest = {
  article: string;
  isSkipped: boolean;
};
export type RemoveGroupArticleProgressParameters = {
  id: string;
  article: string;
};
export type GetAiGuidanceParameters = {
  id: string;
};
export type GetAiGuidanceResponse = AiGuidanceResponse;
export type GetAiGuidanceQuery = {
  clientHour?: string;
  clientWeekday?: string;
};
export type GetGroupStatsParameters = {
  id: string;
};
export type GetGroupStatsResponse = GroupStats;
export type UpdateGuidanceLogParameters = {
  id: string;
  logId: string;
};
export type UpdateGuidanceLogRequest = {
  action?: 'action' | 'refresh';
};
export type GetGroupGameWithCodeParameters = {
  code: string;
};
export type GetGroupGameWithCodeResponse = {
  id: string;
  gameType: string;
  player?: GroupGamePlayer;
  players: string[];
  updatedAt: string;
  isStarted?: boolean;
};
export type GetGroupGameWithIdParameters = {
  id: string;
};
export type GetGroupGameWithIdResponse = {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  isCodeActive: boolean;
  code: string;
  gameType: string;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type UpdateGroupGameParameters = {
  id: string;
};
export type UpdateGroupGameResponse = {
  id: string;
  isStarted: boolean;
  code: string;
  gameType: string;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type UpdateGroupGameRequest = {
  isStarted?: boolean;
};
export type CreateGroupGamePlayerParameters = {
  id: string;
};
export type CreateGroupGamePlayerResponse = GroupGamePlayer;
export type CreateGroupGamePlayerRequest = {
  nickname: string;
  color: string;
  avatar: string;
};
export type RemoveGroupGamePlayerParameters = {
  id: string;
  playerId: string;
};
export type CreateSprintParameters = {
  id: string;
};
export type CreateSprintResponse = {
  id: string;
  code: string;
};
export type GetHostSprintParameters = {
  id: string;
};
export type GetHostSprintResponse = HostSprint;
export type UpdateSprintParameters = {
  id: string;
};
export type UpdateSprintResponse = HostSprint;
export type UpdateSprintRequest = {
  isEnded?: boolean;
};
export type GetPlayerSprintParameters = {
  id: string;
};
export type GetPlayerSprintResponse = {
  id: string;
  room: Array<{
    id: string;
    nickname: string;
    avatar: string;
    color: string;
    strength?: StrengthSlug;
  }>;
  players: string[];
  isEnded: boolean;
  isCompleted: boolean;
  player: GroupGamePlayer;
  receivedStrengths: Array<{
    from: {
      nickname: string;
      id: string;
    };
    strength: StrengthSlug;
  }>;
  updatedAt: string;
};
export type CreateSprintStrengthParameters = {
  id: string;
};
export type CreateSprintStrengthResponse = {
  to: string;
  strength: StrengthSlug;
};
export type CreateSprintStrengthRequest = {
  to: string;
  strength: StrengthSlug;
};
export type GetCommunitiesResponse = Community[];
export type GetCommunitiesQuery = {
  search?: string;
  limit?: string;
  skip?: string;
  sort?: string;
  status?: SubscriptionStatus;
  subscriptionEnds?: string;
  statusValidUntilFrom?: string;
  statusValidUntilTo?: string;
};
export type CreateCommunityResponse = Community;
export type CreateCommunityRequest = {
  name: string;
  description: string;
  language: LanguageCode;
  timezone: string;
};
export type CreateCommunityInvitationParameters = {
  id: string;
};
export type CreateCommunityInvitationResponse = {
  id: string;
  code?: string;
  createdAt: string;
};
export type GetCommunityParameters = {
  id: string;
};
export type GetCommunityResponse = Community;
export type UpdateCommunityParameters = {
  id: string;
};
export type UpdateCommunityResponse = Community;
export type UpdateCommunityRequest = {
  name?: string;
  description?: string;
  language?: LanguageCode;
  avatar?: string;
  timezone?: string;
};
export type UpdateCommunityBillingGroupParameters = {
  id: string;
};
export type UpdateCommunityBillingGroupResponse = Community;
export type UpdateCommunityBillingGroupRequest = {
  billingGroupId: string | undefined;
};
export type UpdateCommunityAvatarParameters = {
  id: string;
};
export type UpdateCommunityAvatarResponse = {
  avatar: string;
};
export type CreateCommunityUserImageParameters = {
  id: string;
};
export type CreateCommunityUserImageResponse = UserImage;
export type UpsertCommunityMemberParameters = {
  id: string;
  userId: string;
};
export type UpsertCommunityMemberRequest = {
  role: 'member' | 'admin' | 'owner';
};
export type RemoveCommunityMemberParameters = {
  id: string;
  userId: string;
};
export type GetCommunityMembersParameters = {
  id: string;
};
export type GetCommunityMembersResponse = Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  language: LanguageCode;
  role: 'member' | 'admin' | 'owner';
}>;
export type CreateUserToCommunityParameters = {
  id: string;
};
export type CreateUserToCommunityResponse = {
  code: string;
};
export type CreateUserToCommunityRequest = {
  email: string;
  firstName: string;
  lastName: string;
  role: 'member' | 'admin';
  language: LanguageCode;
  country: string;
  organization: string;
  organizationType: string;
  organizationRole: string;
};
export type GetCommunityStatsParameters = {
  id: string;
};
export type GetCommunityStatsResponse = CommunityStats;
export type GetCommunityProxyPostParameters = {
  id: string;
  postId: string;
};
export type GetCommunityProxyPostResponse =
  | Challenge
  | Moment
  | SprintResult
  | CoachPost;
export type CreateCommunityMemberInvitationParameters = {
  id: string;
};
export type CreateCommunityMemberInvitationResponse = CommunityMemberInvitation;
export type CreateCommunityMemberInvitationRequest = {
  email: string;
  message?: string;
};
export type GetCommunityMemberInvitationsParameters = {
  id: string;
};
export type GetCommunityMemberInvitationsResponse = CommunityMemberInvitation[];
export type GetCommunitySubscriptionParameters = {
  id: string;
};
export type GetCommunitySubscriptionResponse = {
  statusValidUntil?: string;
  status?: SubscriptionStatus;
  subscriptionEnds?: boolean;
  updatedAt?: string;
  updatedBy?: UserInfo;
  history?: SubscriptionHistoryEntry[];
};
export type UpdateCommunitySubscriptionParameters = {
  id: string;
};
export type UpdateCommunitySubscriptionResponse = {
  statusValidUntil: string;
  status?: SubscriptionStatus;
  subscriptionEnds?: boolean;
  updatedAt?: string;
  updatedBy?: UserInfo;
  history?: SubscriptionHistoryEntry[];
};
export type UpdateCommunitySubscriptionRequest = {
  statusValidUntil: string;
  status?: SubscriptionStatus;
  subscriptionEnds?: boolean;
};
export type GetCommunityInvitationWithCodeParameters = {
  code: string;
};
export type GetCommunityInvitationWithCodeResponse = {
  id: string;
  name: string;
  avatar: string;
};
export type CreateCommunityMomentParameters = {
  id: string;
};
export type CreateCommunityMomentResponse = Moment;
export type CreateCommunityMomentRequest = {
  content?: string;
  /**
   * @maxItems 5
   */
  strengths?: StrengthSlug[];
  /**
   * @maxItems 5
   */
  images?: string[];
};
export type GetCommunityPostsParameters = {
  id: string;
};
export type GetCommunityPostsResponse = Array<
  | Challenge
  | Moment
  | SprintResult
  | CoachPost
  | LessonCompleted
  | OnboardingCompleted
  | GoalCompleted
  | StrengthCompleted
>;
export type GetCommunityPostsQuery = {
  startDate?: string;
  limit?: string;
};
export type CreatePostCommentParameters = {
  id: string;
};
export type CreatePostCommentResponse = Comment;
export type CreatePostCommentRequest = {
  content?: string;
  /**
   * @maxItems 5
   */
  images?: string[];
};
export type CreatePostReactionParameters = {
  id: string;
};
export type CreatePostReactionResponse = Reaction;
export type CreatePostReactionRequest = {
  type:
    | 'like'
    | 'compassion'
    | 'courage'
    | 'creativity'
    | 'humour'
    | 'love'
    | 'perseverance';
};
export type GetPostParameters = {
  id: string;
};
export type GetPostResponse =
  | Challenge
  | Moment
  | SprintResult
  | CoachPost
  | LessonCompleted
  | OnboardingCompleted
  | GoalCompleted
  | StrengthCompleted;
export type RemovePostParameters = {
  id: string;
};
export type UpdateMomentParameters = {
  id: string;
};
export type UpdateMomentResponse = Moment;
export type UpdateMomentRequest = {
  content?: string;
  /**
   * @maxItems 5
   */
  strengths?: StrengthSlug[];
  /**
   * @maxItems 5
   */
  images?: string[];
};
export type UpdateCommentParameters = {
  id: string;
};
export type UpdateCommentResponse = Comment;
export type UpdateCommentRequest = {
  content?: string;
  /**
   * @maxItems 5
   */
  images?: string[];
};
export type RemoveCommentParameters = {
  id: string;
};
export type CreateCommentReactionParameters = {
  id: string;
};
export type CreateCommentReactionResponse = Reaction;
export type CreateCommentReactionRequest = {
  type:
    | 'like'
    | 'compassion'
    | 'courage'
    | 'creativity'
    | 'humour'
    | 'love'
    | 'perseverance';
};
export type CreateCommentCommentParameters = {
  id: string;
};
export type CreateCommentCommentResponse = Comment;
export type CreateCommentCommentRequest = {
  content?: string;
  /**
   * @maxItems 5
   */
  images?: string[];
};
export type RemoveReactionParameters = {
  id: string;
};
export type UpdateReactionParameters = {
  id: string;
};
export type UpdateReactionResponse = Reaction;
export type UpdateReactionRequest = {
  type:
    | 'like'
    | 'compassion'
    | 'courage'
    | 'creativity'
    | 'humour'
    | 'love'
    | 'perseverance';
};
export type GetProxyPostsResponse = Array<ChallengeData | CoachPostData>;
export type CreateProxyPostImageResponse = {
  path: string;
};
export type RemoveProxyPostParameters = {
  id: string;
};
export type CreateChallengeResponse = ChallengeData;
export type CreateChallengeRequest = {
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  theme: ChallengeTheme;
  strength: StrengthSlug;
  showDate: string;
};
export type GetChallengeParameters = {
  id: string;
};
export type GetChallengeResponse = ChallengeData;
export type UpdateChallengeParameters = {
  id: string;
};
export type UpdateChallengeRequest = {
  translations?: {
    fi: string;
    en: string;
    sv: string;
  };
  theme?: ChallengeTheme;
  strength?: StrengthSlug;
  showDate?: string;
};
export type ExportCoachPostsResponse = string;
export type CreateCoachPostResponse = CoachPostData;
export type CreateCoachPostRequest = {
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  showDate: string;
  images: string[];
  strengths: StrengthSlug[];
};
export type GetCoachPostParameters = {
  id: string;
};
export type GetCoachPostResponse = CoachPostData;
export type UpdateCoachPostParameters = {
  id: string;
};
export type UpdateCoachPostRequest = {
  translations?: {
    fi: string;
    en: string;
    sv: string;
  };
  theme?: ChallengeTheme;
  showDate?: string;
  images?: string[];
  strengths?: StrengthSlug[];
};
export type CreateTranlationJobResponse = {
  id: string;
  isFinished: boolean;
};
export type CreateTranlationJobRequest = {
  source: {
    language: LanguageCode;
    title: string;
    description: string;
    content: string[];
  };
  targetLanguage: LanguageCode;
};
export type GetTranslationJobParameters = {
  id: string;
};
export type GetTranslationJobResponse = {
  result?: {
    language: LanguageCode;
    title: string;
    description: string;
    content: string[];
  };
  errorMessage?: string;
  isFinished: boolean;
};
export type CreateArticleResponse = Article;
export type CreateArticleRequest = {
  id?: string;
  translations: Array<{
    language: LanguageCode;
    title: string;
    description: string;
    content: string[];
    thumbnail?: string;
  }>;
  thumbnail?: string;
  length: string;
  strengths: StrengthSlug[];
  category: string;
  isHidden: boolean;
  isLocked: boolean;
  isFree: boolean;
  isTimelineArticle: boolean;
  timelineChapter: ArticleChapter;
  timelineAgeGroup: AgeGroup;
  timelineStrength: StrengthSlug;
};
export type UpdateArticlesOrderRequest = string[];
export type CreateArticleImageResponse = {
  path: string;
};
export type CreateArticleThumbnailResponse = {
  path: string;
};
export type CreateArticleAttachmentParameters = {
  fileName: string;
};
export type CreateArticleAttachmentResponse = {
  path: string;
};
export type GetArticleParameters = {
  id: string;
};
export type GetArticleResponse = Article;
export type UpdateArticleParameters = {
  id: string;
};
export type UpdateArticleResponse = Article;
export type UpdateArticleRequest = {
  id?: string;
  translations?: Array<{
    language: LanguageCode;
    title: string;
    description: string;
    content: string[];
    thumbnail?: string;
    requiresUpdate: boolean;
  }>;
  thumbnail?: string;
  length?: string;
  strengths?: StrengthSlug[];
  category?: string;
  isHidden?: boolean;
  isLocked?: boolean;
  isFree?: boolean;
  isTimelineArticle?: boolean;
  timelineChapter?: ArticleChapter;
  timelineAgeGroup?: AgeGroup;
  timelineStrength?: StrengthSlug;
  changeLog: string;
};
export type RemoveArticleParameters = {
  id: string;
};
export type GetArticleHistoriesParameters = {
  id: string;
};
export type GetArticleHistoriesResponse = Array<{
  id: string;
  documentId: string;
  changeLog: string;
  timestamp: string;
  data: {
    updatedBy?: {
      firstName?: string;
      lastName?: string;
    };
  };
}>;
export type GetArticleHistoryParameters = {
  id: string;
};
export type GetArticleHistoryResponse = {
  id: string;
  documentId: string;
  changeLog: string;
  timestamp: string;
  data: {};
};
export type GetTimelineArticlesResponse = TimelineArticle[];
export type GetArticleCategoriesResponse = ArticleCategoryListItem[];
export type CreateArticleCategoryResponse = ArticleCategory;
export type CreateArticleCategoryRequest = {
  translations: Array<{
    language: LanguageCode;
    description: string;
    name: string;
    thumbnail?: string;
  }>;
  parentCategory?: string;
  thumbnail?: string;
  displayAs: 'list' | 'grid';
  isHidden: boolean;
  isLocked: boolean;
};
export type UpdateArticleCategoriesOrderRequest = string[];
export type GetArticleCategoryParameters = {
  id: string;
};
export type GetArticleCategoryResponse = ArticleCategory;
export type UpdateArticleCategoryParameters = {
  id: string;
};
export type UpdateArticleCategoryResponse = ArticleCategory;
export type UpdateArticleCategoryRequest = {
  translations?: Array<{
    language: LanguageCode;
    description: string;
    name: string;
    thumbnail?: string;
  }>;
  parentCategory?: string | undefined;
  thumbnail?: string;
  displayAs?: 'list' | 'grid';
  isHidden?: boolean;
  isLocked?: boolean;
};
export type RemoveArticleCategoryParameters = {
  id: string;
};
export type GetEmailsResponse = {
  en: string[];
  fi: string[];
  sv: string[];
};
export type CreateMemoryGameParameters = {
  id: string;
};
export type CreateMemoryGameResponse = {
  id: string;
};
export type CreateMemoryGameRequest = {
  numberOfCards: 16 | 36;
};
export type GetHostMemoryGameParameters = {
  id: string;
};
export type GetHostMemoryGameResponse = {
  id: string;
  isEnded: boolean;
  isCodeActive: boolean;
  cards: Array<{
    id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  players: GroupGamePlayer[];
  currentPlayer: string;
  updatedAt: string;
};
export type UpdateMemoryGameParameters = {
  id: string;
};
export type UpdateMemoryGameResponse = {
  id: string;
  isEnded: boolean;
  cards: Array<{
    id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  players: GroupGamePlayer[];
  currentPlayer: string;
  updatedAt: string;
};
export type UpdateMemoryGameRequest = {
  isEnded?: boolean;
};
export type GetPlayerMemoryGameParameters = {
  id: string;
};
export type GetPlayerMemoryGameResponse = {
  id: string;
  isEnded: boolean;
  cards: Array<{
    id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  player: GroupGamePlayer;
  players: GroupGamePlayer[];
  currentPlayer: string;
  updatedAt: string;
};
export type CreateMemoryGamePickParameters = {
  id: string;
};
export type CreateMemoryGamePickRequest = {
  cardId: string;
};
export type SkipPlayerParameters = {
  id: string;
};
export type RemoveCommunityMemberInvitationParameters = {
  id: string;
};
export type GetUiVersionResponse = string;
export type GetStrengthGoalsParameters = {
  id: string;
};
export type GetStrengthGoalsResponse = StrengthGoal[];
export type CreateStrengthGoalParameters = {
  id: string;
};
export type CreateStrengthGoalResponse = StrengthGoal;
export type CreateStrengthGoalRequest = {
  strength: StrengthSlug;
  description?: string;
  target: number;
  targetDate: string;
  events?: Array<{
    createdAt: string;
  }>;
  isSystemCreated?: boolean;
};
export type RemoveStrengthGoalsByStrengthParameters = {
  id: string;
};
export type RemoveStrengthGoalsByStrengthQuery = {
  strength: StrengthSlug;
};
export type GetStrengthGoalParameters = {
  id: string;
};
export type GetStrengthGoalResponse = StrengthGoal;
export type UpdateStrengthGoalParameters = {
  id: string;
};
export type UpdateStrengthGoalResponse = StrengthGoal;
export type UpdateStrengthGoalRequest = {
  strength?: StrengthSlug;
  description?: string;
  target?: number;
  targetDate?: string;
};
export type RemoveStrengthGoalParameters = {
  id: string;
};
export type CreateStrengthGoalEventParameters = {
  id: string;
};
export type CreateStrengthGoalEventResponse = {
  createdAt: string;
};
export type GetGroupStrengthCompletedCountParameters = {
  id: string;
  strength: string;
};
export type GetGroupStrengthCompletedCountResponse = number;
export type GetUserRetentionResponse = {
  allUsers: UserRetention;
  existingUsers: UserRetention;
  registeredUsers: UserRetention;
  topUsers: TopUsers;
  newUsers: NewUsers;
};
export type CreateClientErrorRequest = {
  error?: {
    message?: string;
    stack?: string;
  };
  environment?: {};
};
export type CreateVoiceoverRequest = {
  text: string;
  language: LanguageCode;
};
export type GetAnimationsResponse = Array<{
  id: string;
  name: string;
  isChecked: boolean;
  languages: LanguageCode[];
  createdBy: UserInfo;
  updatedBy: UserInfo;
  updatedAt: string;
}>;
export type CreateAnimationResponse = {
  id: string;
  name: string;
};
export type CreateAnimationRequest = {
  name: string;
  isChecked: boolean;
  animations: Array<{
    language: LanguageCode;
    data: AnimationLottie;
  }>;
  assetSettings: Array<AnimationImageAsset | AnimationAudioAsset>;
  loop: boolean;
  segments: AnimationSegment[];
};
export type GetAnimationParameters = {
  id: string;
};
export type GetAnimationResponse = {
  id: string;
  name: string;
  isChecked: boolean;
  languages: LanguageCode[];
  assetSettings: Array<AnimationImageAsset | AnimationAudioAsset>;
  loop: boolean;
  segments: AnimationSegment[];
};
export type UpdateAnimationParameters = {
  id: string;
};
export type UpdateAnimationResponse = {
  id: string;
  name: string;
};
export type UpdateAnimationRequest = {
  name: string;
  isChecked?: boolean;
  animations: Array<{
    language: LanguageCode;
    data: {};
  }>;
  assetSettings: Array<AnimationImageAsset | AnimationAudioAsset>;
  loop?: boolean;
  segments: AnimationSegment[];
};
export type RemoveAnimationParameters = {
  id: string;
};
export type GetQuestionSetsResponse = Array<{
  id: string;
  title: string;
}>;
export type CreateQuestionSetResponse = QuestionSet;
export type CreateQuestionSetRequest = {
  type: 'quiz' | 'questionnaire';
  title: Array<{
    language: LanguageCode;
    text: string;
  }>;
  description: Array<{
    language: LanguageCode;
    text: string;
  }>;
  questions: Array<{
    instruction: Array<{
      language: LanguageCode;
      text: string;
    }>;
    explanation: Array<{
      language: LanguageCode;
      text: string;
    }>;
    multiSelect: boolean;
    strength?: StrengthSlug;
    choices: Array<{
      points: number;
      label: Array<{
        language: LanguageCode;
        text: string;
      }>;
      isCorrect: boolean;
    }>;
  }>;
};
export type GetQuestionSetParameters = {
  id: string;
};
export type GetQuestionSetResponse = QuestionSet;
export type UpdateQuestionSetParameters = {
  id: string;
};
export type UpdateQuestionSetResponse = QuestionSet;
export type UpdateQuestionSetRequest = {
  type: 'quiz' | 'questionnaire';
  title: Array<{
    language: LanguageCode;
    text: string;
  }>;
  description?: Array<{
    language: LanguageCode;
    text: string;
  }>;
  questions: Array<{
    id: string;
    instruction: Array<{
      language: LanguageCode;
      text: string;
    }>;
    explanation: Array<{
      language: LanguageCode;
      text: string;
    }>;
    strength?: StrengthSlug;
    multiSelect: boolean;
    choices: Array<{
      id?: string;
      points: number;
      label: Array<{
        language: LanguageCode;
        text: string;
      }>;
      isCorrect: boolean;
    }>;
  }>;
};
export type RemoveQuestionSetParameters = {
  id: string;
};
export type CreateQuizParameters = {
  id: string;
};
export type CreateQuizResponse = {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  isCodeActive: boolean;
  canAnswer: boolean;
  code: string;
  questionSet: {
    type: 'quiz' | 'questionnaire';
    title: Array<{
      language: LanguageCode;
      text: string;
    }>;
    description: Array<{
      language: LanguageCode;
      text: string;
    }>;
    questions: Array<{
      id: string;
      instruction: Array<{
        language: LanguageCode;
        text: string;
      }>;
      explanation: Array<{
        language: LanguageCode;
        text: string;
      }>;
      strength?: StrengthSlug;
      multiSelect: boolean;
      choices: Array<{
        id: string;
        points: number;
        label: Array<{
          language: LanguageCode;
          text: string;
        }>;
        isCorrect: boolean;
      }>;
    }>;
  };
  currentQuestion: string;
  answers: Array<{
    question: string;
    choices: string[];
    player: string;
  }>;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type CreateQuizRequest = {
  questionSet: string;
};
export type CreateQuizPlayerParameters = {
  id: string;
};
export type CreateQuizPlayerResponse = GroupGamePlayer;
export type CreateQuizPlayerRequest = {
  nickname: string;
  color: string;
  avatar: string;
};
export type GetHostQuizParameters = {
  id: string;
};
export type GetHostQuizResponse = {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  isCodeActive: boolean;
  canAnswer: boolean;
  code: string;
  questionSet: {
    type: 'quiz' | 'questionnaire';
    title: Array<{
      language: LanguageCode;
      text: string;
    }>;
    description: Array<{
      language: LanguageCode;
      text: string;
    }>;
    questions: Array<{
      id: string;
      instruction: Array<{
        language: LanguageCode;
        text: string;
      }>;
      explanation: Array<{
        language: LanguageCode;
        text: string;
      }>;
      strength?: StrengthSlug;
      multiSelect: boolean;
      choices: Array<{
        id: string;
        points: number;
        label: Array<{
          language: LanguageCode;
          text: string;
        }>;
        isCorrect: boolean;
      }>;
    }>;
  };
  currentQuestion: string;
  answers: Array<{
    question: string;
    choices: string[];
    player: string;
  }>;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type UpdateQuizParameters = {
  id: string;
};
export type UpdateQuizResponse = {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  isCodeActive: boolean;
  canAnswer: boolean;
  code: string;
  questionSet: {
    type: 'quiz' | 'questionnaire';
    title: Array<{
      language: LanguageCode;
      text: string;
    }>;
    description: Array<{
      language: LanguageCode;
      text: string;
    }>;
    questions: Array<{
      id: string;
      instruction: Array<{
        language: LanguageCode;
        text: string;
      }>;
      explanation: Array<{
        language: LanguageCode;
        text: string;
      }>;
      strength?: StrengthSlug;
      multiSelect: boolean;
      choices: Array<{
        id: string;
        points: number;
        label: Array<{
          language: LanguageCode;
          text: string;
        }>;
        isCorrect: boolean;
      }>;
    }>;
  };
  currentQuestion: string;
  answers: Array<{
    question: string;
    choices: string[];
    player: string;
  }>;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type UpdateQuizRequest = {
  isStarted?: boolean;
  isEnded?: boolean;
  canAnswer?: boolean;
  currentQuestion?: string;
  answers?: Array<{
    question: string;
    choices: string[];
    player: string;
  }>;
};
export type GetQuizWithCodeParameters = {
  code: string;
};
export type GetQuizWithCodeResponse = {
  id: string;
  isRegistered: boolean;
};
export type GetPlayerQuizParameters = {
  id: string;
};
export type GetPlayerQuizResponse = {
  id: string;
  isStarted: boolean;
  isEnded: boolean;
  canAnswer: boolean;
  questionSet: {
    type: 'quiz' | 'questionnaire';
    title: Array<{
      language: LanguageCode;
      text: string;
    }>;
    description: Array<{
      language: LanguageCode;
      text: string;
    }>;
    questions: Array<{
      id: string;
      instruction: Array<{
        language: LanguageCode;
        text: string;
      }>;
      explanation: Array<{
        language: LanguageCode;
        text: string;
      }>;
      strength?: StrengthSlug;
      multiSelect: boolean;
      choices: Array<{
        id: string;
        points: number;
        label: Array<{
          language: LanguageCode;
          text: string;
        }>;
        isCorrect: boolean;
      }>;
    }>;
  };
  currentQuestion: string;
  players: GroupGamePlayer[];
  player: GroupGamePlayer;
  answers: Array<{
    question: string;
    choices: string[];
    id: string;
  }>;
};
export type CreateQuizAnswerParameters = {
  id: string;
};
export type CreateQuizAnswerResponse = {
  id: string;
  question: string;
  choices: string[];
};
export type CreateQuizAnswerRequest = {
  question: string;
  choices: string[];
};
export type RemoveQuizPlayerParameters = {
  id: string;
  playerId: string;
};
export type RemoveQuizAnswerParameters = {
  id: string;
  answerId: string;
};
export type GetVideoProcessingJobsResponse = Array<{
  id: string;
  url: string;
  type: 'lottie' | 'video';
  source: 'file' | 'drive';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName: string;
  coverFrameTimestamp: number;
  createdAt: string;
  updatedAt: string;
  errorMessage?: string;
}>;
export type CreateVideoProcessingJobResponse = {
  id: string;
  url: string;
  type: 'lottie' | 'video';
  source: 'file' | 'drive';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName: string;
  coverFrameTimestamp: number;
  createdAt: string;
  updatedAt: string;
};
export type CreateVideoProcessingJobRequest = {
  url: string;
  type: 'lottie' | 'video';
  source: 'file' | 'drive';
  fileName: string;
  loop: boolean;
  videoSegments?: Array<{}>;
  lottieSegments?: Array<{}>;
  coverFrameTimestamp?: number;
};
export type UpdateVideoProcessingJobParameters = {
  id: string;
};
export type UpdateVideoProcessingJobResponse = {
  id: string;
  url: string;
  type: 'lottie' | 'video';
  source: 'file' | 'drive';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  fileName: string;
  coverFrameTimestamp: number;
  createdAt: string;
  updatedAt: string;
};
export type UpdateVideoProcessingJobRequest = {
  status?: 'processing';
  coverFrameTimestamp?: number;
};
export type RemoveVideoProcessingJobParameters = {
  id: string;
};
export type VideoProcessingJobCallbackParameters = {
  id: string;
};
export type GetBillingContactsResponse = BillingContact[];
export type GetBillingContactsQuery = {
  search?: string;
  limit?: string;
  sort?: 'name' | 'recent';
};
export type CreateBillingContactResponse = BillingContact;
export type CreateBillingContactRequest = {
  name: string;
  email: string;
  crmLink?: string;
  notes?: string;
};
export type UpdateBillingContactParameters = {
  id: string;
};
export type UpdateBillingContactResponse = BillingContact;
export type UpdateBillingContactRequest = {
  name?: string;
  email?: string;
  crmLink?: string;
  notes?: string;
};
export type RemoveBillingContactParameters = {
  id: string;
};
export type GetBillingGroupsResponse = BillingGroup[];
export type GetBillingGroupsQuery = {
  search?: string;
  limit?: string;
  sort?: 'name' | 'recent';
};
export type CreateBillingGroupResponse = BillingGroup;
export type CreateBillingGroupRequest = {
  name: string;
  billingContactId: string;
  notes?: string;
};
export type GetBillingGroupParameters = {
  id: string;
};
export type GetBillingGroupResponse = BillingGroup;
export type RemoveBillingGroupParameters = {
  id: string;
};
export type UpdateBillingGroupParameters = {
  id: string;
};
export type UpdateBillingGroupResponse = BillingGroup;
export type UpdateBillingGroupRequest = {
  name?: string;
  billingContactId?: string;
  notes?: string;
};
export type UpdateBillingGroupSubscriptionParameters = {
  id: string;
};
export type UpdateBillingGroupSubscriptionResponse = {
  billingGroup: BillingGroup;
  updatedCommunityIds: string[];
};
export type UpdateBillingGroupSubscriptionRequest = {
  statusValidUntil: string;
  status?: SubscriptionStatus;
  communityIds?: string[];
};
export type GenerateStrengthDiplomaRequest = {
  studentName: string;
  signatureName?: string;
  date: string;
  selectedStrengths: Array<{
    slug: StrengthSlug;
    title: string;
    color: string;
    borderColor: string;
  }>;
  translations: {
    strengthDiploma: string;
    diplomaAwardedTo: string;
    forUsingStrengths: string;
    signature: string;
    date: string;
  };
  paperSize: 'A4' | 'Letter';
  dateFormat: 'DMY' | 'MDY' | 'YMD';
};
export type GenerateGroupStrengthDiplomaParameters = {
  id: string;
};
export type GenerateGroupStrengthDiplomaRequest = {
  signerName: string;
  date: string;
  strength: StrengthSlug;
  translations: {
    strengthDiploma: string;
    diplomaAwardedTo: string;
    forUsingStrengths: string;
    forCompletingStrength: string;
    signature: string;
    date: string;
    strengthTitle: string;
    diploma: string;
  };
  paperSize: 'A4' | 'Letter';
  strengthColor: string;
  strengthBadgeColor: string;
};
export type GetAiGuidanceLogsResponse = {
  items: Array<{
    id: string;
    title: string;
    suggestionText: string;
    createdAt: string;
    action: 'none' | 'action' | 'refresh';
    ageGroup: AgeGroup;
    language: LanguageCode;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
    group: {
      id: string;
      name: string;
    };
    community: {
      id: string;
      name: string;
    };
  }>;
  total: number;
  skip: number;
  limit: number;
};
export type GetAiGuidanceLogsQuery = {
  communityId?: string;
  groupId?: string;
  skip?: string;
  limit?: string;
};
export type GetAiGuidanceLogByIdParameters = {
  id: string;
};
export type GetAiGuidanceLogByIdResponse = {
  id: string;
  title: string;
  suggestionText: string;
  createdAt: string;
  prompt: string;
  response: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
  };
  group: {
    id: string;
    name: string;
  };
  community: {
    id: string;
    name: string;
  };
};
export type UpdateCommunityStatsEvent = CommunityStats;
export type CreateCommunityPostsEvent = Challenge | Moment | SprintResult;

export type UpdateCommunityPostsEvent = Challenge | Moment | SprintResult;

export type DeleteCommunityPostsEvent = {
  id: string;
};
export type PatchHostSprintEvent = {
  players: GroupGamePlayer[];
  sharedStrengths: Array<{
    strength: StrengthSlug;
    from: string;
    to: string;
  }>;
  isCompleted: boolean;
  isEnded: boolean;
  updatedAt: string;
};
export type PatchPlayerSprintEvent = {
  isStarted: boolean;
  isCompleted: boolean;
  isEnded: boolean;
  players: string[];
  updatedAt: string;
};
export type PatchMemoryGameEvent = {
  isEnded: boolean;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  currentPlayer: string;
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type UpdateUiVersionEvent = string;
export type PatchHostQuizEvent = {
  players: GroupGamePlayer[];
  answers: Array<{
    question: string;
    choices: string[];
    player: string;
  }>;
  updatedAt: string;
};
export type PatchPlayerQuizEvent = {
  isStarted?: boolean;
  isCompleted?: boolean;
  isEnded?: boolean;
  canAnswer?: boolean;
  currentQuestion?: string;
};
export type PatchHostGroupGameEvent = {
  players: GroupGamePlayer[];
  updatedAt: string;
};
export type PatchPlayerGroupGameEvent = {
  isStarted: boolean;
  players: string[];
  updatedAt: string;
};
