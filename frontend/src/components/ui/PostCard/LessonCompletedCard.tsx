import {
  type UserInfo,
  type Comment,
  type Reaction,
  type StrengthSlug,
  type ArticleChapter,
  type Group,
} from '@client/ApiTypes';
import PostInteractions from './PostInteractions.js';
import UserPostHeader from './UserPostHeader.js';
import LessonCompletedContent from './LessonCompletedContent.js';

type Properties = {
  readonly postId: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly strength: StrengthSlug;
  readonly chapter: ArticleChapter;
  readonly group: Group;
  readonly comments: Comment[];
  readonly reactions: Reaction[];
  readonly onDelete: (challengeId: string) => void;
  readonly onClose?: () => void;
};

export default function LessonCompletedCard(properties: Properties) {
  const {
    postId,
    createdBy,
    createdAt,
    strength,
    chapter,
    group,
    comments,
    reactions,
    onDelete,
    onClose,
  } = properties;

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <UserPostHeader
        postId={postId}
        createdBy={createdBy}
        createdAt={createdAt}
        onDelete={onDelete}
        onClose={onClose}
      />
      <LessonCompletedContent
        strength={strength}
        chapter={chapter}
        group={group}
      />
      <PostInteractions
        postId={postId}
        postComments={comments}
        postReactions={reactions}
      />
    </div>
  );
}
