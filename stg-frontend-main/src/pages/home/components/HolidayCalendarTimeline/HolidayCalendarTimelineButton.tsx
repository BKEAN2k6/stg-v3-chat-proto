import {Button} from 'react-bootstrap';
import clsx from 'clsx';
import {useSearchParams} from 'react-router-dom';

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

type Props = {
  readonly state: 'past' | 'current' | 'future';
  readonly dayNumber: number;
  readonly postId: string;
  readonly dayName: string;
};

export default function HolidayCalendarTimelineButton(props: Props) {
  const {state, dayNumber, postId, dayName} = props;
  const [searchParameters, setSearchParameters] = useSearchParams();

  const handleClick = () => {
    if (state === 'future') {
      return;
    }

    searchParameters.set('showProxyPost', postId);
    setSearchParameters(searchParameters);
  };

  return (
    <div className="text-center flex-shrink-0">
      <Button
        style={{
          width: 50,
          height: 50,
          padding: 0,
          cursor: state === 'future' ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          backgroundColor: state === 'current' ? '#E24052' : 'white',
          ...(state === 'current' && {
            boxShadow: `0 0 0 0 ${hexToRGBA('#E24052', 0.4)}`,
          }),
        }}
        className={clsx('rounded-circle border mb-1', {
          'pulse-button': state === 'current',
        })}
        onClick={handleClick}
      >
        <span
          style={{
            fontSize: '25px',
            fontWeight: 'bold',
            display: 'inline-block',
            color: textColor[state],
            marginTop: '5px',
          }}
        >
          {dayNumber}
        </span>
      </Button>
      <br />
      {dayName}
    </div>
  );
}
