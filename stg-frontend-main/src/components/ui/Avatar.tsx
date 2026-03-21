import clsx from 'clsx';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {ChatFill, HandThumbsUpFill} from 'react-bootstrap-icons';
import AvatarTooltip from './AvatarTooltip';
import constants from '@/constants';

const iconMap = {
  ChatFill,
  HandThumbsUpFill,
};

type Props = {
  readonly name?: string;
  readonly path?: string;
  readonly color?: string;
  readonly size: number;
  readonly marginLeft?: number;
  readonly marginRight?: number;
  readonly marginBottom?: number;
  readonly className?: string;
  readonly onClick?: () => void;
  readonly icon?: 'ChatFill' | 'HandThumbsUpFill';
};

export function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export default function Avatar(props: Props) {
  const {
    name,
    path,
    color,
    size,
    marginLeft,
    marginRight,
    marginBottom,
    className,
    onClick,
    icon,
  } = props;
  const IconComponent = icon ? iconMap[icon] : null;

  const fixedAvatars: Record<string, string> = {
    'coach-kaisa': '/images/avatars/coach-kaisa.jpg',
    'holiday-kaisa': '/images/avatars/holiday-kaisa.jpg',
  };

  const avatarPath = path
    ? (fixedAvatars[path] ?? `${constants.FILE_HOST}${path}`)
    : undefined;

  return (
    <OverlayTrigger
      delay={{show: 250, hide: 400}}
      overlay={
        <Tooltip className="custom-tooltip">
          <AvatarTooltip name={name} path={avatarPath} color={color} />
        </Tooltip>
      }
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          marginLeft,
          marginRight,
          marginBottom,
        }}
      >
        <div
          className={clsx('rounded-circle', className)}
          style={{
            width: size,
            height: size,
            minWidth: size,
            minHeight: size,
            textAlign: 'center',
            backgroundColor: avatarPath ? 'transparent' : color,
            color: 'white',
            fontSize: size / 3,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: avatarPath ? 0 : size * 0.3,
          }}
        >
          {avatarPath ? (
            <img
              src={avatarPath}
              alt={name}
              className={clsx('rounded-circle')}
              style={{
                width: size,
                height: size,
                objectFit: 'cover',
                cursor: onClick ? 'pointer' : 'default',
              }}
              onClick={onClick}
            />
          ) : (
            getInitials(name ?? '')
          )}
        </div>
        {IconComponent && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
              borderRadius: '50%',
              width: size / 2,
              height: size / 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 2px rgba(0, 0, 0, 0.5)',
            }}
          >
            <IconComponent size={size / 3} color="#7754c9" />
          </div>
        )}
      </div>
    </OverlayTrigger>
  );
}
