import clsx from 'clsx';
import Avatar from '../../components/ui/Avatar';

type Props = {
  readonly avatarName: string;
  readonly avatarPath?: string;
  readonly avatarColor?: string;
  readonly topText?: string;
  readonly className?: string;
};

export default function CommunityAvatar(props: Props) {
  const {avatarColor, avatarName, avatarPath, topText, className} = props;
  return (
    <div className={clsx('py-2 px-2', className)}>
      {topText && <div className="text-center">{topText}</div>}
      <div className="strength-item d-flex align-items-center">
        <Avatar
          color={avatarColor}
          name={avatarName}
          path={avatarPath}
          size={64}
          className="me-3"
        />
        <div>
          <h4 className="mb-0">{avatarName}</h4>
        </div>
      </div>
    </div>
  );
}
