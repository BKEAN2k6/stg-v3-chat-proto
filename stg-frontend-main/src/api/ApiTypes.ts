// This file is auto-generated

export type UserInfo = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};
export type UserImage = {
  _id: string;
  originalImageUrl: string;
  resizedImageUrl: string;
  thumbnailImageUrl: string;
  aspectRatio: number;
};
export type Community = {
  _id: string;
  name: string;
  description: string;
  language: 'en' | 'fi' | 'sv';
  avatar?: string;
  timezone: string;
};
export type CommunityStats = {
  topStrengths: Array<{
    strength: StrengthSlug;
    count: number;
  }>;
  leaderboard: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
    count: number;
  }>;
  moodMeter: Array<{
    mood: number;
    count: number;
  }>;
};
export type Post = Challenge | CoachPost | Moment | SprintResult;
export type Challenge = {
  _id: string;
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
  _id: string;
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
  _id: string;
  createdBy: UserInfo;
  comments: Comment[];
  reactions: Reaction[];
  createdAt: string;
  updatedAt: string;
  postType: 'sprint-result';
  strengths: Array<{
    strength: StrengthSlug;
    count: number;
  }>;
};
export type Comment = {
  _id: string;
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
  _id: string;
  createdBy: UserInfo;
  type: ReactionType;
  createdAt: string;
};
export type ChallengeData = {
  _id: string;
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
  _id: string;
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
    _id: string;
    translations: Array<{
      language: string;
      name: string;
    }>;
  }>;
  isHidden: boolean;
  isLocked: boolean;
};
export type ArticleTranslation = {
  language: 'fi' | 'en' | 'sv';
  title: string;
  description: string;
  content: string[];
};
export type ArticleCategory = {
  _id: string;
  subCategories: ArticleCategory[];
  thumbnail: string;
  displayAs: 'list' | 'grid';
  translations: ArticleCategoryTranslation[];
  order: number;
  articles: Array<{
    _id: string;
    translations: Array<{
      language: string;
      title: string;
      description: string;
    }>;
    order: number;
    thumbnail: string;
    length: string;
    strengths: StrengthSlug[];
    isHidden: boolean;
    isLocked: boolean;
  }>;
  categoryPath: Array<{
    _id: string;
    translations: Array<{
      language: string;
      name: string;
    }>;
  }>;
  isHidden: boolean;
  isLocked: boolean;
};
export type ArticleCategoryTranslation = {
  language: 'fi' | 'en' | 'sv';
  name: string;
  description: string;
};
export type ArticleCategoryListItem = {
  _id: string;
  rootCategory: string;
  parentCategory?: string;
  thumbnail: string;
  displayAs: 'list' | 'grid';
  translations: Array<{
    language: string;
    name: string;
    description: string;
  }>;
  order: number;
  subCategories: ArticleCategoryListItem[];
  articles: Array<{
    _id: string;
    category: string;
    rootCategory: string;
    translations: Array<{
      language: string;
      title: string;
      description: string;
    }>;
    order: number;
  }>;
  isHidden: boolean;
  isLocked: boolean;
};
export type StrengthPeriod = {
  timeline: Array<{
    _id: string;
    start: string;
    articleId: string;
    rootCategoryId: string;
  }>;
  strength: StrengthSlug;
  _id: string;
};
export type CoachPost = {
  _id: string;
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
  _id: string;
  createdAt: string;
  updatedAt: string;
  translations: {
    fi: string;
    en: string;
    sv: string;
  };
  showDate: string;
  images: UserImage[];
  strengths: StrengthSlug[];
  postType: 'coach-post';
};
export type ProxyPostData = ChallengeData | CoachPostData;
export type Notification =
  | PostReactionNotification
  | PostCommentNotification
  | CommentReactionNotification
  | CommentCommentNotification;
export type CommentReactionNotification = {
  _id: string;
  notificationType: 'comment-reaction-notification';
  isRead: boolean;
  actor: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetComment: {
    _id: string;
    content: string;
  };
  targetPost: {
    _id: string;
  };
  createdAt: string;
};
export type CommentCommentNotification = {
  _id: string;
  notificationType: 'comment-comment-notification';
  isRead: boolean;
  actor: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetComment: {
    _id: string;
    content: string;
  };
  targetPost: {
    _id: string;
  };
  comment: {
    _id: string;
    content: string;
  };
  createdAt: string;
};
export type PostCommentNotification = {
  _id: string;
  notificationType: 'post-comment-notification';
  isRead: boolean;
  actor: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetPost: {
    _id: string;
    postType: 'moment' | 'sprint-result';
    content?: string;
  };
  createdAt: string;
};
export type PostReactionNotification = {
  _id: string;
  notificationType: 'post-reaction-notification';
  isRead: boolean;
  actor: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
  targetPost: {
    _id: string;
    postType: 'moment' | 'sprint-result';
    content?: string;
  };
  createdAt: string;
};
export type HostSprint = {
  _id: string;
  code: string;
  isStarted: boolean;
  isCompleted: boolean;
  isEnded: boolean;
  expectedStrengthCount: number;
  players: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
  sharedStrengths: Array<{
    strength: StrengthSlug;
    from: string;
    to: string;
  }>;
};
export type ChallengeTheme = 'default' | 'holiday-calendar';
export type LoginRequest = {
  email: string;
  password: string;
  invitationCode?: string;
};
export type MagicLoginResponse = {
  allowPasswordChange?: boolean;
};
export type MagicLoginRequest = {
  token: string;
};
export type EmailAuthResponse = {
  success: boolean;
  code: string;
};
export type EmailAuthRequest = {
  destination: string;
  firstName?: string;
  lastName?: string;
  language?: 'en' | 'fi' | 'sv';
  invitationCode?: string;
  isRegistration?: boolean;
  resetPassword?: boolean;
};
export type CodeAuthRequest = {
  invitationCode: string;
  email: string;
  firstName: string;
  lastName: string;
  language: 'en' | 'fi' | 'sv';
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
export type CreateUserResponse = {
  success: boolean;
};
export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  language: 'en' | 'fi' | 'sv';
};
export type GetUsersResponse = Array<{
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: 'en' | 'fi' | 'sv';
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
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: 'en' | 'fi' | 'sv';
  roles: Array<'super-admin'>;
  communities: Array<{
    _id: string;
    name: string;
    avatar: string;
    role: 'admin' | 'member';
    memberCount: number;
  }>;
  selectedCommunity: string;
};
export type UpdateMeResponse = {
  selectedCommunity: string;
  firstName: string;
  lastName: string;
  language: 'en' | 'fi' | 'sv';
  avatar: string;
};
export type UpdateMeRequest = {
  selectedCommunity?: string;
  firstName?: string;
  lastName?: string;
  language?: 'en' | 'fi' | 'sv';
  password?: string;
  newPassword?: string;
  avatar?: string;
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
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  language: 'en' | 'fi' | 'sv';
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
  language: 'en' | 'fi' | 'sv';
  isEmailVerified: boolean;
  roles: Array<'super-admin'>;
};
export type UpdateUserRequest = {
  firstName?: string;
  lastName?: string;
  email?: string;
  language?: 'en' | 'fi' | 'sv';
  isEmailVerified?: boolean;
  password?: string;
  roles?: Array<'super-admin'>;
};
export type GetUserCommunitiesParameters = {
  id: string;
};
export type GetUserCommunitiesResponse = Array<{
  _id: string;
  name: string;
  role: 'admin' | 'member';
}>;
export type UpdateMeAvatarResponse = {
  avatar: string;
};
export type GetMyNotificationsResponse = Array<
  | CommentReactionNotification
  | CommentCommentNotification
  | PostCommentNotification
  | PostReactionNotification
>;
export type UpdateMyNotificationsReadRequest = {
  date: string;
};
export type CreateMyCommunityJoinRequest = {
  code: string;
};
export type GetGroupParameters = {
  id: string;
};
export type GetGroupResponse = {
  _id: string;
  name: string;
  description: string;
};
export type UpdateGroupParameters = {
  id: string;
};
export type UpdateGroupResponse = {
  _id: string;
  name: string;
  description: string;
};
export type UpdateGroupRequest = {
  name: string;
  description: string;
};
export type CreateSprintPlayerParameters = {
  id: string;
};
export type CreateSprintPlayerResponse = {
  _id: string;
  nickname: string;
  avatar: string;
  color: string;
};
export type CreateSprintPlayerRequest = {
  nickname: string;
  avatar: string;
  color: string;
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
  isStarted?: boolean;
  isEnded?: boolean;
};
export type GetSprintWithCodeParameters = {
  code: string;
};
export type GetSprintWithCodeResponse = {
  _id: string;
  isRegistered: boolean;
};
export type GetPlayerSprintParameters = {
  id: string;
};
export type GetPlayerSprintResponse = {
  _id: string;
  room: Array<{
    _id: string;
    nickname: string;
    avatar: string;
    color: string;
    strength?: StrengthSlug;
  }>;
  players: string[];
  isStarted: boolean;
  isEnded: boolean;
  isCompleted: boolean;
  player: {
    _id: string;
    nickname: string;
    avatar: string;
    color: string;
  };
  receivedStrengths: Array<{
    from: {
      nickname: string;
      _id: string;
    };
    strength: StrengthSlug;
  }>;
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
export type RemoveSprintPlayerParameters = {
  id: string;
  playerId: string;
};
export type GetCommunitiesResponse = Community[];
export type GetCommunitiesQuery = {
  search?: string;
  limit?: string;
  skip?: string;
  sort?: string;
};
export type CreateCommunityResponse = Community;
export type CreateCommunityRequest = {
  name: string;
  description: string;
  language: 'en' | 'fi' | 'sv';
  timezone: string;
};
export type CreateCommunityInvitationParameters = {
  id: string;
};
export type CreateCommunityInvitationResponse = {
  _id: string;
  code?: string;
  createdAt: string;
};
export type CreateCommunityInvitationRequest = Record<string, unknown>;
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
  language?: 'en' | 'fi' | 'sv';
  avatar?: string;
  timezone?: string;
};
export type UpdateCommunityAvatarParameters = {
  id: string;
};
export type UpdateCommunityAvatarResponse = {
  avatar: string;
};
export type GetCommunityGroupsParameters = {
  id: string;
};
export type GetCommunityGroupsResponse = Array<{
  _id: string;
  name: string;
  description: string;
}>;
export type CreateCommunityGroupParameters = {
  id: string;
};
export type CreateCommunityGroupResponse = {
  _id: string;
  name: string;
  description: string;
};
export type CreateCommunityGroupRequest = {
  name: string;
  description: string;
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
  Challenge | Moment | SprintResult | CoachPost
>;
export type GetCommunityPostsQuery = {
  startDate?: string;
  limit?: string;
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
  role: 'member' | 'admin';
};
export type RemoveCommunityMemberParameters = {
  id: string;
  userId: string;
};
export type GetCommunityMembersParameters = {
  id: string;
};
export type GetCommunityMembersResponse = Array<{
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  language: 'en' | 'fi' | 'sv';
  role: 'member' | 'admin';
}>;
export type CreateUserToCommunityParameters = {
  id: string;
};
export type CreateUserToCommunityRequest = {
  destination: string;
  firstName: string;
  lastName: string;
  role: 'member' | 'admin';
  language: 'en' | 'fi' | 'sv';
};
export type GetCommunityStatsParameters = {
  id: string;
};
export type GetCommunityStatsResponse = CommunityStats;
export type CreateCommunityMoodParameters = {
  id: string;
};
export type CreateCommunityMoodResponse = Array<{
  mood: number;
  count: number;
}>;
export type CreateCommunityMoodRequest = {
  mood: 1 | 2 | 3 | 4 | 5;
};
export type CreateCommunitySprintParameters = {
  id: string;
};
export type CreateCommunitySprintResponse = {
  _id: string;
  code: string;
};
export type GetCommunityProxyPostParameters = {
  id: string;
  postId: string;
};
export type GetCommunityProxyPostResponse =
  | Challenge
  | Moment
  | SprintResult
  | CoachPost;
export type GetCommunityInvitationWithCodeParameters = {
  code: string;
};
export type GetCommunityInvitationWithCodeResponse = {
  _id: string;
  name: string;
  avatar: string;
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
export type GetPostResponse = Challenge | Moment | SprintResult | CoachPost;
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
export type UpdateChallengeResponse = ChallengeData;
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
export type UpdateCoachPostResponse = CoachPostData;
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
export type CreateArticleResponse = Article;
export type CreateArticleRequest = {
  _id?: string;
  translations: Array<{
    language: 'fi' | 'en' | 'sv';
    title: string;
    description: string;
    content: string[];
  }>;
  thumbnail?: string;
  length: string;
  strengths: StrengthSlug[];
  category: string;
  order: number;
  isHidden: boolean;
  isLocked: boolean;
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
  _id?: string;
  translations?: Array<{
    language: 'fi' | 'en' | 'sv';
    title: string;
    description: string;
    content: string[];
  }>;
  thumbnail?: string;
  length?: string;
  strengths?: StrengthSlug[];
  category?: string;
  order?: number;
  isHidden?: boolean;
  isLocked?: boolean;
};
export type RemoveArticleParameters = {
  id: string;
};
export type GetArticleCategoriesResponse = ArticleCategoryListItem[];
export type CreateArticleCategoryResponse = ArticleCategory;
export type CreateArticleCategoryRequest = {
  translations: Array<{
    language: 'en' | 'fi' | 'sv';
    description: string;
    name: string;
  }>;
  parentCategory?: string;
  thumbnail?: string;
  displayAs: 'list' | 'grid';
  order: number;
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
    language: 'en' | 'fi' | 'sv';
    description: string;
    name: string;
  }>;
  parentCategory?: string;
  thumbnail?: string;
  displayAs?: 'list' | 'grid';
  order?: number;
  isHidden?: boolean;
  isLocked?: boolean;
};
export type RemoveArticleCategoryParameters = {
  id: string;
};
export type GetStrengthPeriodsResponse = StrengthPeriod[];
export type CreateStrengthPeriodResponse = StrengthPeriod;
export type CreateStrengthPeriodRequest = {
  timeline: Array<{
    start: string;
    articleId: string;
  }>;
  strength: StrengthSlug;
};
export type RemoveStrengthPeriodParameters = {
  id: string;
};
export type UpdateStrengthPeriodParameters = {
  id: string;
};
export type UpdateStrengthPeriodResponse = StrengthPeriod;
export type UpdateStrengthPeriodRequest = {
  strength?: StrengthSlug;
  timeline?: Array<{
    start: string;
    articleId: string;
  }>;
};
export type GetClicksResponse = Array<{
  app: string;
  page: string;
  path: string;
  community: string;
  element: string;
  count: number;
  date: string;
}>;
export type GetClicksQuery = {
  format?: 'csv';
};
export type CreateClickRequest = {
  app: string;
  page: string;
  path: string;
  community: string;
  element: string;
};
export type GetPageViewsResponse = Array<{
  app: string;
  page: string;
  path: string;
  community: string;
  count: number;
  date: string;
}>;
export type GetPageViewsQuery = {
  format?: 'csv';
};
export type CreatePageViewRequest = {
  app: string;
  page: string;
  path: string;
  community: string;
};
export type GetDailyActiveUsersResponse = Array<{
  app: string;
  community: string;
  count: number;
  retention: number;
  communityUserCount: number;
  date: string;
}>;
export type GetDailyActiveUsersQuery = {
  format?: 'csv';
};
export type GetWeeklyActiveUsersResponse = Array<{
  app: string;
  community: string;
  count: number;
  retention: number;
  communityUserCount: number;
  date: string;
}>;
export type GetWeeklyActiveUsersQuery = {
  format?: 'csv';
};
export type GetMonthlyActiveUsersResponse = Array<{
  app: string;
  community: string;
  count: number;
  retention: number;
  communityUserCount: number;
  date: string;
}>;
export type GetMonthlyActiveUsersQuery = {
  format?: 'csv';
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
  _id: string;
};
export type CreateMemoryGameRequest = {
  numberOfCards: 16 | 36;
};
export type CreateMemoryGamePlayerParameters = {
  id: string;
};
export type CreateMemoryGamePlayerResponse = {
  _id: string;
  nickname: string;
  color: string;
};
export type CreateMemoryGamePlayerRequest = {
  nickname: string;
  color: string;
};
export type GetHostMemoryGameParameters = {
  id: string;
};
export type GetHostMemoryGameResponse = {
  _id: string;
  isStarted: boolean;
  isEnded: boolean;
  code: string;
  cards: Array<{
    _id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  players: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
  currentPlayer?: string;
};
export type UpdateMemoryGameParameters = {
  id: string;
};
export type UpdateMemoryGameResponse = {
  _id: string;
  isStarted: boolean;
  isEnded: boolean;
  code: string;
  cards: Array<{
    _id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  players: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
  currentPlayer?: string;
};
export type UpdateMemoryGameRequest = {
  isStarted?: boolean;
  isEnded?: boolean;
};
export type GetMemoryGameWithCodeParameters = {
  code: string;
};
export type GetMemoryGameWithCodeResponse = {
  _id: string;
  isRegistered: boolean;
};
export type GetPlayerMemoryGameParameters = {
  id: string;
};
export type GetPlayerMemoryGameResponse = {
  _id: string;
  isStarted: boolean;
  isEnded: boolean;
  cards: Array<{
    _id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards: string[];
  foundPairs: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  player: {
    _id: string;
    nickname: string;
    color: string;
  };
  players: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
  currentPlayer?: string;
};
export type CreateMemoryGamePickParameters = {
  id: string;
};
export type CreateMemoryGamePickRequest = {
  cardId: string;
};
export type RemoveMemoryGamePlayerParameters = {
  id: string;
  playerId: string;
};
export type UpdateCommunityStatsEvent = CommunityStats;
export type CreateCommunityPostsEvent = Challenge | Moment | SprintResult;

export type UpdateCommunityPostsEvent = Challenge | Moment | SprintResult;

export type DeleteCommunityPostsEvent = {
  _id: string;
};
export type PatchHostSprintEvent = {
  players?: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
  sharedStrengths?: Array<{
    strength: StrengthSlug;
    from: string;
    to: string;
  }>;
  isCompleted?: boolean;
};
export type PatchPlayerSprintEvent = {
  isStarted?: boolean;
  isCompleted?: boolean;
  isEnded?: boolean;
  players?: string[];
};
export type PatchMemoryGameEvent = {
  isStarted?: boolean;
  isEnded?: boolean;
  cards?: Array<{
    _id: string;
    strength: StrengthSlug;
  }>;
  currentlyRevealedCards?: string[];
  foundPairs?: Array<{
    player: string;
    card1: string;
    card2: string;
  }>;
  currentPlayer?: string;
  players?: Array<{
    _id: string;
    nickname: string;
    color: string;
  }>;
};
