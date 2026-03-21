import {Trans} from '@lingui/react/macro';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {Dropdown} from 'react-bootstrap';
import {type UserInfo, type Notification} from '@client/ApiTypes';
import {useSearchParams, useNavigate} from 'react-router-dom';
import Avatar from '../ui/Avatar.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';

function BaseNotification(properties: {
  readonly actor: UserInfo;
  readonly icon: 'ChatFill' | 'HandThumbsUpFill' | 'EnvelopePaperFill';
  readonly children: React.ReactNode;
  readonly onClick?: () => void;
}) {
  const {actor, icon, onClick} = properties;

  return (
    <Dropdown.Item
      style={{
        width: '280px',
        whiteSpace: 'wrap',
      }}
      onClick={onClick}
    >
      <div className="d-flex gap-2">
        <div className="flex-shrink-1">
          <Avatar
            size={50}
            name={formatName(actor)}
            color={colorFromId(actor.id)}
            path={actor.avatar}
            icon={icon}
            marginRight={5}
          />
        </div>
        <div>{properties.children}</div>
      </div>
    </Dropdown.Item>
  );
}

type Properties = {
  readonly notification: Notification;
};

export default function NotificationsMenuItem({notification}: Properties) {
  const [searchParameters, setSearchParameters] = useSearchParams();
  const navigate = useNavigate();
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
        <BaseNotification
          actor={actor}
          icon="HandThumbsUpFill"
          onClick={() => {
            searchParameters.set('showPost', targetPost.id);
            setSearchParameters(searchParameters, {replace: true});
          }}
        >
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
        <BaseNotification
          actor={actor}
          icon="ChatFill"
          onClick={() => {
            searchParameters.set('showPost', targetPost.id);
            setSearchParameters(searchParameters, {replace: true});
          }}
        >
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>commented on your post</Trans>: {content.slice(0, 30)}
          {content.length > 30 && '...'}
        </BaseNotification>
      );
    }

    case 'comment-reaction-notification': {
      const {actor, targetComment, targetPost} = notification;
      const {firstName, lastName} = actor;

      return (
        <BaseNotification
          actor={actor}
          icon="HandThumbsUpFill"
          onClick={() => {
            searchParameters.set('showPost', targetPost.id);
            setSearchParameters(searchParameters, {replace: true});
          }}
        >
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>reacted to your comment</Trans>:{' '}
          {targetComment.content.slice(0, 30)}
          {targetComment.content.length > 30 && '...'}
        </BaseNotification>
      );
    }

    case 'community-invitation-notification': {
      const {actor, community} = notification;
      const {firstName, lastName} = actor;

      return (
        <BaseNotification
          actor={actor}
          icon="EnvelopePaperFill"
          onClick={() => {
            navigate('/community-invitations');
          }}
        >
          <span className="fw-bold">
            {firstName} {lastName}
          </span>{' '}
          <Trans>invited you to join the community </Trans>{' '}
          <span className="fw-bold">{community.name}</span>
        </BaseNotification>
      );
    }

    case 'comment-comment-notification': {
      return null;
    }
  }
}
