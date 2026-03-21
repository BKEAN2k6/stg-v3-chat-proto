import {type Schema} from '../../../types/routeconfig.js';
import {UserInfo} from './UserInfo.js';
import {UserImage} from './UserImage.js';
import {Community} from './Community.js';
import {CommunityStats} from './CommunityStats.js';
import {Post} from './Post.js';
import {Challenge} from './Challenge.js';
import {Moment} from './Moment.js';
import {SprintResult} from './SprintResult.js';
import {LessonCompleted} from './LessonCompleted.js';
import {OnboardingCompleted} from './OnboardingCompleted.js';
import {GoalCompleted} from './GoalCompleted.js';
import {StrengthCompleted} from './StrengthCompleted.js';
import {Comment} from './Comment.js';
import {ReactionType} from './ReactionType.js';
import {Reaction} from './Reaction.js';
import {ChallengeData} from './ChallengeData.js';
import {StrengthSlug} from './StrengthSlug.js';
import {Article} from './Article.js';
import {ArticleTranslation} from './ArticleTranslation.js';
import {ArticleCategory} from './ArticleCategory.js';
import {ArticleCategoryTranslation} from './ArticleCategoryTranslation.js';
import {ArticleCategoryListItem} from './ArticleCategoryListItem.js';
import {CoachPost} from './CoachPost.js';
import {CoachPostData} from './CoachPostData.js';
import {ProxyPostData} from './ProxyPostData.js';
import {Notification} from './Notification.js';
import {CommentReactionNotification} from './CommentReactionNotification.js';
import {CommentCommentNotification} from './CommentCommentNotification.js';
import {PostCommentNotification} from './PostCommentNotification.js';
import {PostReactionNotification} from './PostReactionNotification.js';
import {CommunityInvitationNotification} from './CommunityInvitationNotification.js';
import {HostSprint} from './HostSprint.js';
import {ChallengeTheme} from './ChallengeTheme.js';
import {CommunityMemberInvitation} from './CommunityMemberInvitation.js';
import {StrengthGoal} from './StrengthGoal.js';
import {LanguageCode} from './LanguageCode.js';
import {UserRetention} from './UserRetention.js';
import {Group} from './Group.js';
import {AgeGroup} from './AgeGroup.js';
import {ArticleProgressEntry} from './ArticleProgressEntry.js';
import {AnimationImageAsset} from './AnimationImageAsset.js';
import {AnimationAudioAsset} from './AnimationAudioAsset.js';
import {AnimationSegment} from './AnimationSegment.js';
import {AnimationLottie} from './AnimationLottie.js';
import {ArticleChapter} from './ArticleChapter.js';
import {TimelineArticle} from './TimelineArticle.js';
import {TopUsers} from './TopUsers.js';
import {QuestionSet} from './QuestionSet.js';
import {StrengthGroup} from './StrengthGroup.js';
import {GroupGamePlayer} from './GroupGamePlayer.js';
import {NewUsers} from './NewUsers.js';
import {BillingContact} from './BillingContact.js';
import {BillingGroup} from './BillingGroup.js';
import {BillingGroupCommunity} from './BillingGroupCommunity.js';
import {SubscriptionStatus} from './SubscriptionStatus.js';
import {SubscriptionHistoryEntry} from './SubscriptionHistoryEntry.js';
import {AiGuidanceResponse} from './AiGuidanceResponse.js';
import {GroupStats} from './GroupStats.js';

const definitions: Record<string, Schema> = {
  UserInfo,
  UserImage,
  Community,
  CommunityStats,
  Post,
  Challenge,
  Moment,
  SprintResult,
  LessonCompleted,
  OnboardingCompleted,
  GoalCompleted,
  StrengthCompleted,
  Comment,
  ReactionType,
  Reaction,
  ChallengeData,
  StrengthSlug,
  Article,
  ArticleTranslation,
  ArticleCategory,
  ArticleCategoryTranslation,
  ArticleCategoryListItem,
  CoachPost,
  CoachPostData,
  ProxyPostData,
  Notification,
  CommentReactionNotification,
  CommentCommentNotification,
  PostCommentNotification,
  PostReactionNotification,
  HostSprint,
  ChallengeTheme,
  CommunityMemberInvitation,
  CommunityInvitationNotification,
  StrengthGoal,
  LanguageCode,
  UserRetention,
  Group,
  AgeGroup,
  ArticleProgressEntry,
  AnimationImageAsset,
  AnimationAudioAsset,
  AnimationSegment,
  AnimationLottie,
  ArticleChapter,
  TimelineArticle,
  TopUsers,
  QuestionSet,
  StrengthGroup,
  GroupGamePlayer,
  NewUsers,
  BillingContact,
  BillingGroup,
  BillingGroupCommunity,
  SubscriptionStatus,
  SubscriptionHistoryEntry,
  AiGuidanceResponse,
  GroupStats,
} as const;

export default definitions;
