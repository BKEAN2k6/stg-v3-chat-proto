import {type Schema} from '../../../types/routeconfig';
import {UserInfo} from './UserInfo';
import {UserImage} from './UserImage';
import {Community} from './Community';
import {CommunityStats} from './CommunityStats';
import {Post} from './Post';
import {Challenge} from './Challenge';
import {Moment} from './Moment';
import {SprintResult} from './SprintResult';
import {Comment} from './Comment';
import {ReactionType} from './ReactionType';
import {Reaction} from './Reaction';
import {ChallengeData} from './ChallengeData';
import {StrengthSlug} from './StrengthSlug';
import {Article} from './Article';
import {ArticleTranslation} from './ArticleTranslation';
import {ArticleCategory} from './ArticleCategory';
import {ArticleCategoryTranslation} from './ArticleCategoryTranslation';
import {ArticleCategoryListItem} from './ArticleCategoryListItem';
import {StrengthPeriod} from './StrengthPeriod';
import {CoachPost} from './CoachPost';
import {CoachPostData} from './CoachPostData';
import {ProxyPostData} from './ProxyPostData';
import {Notification} from './Notification';
import {CommentReactionNotification} from './CommentReactionNotification';
import {CommentCommentNotification} from './CommentCommentNotification';
import {PostCommentNotification} from './PostCommentNotification';
import {PostReactionNotification} from './PostReactionNotification';
import {HostSprint} from './HostSprint';
import {ChallengeTheme} from './ChallengeTheme';

const definitions: Record<string, Schema> = {
  UserInfo,
  UserImage,
  Community,
  CommunityStats,
  Post,
  Challenge,
  Moment,
  SprintResult,
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
  StrengthPeriod,
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
} as const;

export default definitions;
