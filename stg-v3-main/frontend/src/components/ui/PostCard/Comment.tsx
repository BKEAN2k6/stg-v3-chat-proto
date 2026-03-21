import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {ButtonGroup, Dropdown, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {ThreeDots} from 'react-bootstrap-icons';
import {useState} from 'react';
import {useLingui} from '@lingui/react';
import {
  type Comment as CommentType,
  type UserInfo,
  type UserImage,
  type Reaction,
} from '@client/ApiTypes';
import api from '@client/ApiClient';
import CommentForm from './CommentForm.js';
import ReactionTrigger from './ReactionTrigger.js';
import ReactionsModal from './ReactionsModal.js';
import ImageGallery from './ImageGallery.js';
import {confirm} from '@/components/ui/confirm.js';
import Avatar from '@/components/ui/Avatar.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {TimeAgoTranslated} from '@/components/TimeAgoTranslated.js';
import {getUniqueReactions, reactionIcons} from '@/helpers/reactions.js';
import {strengthName} from '@/helpers/strengths.js';
import constants from '@/constants.js';
import MediaUpload from '@/components/MediaUpload.js';

type Properties = {
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

export default function Comment(properties: Properties) {
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
  } = properties;
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

  if (!currentUser) {
    return null;
  }

  const userCommunityRole =
    currentUser.communities.find((c) => c.id === currentUser.selectedCommunity)
      ?.role ?? '';

  const canEditOrRemove =
    currentUser.id === createdBy.id ||
    currentUser.roles.includes('super-admin') ||
    ['admin', 'owner'].includes(userCommunityRole);

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

  if (isEditing) {
    return (
      <MediaUpload
        existingImages={commentImages.map((image) => ({
          id: image.id,
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
          color={colorFromId(createdBy.id)}
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
              {canEditOrRemove ? (
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
              ) : null}
            </div>
            <div className="text-body-secondary">
              {(content !== '' || commentImages.length > 0) && (
                <div className="d-flex flex-column gap-2 flex-align-end">
                  <div className="fs-sm">{content}</div>
                  {commentImages && commentImages.length > 0 ? (
                    <ImageGallery images={commentImages} />
                  ) : null}
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
