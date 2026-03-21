import Avatar from '@/components/ui/Avatar';
import {type UserInfo} from '@/api/ApiTypes';
import {colorFromId, formatName} from '@/helpers/avatars';
import {TimeAgoTranslated} from '@/components/TimeAgoTranslated';

type Props = {
  readonly createdBy: UserInfo;
  readonly createdAt: string;
};

export default function PostCreator(props: Props) {
  const {createdBy, createdAt} = props;

  return (
    <div className="d-flex align-items-center gap-2" style={{minWidth: 0}}>
      <Avatar
        size={40}
        name={formatName(createdBy)}
        color={colorFromId(createdBy._id)}
        path={createdBy.avatar}
      />
      <div className="d-flex align-items-center pe-1" style={{minWidth: 0}}>
        <span className="fw-semibold text-truncate">
          {formatName(createdBy)}
        </span>
        <span className="mx-1 text-body-secondary">•</span>
        <small className="text-body-secondary text-truncate">
          <TimeAgoTranslated date={createdAt} />
        </small>
      </div>
    </div>
  );
}
