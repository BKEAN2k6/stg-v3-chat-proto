import {type UserInfo} from '@client/ApiTypes';
import Avatar from '@/components/ui/Avatar.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';
import {TimeAgoTranslated} from '@/components/TimeAgoTranslated.js';

type Properties = {
  readonly createdBy: UserInfo;
  readonly createdAt: string;
};

export default function PostCreator(properties: Properties) {
  const {createdBy, createdAt} = properties;

  return (
    <div className="d-flex align-items-center gap-2" style={{minWidth: 0}}>
      <Avatar
        size={40}
        name={formatName(createdBy)}
        color={colorFromId(createdBy.id)}
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
