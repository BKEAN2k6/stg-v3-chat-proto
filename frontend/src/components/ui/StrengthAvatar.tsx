import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import {i18n} from '@lingui/core';
import {type StrengthSlug} from '@client/ApiTypes';
import {strengthColorMap, slugToListItem} from '@/helpers/strengths.js';

type Properties = {
  readonly strength: StrengthSlug;
  readonly size?: number | string;
  readonly tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
};

export default function StrengthAvatar({
  strength,
  size = 32,
  tooltipPlacement,
}: Properties) {
  const {imageUrl, title, color, description} = slugToListItem(
    strength,
    i18n.locale,
  );

  return (
    <OverlayTrigger
      delay={{show: 250, hide: 400}}
      placement={tooltipPlacement}
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
