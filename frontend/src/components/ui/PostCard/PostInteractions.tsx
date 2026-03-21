import {Trans, Plural} from '@lingui/react/macro';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Chat} from 'react-bootstrap-icons';
import {useRef, useState} from 'react';
import {useLingui} from '@lingui/react';
import {
  type Reaction as PostType,
  type Comment as CommentType,
} from '@client/ApiTypes';
import CommentForm from './CommentForm.js';
import Comment from './Comment.js';
import ReactionTrigger from './ReactionTrigger.js';
import ReactionsModal from './ReactionsModal.js';
import {strengthName} from '@/helpers/strengths.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {getUniqueReactions, reactionIcons} from '@/helpers/reactions.js';
import MediaUpload from '@/components/MediaUpload.js';

type Properties = {
  readonly postId: string;
  readonly postComments: CommentType[];
  readonly postReactions: PostType[];
};

export default function PostInteractions(properties: Properties) {
  const {i18n} = useLingui();
  const {postComments, postReactions, postId} = properties;

  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [comments, setComments] = useState<CommentType[]>(postComments);
  const [reactions, setReactions] = useState<PostType[]>(postReactions);

  const commentFormReference = useRef<HTMLDivElement>(null);

  const {currentUser} = useCurrentUser();

  const addComment = (newComment: CommentType) => {
    setIsCommentFormVisible(false);
    setComments((currentComments) => [...currentComments, newComment]);
  };

  const addReaction = (newReaction: PostType) => {
    setReactions((currentReactions) => [...currentReactions, newReaction]);
  };

  const updateReaction = (
    existingReactionId: string,
    updatedReaction: PostType,
  ) => {
    setReactions((currentReactions) => {
      return currentReactions.map((reaction) => {
        if (reaction.id === existingReactionId) {
          return {
            ...updatedReaction,
          };
        }

        return reaction;
      });
    });
  };

  const removeReaction = (reactionId: string) => {
    setReactions((currentReactions) =>
      currentReactions.filter((r) => r.id !== reactionId),
    );
  };

  const updateComment = (updatedComment: CommentType) => {
    setComments((currentComments) =>
      currentComments.map((currentComment) =>
        currentComment.id === updatedComment.id
          ? {...currentComment, ...updatedComment}
          : currentComment,
      ),
    );
  };

  const removeComment = (commentId: string) => {
    setComments((currentComments) =>
      currentComments.filter((c) => c.id !== commentId),
    );
  };

  const toggleCommentForm = () => {
    const newState = !isCommentFormVisible;
    setIsCommentFormVisible(newState);
    if (newState) {
      setTimeout(() => {
        if (commentFormReference.current) {
          commentFormReference.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }, 1);
    }
  };

  const showReactionsModal = () => {
    setIsReactionsModalOpen(true);
  };

  const hideReactionsModal = () => {
    setIsReactionsModalOpen(false);
  };

  return (
    <>
      <div className="d-flex flex-row gap-2">
        <div className="d-flex flex-column align-items-start gap-2 w-50">
          <ReactionTrigger
            postId={postId}
            currentUser={currentUser}
            reactions={reactions}
            onAddReaction={addReaction}
            onUpdateReaction={updateReaction}
            onRemoveReaction={removeReaction}
          />
          <div
            className="d-flex align-items-center gap-2 text-body-secondary"
            role="button"
            onClick={showReactionsModal}
          >
            <div className="d-flex gap-1">
              {getUniqueReactions(reactions).map((type) => (
                <OverlayTrigger
                  key={`moment-card-reaction-${type}`}
                  overlay={
                    <Tooltip>
                      {strengthName(type, i18n.locale)} •{' '}
                      {reactions.filter((t) => t.type === type).length}
                    </Tooltip>
                  }
                >
                  <img
                    src={reactionIcons[type]}
                    alt={type}
                    style={{width: 12, height: 12}}
                  />
                </OverlayTrigger>
              ))}
            </div>
            <small>
              <Plural
                value={reactions.length}
                one="# reaction"
                other="# reactions"
              />
            </small>
          </div>
        </div>
        <div className="d-flex flex-column align-items-end gap-2 w-50">
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={toggleCommentForm}
          >
            <Chat />
            <small className="ms-1 fw-semibold">
              <Trans>Comment</Trans>
            </small>
          </Button>
          <div className="d-flex align-items-center gap-2 text-body-secondary">
            <small>
              <Plural
                value={comments.length}
                one="# comment"
                other="# comments"
              />
            </small>
          </div>
        </div>
      </div>

      {comments.length > 0 && (
        <div className="d-flex flex-column gap-3">
          {comments
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((comment) => (
              <Comment
                key={comment.id}
                postId={postId}
                commentId={comment.id}
                content={comment.content}
                createdBy={comment.createdBy}
                createdAt={comment.createdAt}
                commentImages={comment.images}
                commentReactions={comment.reactions}
                onUpdate={updateComment}
                onRemove={removeComment}
              />
            ))}
        </div>
      )}

      {isCommentFormVisible ? (
        <div ref={commentFormReference}>
          <MediaUpload>
            <CommentForm postId={postId} onCreate={addComment} />
          </MediaUpload>
        </div>
      ) : null}
      <ReactionsModal
        isOpen={isReactionsModalOpen}
        reactions={reactions}
        onClose={hideReactionsModal}
      />
    </>
  );
}
