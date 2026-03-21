import {Button} from 'react-bootstrap';
import clsx from 'clsx';
import {useSearchParams} from 'react-router-dom';
import {track} from '@/helpers/analytics.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
function hexToRGBA(hex: string, opacity: number) {
  const hexValue = hex.replace('#', '');
  const r = Number.parseInt(hexValue.slice(0, 2), 16);
  const g = Number.parseInt(hexValue.slice(2, 4), 16);
  const b = Number.parseInt(hexValue.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

const textColor = {
  past: '#E24052',
  current: 'white',
  future: '#6C757D',
};

type Properties = {
  readonly state: 'past' | 'current' | 'future';
  readonly dayNumber: number;
  readonly postId: string;
  readonly buttonSize: number;
};

export default function HolidayCalendarTimelineButton(properties: Properties) {
  const {state, dayNumber, postId, buttonSize} = properties;
  const [searchParameters, setSearchParameters] = useSearchParams();

  const handleClick = () => {
    if (state === 'future') {
      return;
    }

    track('Click calendar button', {
      dayNumber,
    });
    searchParameters.set('showProxyPost', postId);
    setSearchParameters(searchParameters);
  };

  return (
    <div className="d-flex gap-1 flex-column align-items-center">
      <Button
        style={{
          width: buttonSize,
          height: buttonSize,
          padding: 0,
          cursor: state === 'future' ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          backgroundColor: state === 'current' ? '#E24052' : 'white',
          ...(state === 'current' && {
            boxShadow: `0 0 0 0 ${hexToRGBA('#E24052', 0.4)}`,
          }),
        }}
        className={clsx('rounded-circle border', {
          'pulse-button': state === 'current',
        })}
        onClick={handleClick}
      >
        <span
          style={{
            marginTop: buttonSize / 6,
            fontSize: buttonSize / 2.2,
            fontWeight: 'bold',
            display: 'inline-block',
            color: textColor[state],
          }}
        >
          {dayNumber}
        </span>
      </Button>
    </div>
  );
}
