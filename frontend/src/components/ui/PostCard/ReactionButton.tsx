import {msg} from '@lingui/core/macro';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import clsx from 'clsx';
import {type Reaction} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import {reactionIcons} from '@/helpers/reactions.js';
import {strengthName} from '@/helpers/strengths.js';
import useBreapoint from '@/hooks/useBreakpoint.js';

type Properties = {
  readonly postId?: string;
  readonly commentId?: string;
  readonly usersReaction?: Reaction;
  readonly reactionType: Reaction['type'];
  readonly onAddReaction?: (reaction: Reaction) => void;
  readonly onUpdateReaction?: (existingId: string, reaction: Reaction) => void;
  readonly onRemoveReaction?: (id: string) => void;
};

export default function ReactionButton(properties: Properties) {
  const {_, i18n} = useLingui();
  const {
    postId,
    commentId,
    reactionType,
    usersReaction,
    onAddReaction,
    onUpdateReaction,
    onRemoveReaction,
  } = properties;
  const toasts = useToasts();
  const breakpoint = useBreapoint();

  const state =
    usersReaction &&
    (usersReaction.type === reactionType ? 'active' : 'inactive');

  const buttonSize = breakpoint === 'xs' ? 34 : 45;
  const iconSize = breakpoint === 'xs' ? 24 : 32;
  const marginY = breakpoint === 'xs' ? 5 : 3;

  const addReaction = async () => {
    try {
      let reaction: Reaction | undefined;
      if (postId)
        reaction = await api.createPostReaction(
          {id: postId},
          {type: reactionType},
        );
      if (commentId)
        reaction = await api.createCommentReaction(
          {id: commentId},
          {type: reactionType},
        );
      if (reaction) onAddReaction?.(reaction);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while reacting`),
      });
    }
  };

  const removeReaction = async () => {
    if (!usersReaction) return;
    try {
      await api.removeReaction({id: usersReaction.id});
      onRemoveReaction?.(usersReaction.id);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while removing a reaction`),
      });
    }
  };

  const updateReaction = async () => {
    if (!usersReaction) return;
    try {
      const reaction = await api.updateReaction(
        {id: usersReaction.id},
        {type: reactionType},
      );
      if (reaction) onUpdateReaction?.(usersReaction.id, reaction);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while updating a reaction`),
      });
    }
  };

  return (
    <OverlayTrigger
      overlay={<Tooltip>{strengthName(reactionType, i18n.locale)}</Tooltip>}
    >
      <Button
        style={{
          width: buttonSize,
          height: buttonSize,
          marginTop: marginY,
          marginBottom: marginY,
        }}
        className={clsx('p-0', state !== 'active' && 'bg-transparent border-0')}
        onClick={async () => {
          switch (state) {
            case 'active': {
              void removeReaction();
              break;
            }

            case 'inactive': {
              void updateReaction();
              break;
            }

            case undefined: {
              void addReaction();
              break;
            }
          }
        }}
      >
        <img
          style={{width: iconSize, height: iconSize}}
          src={reactionIcons[reactionType]}
          alt={reactionType}
        />
      </Button>
    </OverlayTrigger>
  );
}
