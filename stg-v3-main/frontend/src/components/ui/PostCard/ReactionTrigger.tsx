import {Trans} from '@lingui/react/macro';
import {Button, Overlay, Tooltip} from 'react-bootstrap';
import {EmojiSmile} from 'react-bootstrap-icons';
import {useEffect, useRef, useState} from 'react';
import {useLingui} from '@lingui/react';
import {
  type UserInfo,
  type Moment,
  type Reaction,
  type LanguageCode,
} from '@client/ApiTypes';
import ReactionButton from './ReactionButton.js';
import {reactionIcons, reactionTypes} from '@/helpers/reactions.js';
import {strengthTranslationMap} from '@/helpers/strengths.js';

type Properties = {
  readonly postId?: string;
  readonly commentId?: string;
  readonly reactions: Moment['reactions'];
  readonly currentUser: UserInfo | undefined;
  readonly onAddReaction?: (reaction: Reaction) => void;
  readonly onUpdateReaction?: (id: string, reaction: Reaction) => void;
  readonly onRemoveReaction?: (id: string) => void;
};

export default function ReactionTrigger(properties: Properties) {
  const {i18n} = useLingui();
  const {
    postId,
    commentId,
    reactions,
    currentUser,
    onAddReaction,
    onUpdateReaction,
    onRemoveReaction,
  } = properties;
  const target = useRef<HTMLButtonElement>(null);
  const [show, setShow] = useState(false);
  const variant = postId ? 'post' : 'comment';

  const usersReaction = reactions.find(
    (reaction) => reaction.createdBy.id === currentUser?.id,
  );

  const toggleOverlay = () => {
    setShow(!show);
  };

  const handleAddReaction = (reaction: Reaction) => {
    onAddReaction?.(reaction);
    setShow(false);
  };

  const handleUpdateReaction = (
    existingReactionId: string,
    reaction: Reaction,
  ) => {
    onUpdateReaction?.(existingReactionId, reaction);
    setShow(false);
  };

  const handleRemoveReaction = (reactionId: string) => {
    onRemoveReaction?.(reactionId);
    setShow(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (target.current && !target.current.contains(event.target as Node)) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [target]);

  return (
    <>
      {
        {
          post: (
            <Button
              ref={target}
              variant={usersReaction ? 'outline-primary' : 'outline-secondary'}
              className="w-100"
              onClick={toggleOverlay}
            >
              {usersReaction ? (
                <>
                  <img
                    src={reactionIcons[usersReaction.type]}
                    alt={usersReaction.type}
                    style={{width: 18, height: 18}}
                  />
                  <small className="ms-1 fw-semibold">
                    {
                      strengthTranslationMap[usersReaction.type][
                        i18n.locale as LanguageCode
                      ]
                    }
                  </small>
                </>
              ) : (
                <>
                  <EmojiSmile />
                  <small className="ms-1 fw-semibold">
                    <Trans>React</Trans>
                  </small>
                </>
              )}
            </Button>
          ),
          comment: (
            <Button
              ref={target}
              variant={usersReaction ? 'outline-primary' : 'outline-secondary'}
              size="sm"
              onClick={toggleOverlay}
            >
              {usersReaction ? (
                <img
                  src={reactionIcons[usersReaction.type]}
                  alt={usersReaction.type}
                  style={{width: 18, height: 18}}
                />
              ) : (
                <small className="fw-semibold">
                  <Trans>React</Trans>
                </small>
              )}
            </Button>
          ),
        }[variant]
      }

      <Overlay target={target.current} show={show}>
        <Tooltip className="reaction-tooltip">
          <div className="d-flex gap-2">
            {reactionTypes.map((reactionType) => (
              <ReactionButton
                key={reactionType}
                reactionType={reactionType}
                postId={postId}
                commentId={commentId}
                usersReaction={usersReaction}
                onAddReaction={handleAddReaction}
                onUpdateReaction={handleUpdateReaction}
                onRemoveReaction={handleRemoveReaction}
              />
            ))}
          </div>
        </Tooltip>
      </Overlay>
    </>
  );
}
