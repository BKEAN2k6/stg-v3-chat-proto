import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {msg} from '@lingui/macro';
import clsx from 'clsx';
import {type Reaction} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {reactionIcons} from '@/helpers/reactions';
import {strengthName} from '@/helpers/strengths';
import useBreapoint from '@/hooks/useBreakpoint';

type Props = {
  readonly postId?: string;
  readonly commentId?: string;
  readonly usersReaction?: Reaction;
  readonly reactionType: Reaction['type'];
  readonly onAddReaction?: (reaction: Reaction) => void;
  readonly onUpdateReaction?: (existingId: string, reaction: Reaction) => void;
  readonly onRemoveReaction?: (id: string) => void;
};

export default function ReactionButton(props: Props) {
  const {_, i18n} = useLingui();
  const {
    postId,
    commentId,
    reactionType,
    usersReaction,
    onAddReaction,
    onUpdateReaction,
    onRemoveReaction,
  } = props;
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
      await api.removeReaction({id: usersReaction._id});
      onRemoveReaction?.(usersReaction._id);
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
        {id: usersReaction._id},
        {type: reactionType},
      );
      if (reaction) onUpdateReaction?.(usersReaction._id, reaction);
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

            default: {
              void addReaction();
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
