import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Chat} from 'react-bootstrap-icons';
import {useRef, useState} from 'react';
import {Trans, Plural} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import ReactionTrigger from './ReactionTrigger';
import ReactionsModal from './ReactionsModal';
import {strengthName} from '@/helpers/strengths';
import {
  type Reaction as PostType,
  type Comment as CommentType,
} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';
import {getUniqueReactions, reactionIcons} from '@/helpers/reactions';
import MediaUpload from '@/components/MediaUpload';

type Props = {
  readonly postId: string;
  readonly postComments: CommentType[];
  readonly postReactions: PostType[];
};

export default function PostInteractions(props: Props) {
  const {i18n} = useLingui();
  const {postComments, postReactions, postId} = props;

  const [isCommentFormVisible, setIsCommentFormVisible] = useState(false);
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [comments, setComments] = useState<CommentType[]>(postComments);
  const [reactions, setReactions] = useState<PostType[]>(postReactions);

  const commentFormRef = useRef<HTMLDivElement>(null);

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
        if (reaction._id === existingReactionId) {
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
      currentReactions.filter((r) => r._id !== reactionId),
    );
  };

  const updateComment = (updatedComment: CommentType) => {
    setComments((currentComments) =>
      currentComments.map((currentComment) =>
        currentComment._id === updatedComment._id
          ? {...currentComment, ...updatedComment}
          : currentComment,
      ),
    );
  };

  const removeComment = (commentId: string) => {
    setComments((currentComments) =>
      currentComments.filter((c) => c._id !== commentId),
    );
  };

  const toggleCommentForm = () => {
    const newState = !isCommentFormVisible;
    setIsCommentFormVisible(newState);
    if (newState) {
      setTimeout(() => {
        if (commentFormRef.current) {
          commentFormRef.current.scrollIntoView({
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
                key={comment._id}
                postId={postId}
                commentId={comment._id}
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

      {isCommentFormVisible && (
        <div ref={commentFormRef}>
          <MediaUpload>
            <CommentForm postId={postId} onCreate={addComment} />
          </MediaUpload>
        </div>
      )}
      <ReactionsModal
        isOpen={isReactionsModalOpen}
        reactions={reactions}
        onClose={hideReactionsModal}
      />
    </>
  );
}
