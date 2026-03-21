import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {i18n} from '@lingui/core';
import {strengthColorMap, slugToListItem} from '@/helpers/strengths';
import {type StrengthSlug} from '@/api/ApiTypes';

type Props = {
  readonly strength: StrengthSlug;
  readonly size?: number | string;
};

export default function StrengthAvatar(props: Props) {
  const {strength, size = 32} = props;
  const {imageUrl, title, color, description} = slugToListItem(
    strength,
    i18n.locale,
  );

  return (
    <OverlayTrigger
      delay={{show: 250, hide: 400}}
      overlay={
        <Tooltip className="custom-tooltip">
          <div className="d-flex p-3 gap-3">
            <img
              src={imageUrl}
              alt={title}
              className="rounded-circle"
              style={{
                width: 80,
                height: 80,
                objectFit: 'cover',
                backgroundColor: color,
              }}
            />
            <div>
              <h5 className="mb-0">{title}</h5>
              <p className="mb-0">{description}</p>
            </div>
          </div>
        </Tooltip>
      }
    >
      <img
        src={imageUrl}
        alt={strength}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: strengthColorMap[strength][300],
        }}
      />
    </OverlayTrigger>
  );
}
