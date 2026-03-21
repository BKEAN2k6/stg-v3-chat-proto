import {
  getModelForClass,
  getDiscriminatorModelForClass,
} from '@typegoose/typegoose';
import {AclItem} from './AclItem';
import {User} from './User';
import {Group} from './Group';
import {Community} from './Community';
import {Sprint} from './Sprint';
import {CommunityInvitation} from './CommunityInvitation';
import {Post} from './Post/Post';
import {Moment} from './Post/Moment';
import {Challenge} from './Post/Challenge';
import {ChallengeParticipation} from './ChallengeParticipation';
import {SprintResult} from './Post/SprintResult';
import {UserImage} from './UserImage';
import {Comment} from './Comment';
import {CommunityMembership} from './CommunityMembership';
import {Reaction} from './Reaction';
import {ChallengeData} from './ChallengeData';
import {Article, ArticleTranslation} from './Article';
import {ArticleCategory, ArticleCategoryTranslation} from './ArticleCategory';
import {StrenghtPeriod, TimelineItem} from './StrengthPeriod';
import {ProxyPost} from './Post/ProxyPost';
import {CoachPost} from './Post/CoachPost';
import {Click} from './Click';
import {PageView} from './PageView';
import {DailyActiveUsers} from './DailyActiveUsers';
import {WeeklyActiveUsers} from './WeeklyActiveUsers';
import {MonthlyActiveUsers} from './MonthlyActiveUsers';
import {Notification} from './Notification/Notification';
import {PostReactionNotification} from './Notification/PostReactionNotification';
import {PostCommentNotification} from './Notification/PostCommentNotification';
import {CommentReactionNotification} from './Notification/CommentReactionNotification';
import {CommentCommentNotification} from './Notification/CommentCommentNotification';
import {MemoryGame} from './MemoryGame';

const AclItemModel = getModelForClass(AclItem);
const GroupModel = getModelForClass(Group);
const CommunityModel = getModelForClass(Community);
const SprintModel = getModelForClass(Sprint);
const UserModel = getModelForClass(User);
const CommunityInvitationModel = getModelForClass(CommunityInvitation);
const PostModel = getModelForClass(Post);
const MomentModel = getDiscriminatorModelForClass(PostModel, Moment, 'moment');
const ChallengeModel = getDiscriminatorModelForClass(
  PostModel,
  Challenge,
  'challenge',
);
const ChallengeParticipationModel = getModelForClass(ChallengeParticipation);
const SprintResultModel = getDiscriminatorModelForClass(
  PostModel,
  SprintResult,
  'sprint-result',
);
const ProxyPostModel = getDiscriminatorModelForClass(
  PostModel,
  ProxyPost,
  'proxy-post',
);
const CoachPostModel = getDiscriminatorModelForClass(
  PostModel,
  CoachPost,
  'coach-post',
);
const NotificationModel = getModelForClass(Notification);
const PostReactionNotificationModel = getDiscriminatorModelForClass(
  NotificationModel,
  PostReactionNotification,
  'post-reaction-notification',
);
const PostCommentNotificationModel = getDiscriminatorModelForClass(
  NotificationModel,
  PostCommentNotification,
  'post-comment-notification',
);
const CommentReactionNotificationModel = getDiscriminatorModelForClass(
  NotificationModel,
  CommentReactionNotification,
  'comment-reaction-notification',
);
const CommentCommentNotificationModel = getDiscriminatorModelForClass(
  NotificationModel,
  CommentCommentNotification,
  'comment-comment-notification',
);

const ImageModel = getModelForClass(UserImage);
const CommentModel = getModelForClass(Comment);
const CommunityMembershipModel = getModelForClass(CommunityMembership);
const ReactionModel = getModelForClass(Reaction);
const ChallengeDataModel = getModelForClass(ChallengeData);
const ArticleModel = getModelForClass(Article);
const ArticleCategoryModel = getModelForClass(ArticleCategory);
const ArticleCategoryTranslationModel = getModelForClass(
  ArticleCategoryTranslation,
);
const ArticleTranslationModel = getModelForClass(ArticleTranslation);
const StrenghtPeriodModel = getModelForClass(StrenghtPeriod);
const TimelineItemModel = getModelForClass(TimelineItem);
const ClickModel = getModelForClass(Click);
const PageViewModel = getModelForClass(PageView);
const DailyActiveUsersModel = getModelForClass(DailyActiveUsers);
const WeeklyActiveUsersModel = getModelForClass(WeeklyActiveUsers);
const MonthlyActiveUsersModel = getModelForClass(MonthlyActiveUsers);
const MemoryGameModel = getModelForClass(MemoryGame);

export {
  AclItemModel as AclItem,
  GroupModel as Group,
  CommunityModel as Community,
  SprintModel as Sprint,
  UserModel as User,
  CommunityInvitationModel as CommunityInvitation,
  PostModel as Post,
  MomentModel as Moment,
  ChallengeModel as Challenge,
  ChallengeParticipationModel as ChallengeParticipation,
  SprintResultModel as SprintResult,
  ProxyPostModel as ProxyPost,
  CoachPostModel as CoachPost,
  NotificationModel as Notification,
  PostReactionNotificationModel as PostReactionNotification,
  PostCommentNotificationModel as PostCommentNotification,
  CommentReactionNotificationModel as CommentReactionNotification,
  CommentCommentNotificationModel as CommentCommentNotification,
  ImageModel as UserImage,
  CommentModel as Comment,
  CommunityMembershipModel as CommunityMembership,
  ReactionModel as Reaction,
  ChallengeDataModel as ChallengeData,
  ArticleModel as Article,
  ArticleCategoryModel as ArticleCategory,
  ArticleCategoryTranslationModel as ArticleCategoryTranslation,
  ArticleTranslationModel as ArticleTranslation,
  StrenghtPeriodModel as StrenghtPeriod,
  TimelineItemModel as TimelineItem,
  ClickModel as Click,
  PageViewModel as PageView,
  DailyActiveUsersModel as DailyActiveUsers,
  WeeklyActiveUsersModel as WeeklyActiveUsers,
  MonthlyActiveUsersModel as MonthlyActiveUsers,
  MemoryGameModel as MemoryGame,
};
