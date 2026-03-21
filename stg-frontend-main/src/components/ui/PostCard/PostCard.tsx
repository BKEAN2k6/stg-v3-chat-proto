import MomentCard from './MomentCard';
import ChallengeCard from './ChallengeCard';
import SprintResultsCard from './SprintResultsCard';
import CoachPostCard from './CoachPostCard';
import {type Post, type Moment} from '@/api/ApiTypes';

type Props = {
  readonly post: Post;
  readonly onDelete: (momentId: string) => void;
  readonly onUpdate: (moment: Moment) => void;
  readonly onClose?: () => void;
};

export default function PostCard({post, onDelete, onUpdate, onClose}: Props) {
  const {_id, comments, reactions, createdAt, postType} = post;

  switch (postType) {
    case 'moment': {
      const {content, images, strengths, createdBy, isReference} = post;
      return (
        <MomentCard
          key={_id}
          momentId={_id}
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
          key={_id}
          challengeId={_id}
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
          key={post._id}
          sprintResultId={_id}
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
          key={_id}
          postId={_id}
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

    default: {
      return null;
    }
  }
}
