import {ButtonGroup, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {ThreeDots} from 'react-bootstrap-icons';
import {useState} from 'react';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import CommentForm from './CommentForm';
import ReactionTrigger from './ReactionTrigger';
import ReactionsModal from './ReactionsModal';
import ImageGallery from './ImageGallery';
import {confirm} from '@/components/ui/confirm';
import Avatar from '@/components/ui/Avatar';
import {
  type Comment as CommentType,
  type UserInfo,
  type UserImage,
  type Reaction,
} from '@/api/ApiTypes';
import {colorFromId, formatName} from '@/helpers/avatars';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {useCurrentUser} from '@/context/currentUserContext';
import {TimeAgoTranslated} from '@/components/TimeAgoTranslated';
import {getUniqueReactions, reactionIcons} from '@/helpers/reactions';
import {strengthName} from '@/helpers/strengths';
import constants from '@/constants';
import MediaUpload from '@/components/MediaUpload';

type Props = {
  readonly postId: string;
  readonly commentId: string;
  readonly content: string;
  readonly createdBy: UserInfo;
  readonly createdAt: string;
  readonly commentReactions: Reaction[];
  readonly commentImages: UserImage[];

  readonly onUpdate: (comment: CommentType) => void;
  readonly onRemove: (commentId: string) => void;
};

export default function Comment(props: Props) {
  const {_, i18n} = useLingui();
  const {
    postId,
    commentId,
    content,
    createdBy,
    createdAt,
    onUpdate,
    commentReactions,
    commentImages,
    onRemove,
  } = props;
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [reactions, setReactions] = useState<Reaction[]>(commentReactions);

  const toggleCommentEditor = () => {
    setIsEditing(!isEditing);
  };

  const showReactionsModal = () => {
    setIsReactionsModalOpen(true);
  };

  const hideReactionsModal = () => {
    setIsReactionsModalOpen(false);
  };

  const {currentUser} = useCurrentUser();
  const toasts = useToasts();

  const canEditOrRemove =
    currentUser?._id === createdBy._id ||
    currentUser?.roles.includes('super-admin') || // eslint-disable-line @typescript-eslint/prefer-nullish-coalescing
    currentUser?.communities.find(
      (c) => c._id === currentUser.selectedCommunity,
    )?.role === 'admin';

  const handleMomentDelete = async () => {
    const confirmed = await confirm({
      title: _(msg`Remove comment`),
      text: _(
        msg`Are you sure you want to remove this comment. This can't be undone.`,
      ),
      confirm: _(msg`Yes, remove`),
      cancel: _(msg`No, cancel`),
    });

    if (!confirmed) {
      return;
    }

    try {
      await api.removeComment({id: commentId});
      onRemove(commentId);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing the comment`),
      });
    }
  };

  const addReaction = (newReaction: Reaction) => {
    setReactions((currentReactions) => [...currentReactions, newReaction]);
  };

  const updateReaction = (
    existingReactionId: string,
    updatedReaction: Reaction,
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

  if (isEditing) {
    return (
      <MediaUpload
        existingImages={commentImages.map((image) => ({
          id: image._id,
          previewUrl: `${constants.FILE_HOST}${image.resizedImageUrl}`,
        }))}
      >
        <CommentForm
          className="w-100"
          postId={postId}
          existingCommentId={commentId}
          existingCommentText={content}
          onUpdate={(comment: CommentType) => {
            onUpdate?.(comment);
            toggleCommentEditor();
          }}
          onCancelEdit={() => {
            toggleCommentEditor();
          }}
        />
      </MediaUpload>
    );
  }

  return (
    <>
      <div className="d-flex">
        <Avatar
          size={32}
          name={formatName(createdBy)}
          color={colorFromId(createdBy._id)}
          path={createdBy.avatar}
        />
        <div className="w-100 ms-2" style={{minWidth: 0}}>
          <div className="p-2 bg-gray-100 w-100 rounded">
            <div className="d-flex gap-1 w-100">
              <span className="fw-semibold text-truncate">
                {formatName(createdBy)}
              </span>
              <span className="text-body-secondary">•</span>
              <span className="small text-body-secondary text-truncate">
                <TimeAgoTranslated date={createdAt} />
              </span>
              {canEditOrRemove && (
                <div className="flex-fill">
                  <div className="float-end" style={{marginTop: -4}}>
                    <Dropdown as={ButtonGroup}>
                      <Dropdown.Toggle
                        variant="secondary"
                        className="hide-icon bg-body-tertiary text-black-50 py-0 pe-0"
                        style={{border: 'none'}}
                      >
                        <ThreeDots />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={toggleCommentEditor}>
                          <Trans>Edit</Trans>
                        </Dropdown.Item>
                        <Dropdown.Item onClick={handleMomentDelete}>
                          <Trans>Remove</Trans>
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              )}
            </div>
            <div className="text-body-secondary">
              {(content !== '' || commentImages.length > 0) && (
                <div className="d-flex flex-column gap-2 flex-align-end">
                  <div className="fs-sm">{content}</div>
                  {commentImages && commentImages.length > 0 && (
                    <ImageGallery images={commentImages} />
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="mt-2 text-body-secondary d-flex align-items-center gap-2">
            <ReactionTrigger
              commentId={commentId}
              reactions={reactions}
              currentUser={currentUser}
              onAddReaction={addReaction}
              onUpdateReaction={updateReaction}
              onRemoveReaction={removeReaction}
            />
            {reactions.length > 0 && (
              <>
                <span>•</span>
                <div
                  className="d-flex gap-1"
                  role="button"
                  onClick={showReactionsModal}
                >
                  {getUniqueReactions(reactions).map((type, index) => (
                    <OverlayTrigger
                      key={`moment-card-reaction-${type}`}
                      overlay={
                        <Tooltip>{strengthName(type, i18n.locale)}</Tooltip>
                      }
                    >
                      <img
                        key={type}
                        src={reactionIcons[type]}
                        alt={type}
                        style={{
                          width: 12,
                          height: 12,
                          marginLeft: index > 0 ? -8 : 0,
                        }}
                      />
                    </OverlayTrigger>
                  ))}
                </div>
                <small>{reactions.length}</small>
              </>
            )}
          </div>
        </div>
      </div>
      <ReactionsModal
        isOpen={isReactionsModalOpen}
        reactions={reactions}
        onClose={hideReactionsModal}
      />
    </>
  );
}
