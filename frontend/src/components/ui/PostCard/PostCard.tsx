import {type Post, type Moment} from '@client/ApiTypes';
import MomentCard from './MomentCard.js';
import ChallengeCard from './ChallengeCard.js';
import SprintResultsCard from './SprintResultsCard.js';
import CoachPostCard from './CoachPostCard.js';
import LessonCompletedCard from './LessonCompletedCard.js';
import OnboardingCompletedCard from './OnboardingCompletedCard.js';
import GoalCompletedCard from './GoalCompletedCard.js';
import StrengthCompletedCard from './StrengthCompletedCard.js';

type Properties = {
  readonly post: Post;
  readonly onDelete: (momentId: string) => void;
  readonly onUpdate: (moment: Moment) => void;
  readonly onClose?: () => void;
};

export default function PostCard({
  post,
  onDelete,
  onUpdate,
  onClose,
}: Properties) {
  const {id, comments, reactions, createdAt, postType} = post;

  switch (postType) {
    case 'moment': {
      const {content, images, strengths, createdBy, isReference} = post;
      return (
        <MomentCard
          key={id}
          momentId={id}
          content={content}
          images={images}
          strengths={strengths}
          createdBy={createdBy}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          isReference={isReference ?? false}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'challenge': {
      const {participations, translations, theme} = post;
      return (
        <ChallengeCard
          key={id}
          challengeId={id}
          comments={comments}
          reactions={reactions}
          createdAt={createdAt}
          participants={participations}
          translations={translations}
          theme={theme}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'sprint-result': {
      const {createdBy, strengths} = post;
      return (
        <SprintResultsCard
          key={post.id}
          sprintResultId={id}
          createdBy={createdBy}
          createdAt={createdAt}
          strengths={strengths}
          comments={comments}
          reactions={reactions}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'coach-post': {
      const {translations, images, strengths} = post;
      return (
        <CoachPostCard
          key={id}
          postId={id}
          translations={translations}
          images={images}
          strengths={strengths}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'lesson-completed': {
      const {
        strength,
        chapter,
        group,
        createdBy,
        createdAt,
        comments,
        reactions,
      } = post;
      return (
        <LessonCompletedCard
          key={id}
          createdBy={createdBy}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          postId={id}
          strength={strength}
          chapter={chapter}
          group={group}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'goal-completed': {
      const {
        strength,
        group,
        completedCount,
        createdBy,
        createdAt,
        comments,
        reactions,
      } = post;
      return (
        <GoalCompletedCard
          key={id}
          postId={id}
          createdBy={createdBy}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          strength={strength}
          groupName={group.name}
          completedCount={completedCount}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'onboarding-completed': {
      const {createdBy, createdAt, comments, reactions} = post;
      return (
        <OnboardingCompletedCard
          key={id}
          createdBy={createdBy}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          postId={id}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }

    case 'strength-completed': {
      const {strength, group, createdBy, createdAt, comments, reactions} = post;
      return (
        <StrengthCompletedCard
          key={id}
          postId={id}
          createdBy={createdBy}
          createdAt={createdAt}
          comments={comments}
          reactions={reactions}
          strength={strength}
          group={group}
          onDelete={onDelete}
          onClose={onClose}
        />
      );
    }
  }
}
