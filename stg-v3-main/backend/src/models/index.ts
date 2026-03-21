import {
  getModelForClass,
  getDiscriminatorModelForClass,
} from '@typegoose/typegoose';
import {AclItem} from './AclItem.js';
import {User} from './User.js';
import {Group} from './Group.js';
import {Community} from './Community.js';
import {Sprint} from './GroupGame/Sprint.js';
import {GroupGame} from './GroupGame/GroupGame.js';
import {CommunityInvitation} from './CommunityInvitation.js';
import {Post} from './Post/Post.js';
import {Moment} from './Post/Moment.js';
import {Challenge} from './Post/Challenge.js';
import {ChallengeParticipation} from './ChallengeParticipation.js';
import {SprintResult} from './Post/SprintResult.js';
import {LessonCompleted} from './Post/LessonCompleted.js';
import {OnboardingCompleted} from './Post/OnboardingCompleted.js';
import {GoalCompleted} from './Post/GoalCompleted.js';
import {StrengthCompleted} from './Post/StrengthCompleted.js';
import {UserImage} from './UserImage.js';
import {Comment} from './Comment.js';
import {CommunityMembership} from './CommunityMembership.js';
import {Reaction} from './Reaction.js';
import {Article, ArticleTranslation} from './Article.js';
import {
  ArticleCategory,
  ArticleCategoryTranslation,
} from './ArticleCategory.js';
import {ProxyPost} from './Post/ProxyPost.js';
import {CoachPost} from './Post/CoachPost.js';
import {Notification} from './Notification/Notification.js';
import {PostReactionNotification} from './Notification/PostReactionNotification.js';
import {PostCommentNotification} from './Notification/PostCommentNotification.js';
import {CommentReactionNotification} from './Notification/CommentReactionNotification.js';
import {CommentCommentNotification} from './Notification/CommentCommentNotification.js';
import {MemoryGame} from './GroupGame/MemoryGame.js';
import {CommunityMemberInvitation} from './CommunityMemberInvitation.js';
import {CommunityInvitationNotification} from './Notification/CommunityInvitationNotification.js';
import {TranslationJob} from './TranslationJob.js';
import {StrengthGoal} from './StrengthGoal.js';
import {AnimationProject} from './AnimationProject.js';
import {Quiz} from './GroupGame/Quiz.js';
import {QuizQuestion} from './QuizQuestion.js';
import {QuizQuestionSet} from './QuizQuestionSet.js';
import {QuestionSetStats} from './QuestionSetStats.js';
import {VideoProcessingJob} from './VideoProcessingJob.js';
import {BillingContact} from './BillingContact.js';
import {BillingGroup} from './BillingGroup.js';
import {AiGuidanceLog} from './AiGuidanceLog.js';
import {JoinCode} from './JoinCode.js';

const AclItemModel = getModelForClass(AclItem);
const GroupModel = getModelForClass(Group);
const CommunityModel = getModelForClass(Community);

// ----- GroupGame root + discriminators -----
const GroupGameModel = getModelForClass(GroupGame);
const MemoryGameModel = getDiscriminatorModelForClass(
  GroupGameModel,
  MemoryGame,
  'memory-game',
);
const QuizModel = getDiscriminatorModelForClass(GroupGameModel, Quiz, 'quiz');
const SprintModel = getDiscriminatorModelForClass(
  GroupGameModel,
  Sprint,
  'sprint',
);
// -------------------------------------------

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
const LessonCompletedModel = getDiscriminatorModelForClass(
  PostModel,
  LessonCompleted,
  'lesson-completed',
);
const GoalCompletedModel = getDiscriminatorModelForClass(
  PostModel,
  GoalCompleted,
  'goal-completed',
);
const OnboardingCompletedModel = getDiscriminatorModelForClass(
  PostModel,
  OnboardingCompleted,
  'onboarding-completed',
);
const StrengthCompletedModel = getDiscriminatorModelForClass(
  PostModel,
  StrengthCompleted,
  'strength-completed',
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

const CommunityInvitationNotificationModel = getDiscriminatorModelForClass(
  NotificationModel,
  CommunityInvitationNotification,
  'community-invitation-notification',
);

const ImageModel = getModelForClass(UserImage);
const CommentModel = getModelForClass(Comment);
const CommunityMembershipModel = getModelForClass(CommunityMembership);
const ReactionModel = getModelForClass(Reaction);
const ArticleModel = getModelForClass(Article);
const ArticleCategoryModel = getModelForClass(ArticleCategory);
const ArticleCategoryTranslationModel = getModelForClass(
  ArticleCategoryTranslation,
);
const ArticleTranslationModel = getModelForClass(ArticleTranslation);
const CommunityMemberInvitationModel = getModelForClass(
  CommunityMemberInvitation,
);
const TranslationJobModel = getModelForClass(TranslationJob);
const StrengthGoalModel = getModelForClass(StrengthGoal);
const AnimationProjectModel = getModelForClass(AnimationProject);
const QuizQuestionModel = getModelForClass(QuizQuestion);
const QuizQuestionSetModel = getModelForClass(QuizQuestionSet);
const QuestionSetStatsModel = getModelForClass(QuestionSetStats);
const VideoProcessingJobModel = getModelForClass(VideoProcessingJob);
const BillingContactModel = getModelForClass(BillingContact);
const BillingGroupModel = getModelForClass(BillingGroup);
const AiGuidanceLogModel = getModelForClass(AiGuidanceLog);
const JoinCodeModel = getModelForClass(JoinCode);

export {
  AclItemModel as AclItem,
  GroupModel as Group,
  CommunityModel as Community,
  GroupGameModel as GroupGame,
  SprintModel as Sprint,
  MemoryGameModel as MemoryGame,
  QuizModel as Quiz,
  UserModel as User,
  CommunityInvitationModel as CommunityInvitation,
  PostModel as Post,
  MomentModel as Moment,
  ChallengeModel as Challenge,
  ChallengeParticipationModel as ChallengeParticipation,
  SprintResultModel as SprintResult,
  LessonCompletedModel as LessonCompleted,
  OnboardingCompletedModel as OnboardingCompleted,
  GoalCompletedModel as GoalCompleted,
  StrengthCompletedModel as StrengthCompleted,
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
  ArticleModel as Article,
  ArticleCategoryModel as ArticleCategory,
  ArticleCategoryTranslationModel as ArticleCategoryTranslation,
  ArticleTranslationModel as ArticleTranslation,
  CommunityMemberInvitationModel as CommunityMemberInvitation,
  CommunityInvitationNotificationModel as CommunityInvitationNotification,
  TranslationJobModel as TranslationJob,
  StrengthGoalModel as StrengthGoal,
  AnimationProjectModel as AnimationProject,
  QuizQuestionModel as QuizQuestion,
  QuizQuestionSetModel as QuizQuestionSet,
  QuestionSetStatsModel as QuestionSetStats,
  VideoProcessingJobModel as VideoProcessingJob,
  BillingContactModel as BillingContact,
  BillingGroupModel as BillingGroup,
  AiGuidanceLogModel as AiGuidanceLog,
  JoinCodeModel as JoinCode,
};
