import {useLingui} from '@lingui/react';
import {msg, Trans} from '@lingui/macro';
import Avatar from '../ui/Avatar';
import {colorFromId, formatName} from '@/helpers/avatars';
import {type UserInfo, type Notification} from '@/api/ApiTypes';

function BaseNotification(props: {
  readonly actor: UserInfo;
  readonly icon: 'ChatFill' | 'HandThumbsUpFill';
  readonly children: React.ReactNode;
}) {
  const {actor, icon} = props;

  return (
    <div className="d-flex gap-2">
      <div className="flex-shrink-1">
        <Avatar
          size={50}
          name={formatName(actor)}
          color={colorFromId(actor._id)}
          path={actor.avatar}
          icon={icon}
          marginRight={5}
        />
      </div>
      <div>{props.children}</div>
    </div>
  );
}

type Props = {
  readonly notification: Notification;
};

export default function NotificationsMenuItem({notification}: Props) {
  const {notificationType} = notification;
  const {_} = useLingui();

  switch (notificationType) {
    case 'post-reaction-notification': {
      const {actor, targetPost} = notification;
      const {firstName, lastName} = actor;
      const content =
        targetPost.postType === 'sprint-result'
          ? _(msg`We played a strength sprint! The top strengths were these.`)
          : (targetPost.content ?? '');
      return (
        <BaseNotification actor={actor} icon="HandThumbsUpFill">
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>reacted to your post</Trans>: {content.slice(0, 30)}
          {content.length > 30 && '...'}
        </BaseNotification>
      );
    }

    case 'post-comment-notification': {
      const {actor, targetPost} = notification;
      const {firstName, lastName} = actor;
      const content =
        targetPost.postType === 'sprint-result'
          ? _(msg`We played a strength sprint! The top strengths were these.`)
          : (targetPost.content ?? '');

      return (
        <BaseNotification actor={actor} icon="ChatFill">
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>commented on your post</Trans>: {content.slice(0, 30)}
          {content.length > 30 && '...'}
        </BaseNotification>
      );
    }

    case 'comment-reaction-notification': {
      const {actor, targetComment} = notification;
      const {firstName, lastName} = actor;

      return (
        <BaseNotification actor={actor} icon="HandThumbsUpFill">
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>reacted to your comment</Trans>:{' '}
          {targetComment.content.slice(0, 30)}
          {targetComment.content.length > 30 && '...'}
        </BaseNotification>
      );
    }

    case 'comment-comment-notification': {
      return null;
    }

    default: {
      return null;
    }
  }
}
