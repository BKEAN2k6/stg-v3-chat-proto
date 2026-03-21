import {Card} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';
import {getInitials} from '@/components/ui/Avatar.js';
import {colorFromId} from '@/helpers/avatars.js';

type Properties = {
  readonly group: {
    readonly id: string;
    readonly name: string;
    readonly owner: {
      readonly firstName: string;
      readonly lastName: string;
    };
  };
  readonly onCardClick: () => void;
};

const avatarSize = 36;

export default function GroupCard({group, onCardClick}: Properties) {
  return (
    <Card.Body
      style={{cursor: 'pointer'}}
      onClick={() => {
        onCardClick();
      }}
    >
      <div className="mb-3">
        <div
          className="rounded-circle fw-bold"
          style={{
            width: avatarSize,
            height: avatarSize,
            textAlign: 'center',
            backgroundColor: colorFromId(group.id),
            color: 'white',
            fontSize: avatarSize / 3,
            display: 'flex',
            justifyContent: 'center',
            overflow: 'hidden',
            paddingTop: avatarSize * 0.3,
          }}
        >
          {getInitials(group.name)}
        </div>
      </div>
      <span className="fw-bold fs-6">{group.name}</span>
      <br />
      <span>
        <Trans>Owner</Trans>: {group.owner.firstName} {group.owner.lastName}
      </span>
    </Card.Body>
  );
}
