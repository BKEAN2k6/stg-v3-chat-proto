import {msg, Trans} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useNavigate} from 'react-router-dom';
import {
  LightbulbFill,
  ChatDotsFill,
  HeartFill,
  Stars,
} from 'react-bootstrap-icons';
import {Button, OverlayTrigger, Popover} from 'react-bootstrap';
import clsx from 'clsx';
import {useTracking} from 'react-tracking';

// eslint-disable-next-line @typescript-eslint/naming-convention
function hexToRGBA(hex: string, opacity: number) {
  const hexValue = hex.replace('#', '');
  const r = Number.parseInt(hexValue.slice(0, 2), 16);
  const g = Number.parseInt(hexValue.slice(2, 4), 16);
  const b = Number.parseInt(hexValue.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

type Props = {
  readonly state: 'past' | 'current' | 'future';
  readonly type: 'start' | 'speak' | 'act' | 'assess';
  readonly strength: string;
  readonly color: string;
  readonly articleId: string;
  readonly rootCategoryId: string;
};

export default function StrengthTimelineButton(props: Props) {
  const {color, state, type, strength, articleId, rootCategoryId} = props;
  const {_} = useLingui();
  const navigate = useNavigate();
  const {trackEvent} = useTracking<Trackables>();

  const iconColor = {
    past: color,
    current: 'white',
    future: '#6C757D',
  };
  const titles = {
    start: _(msg`Start`),
    speak: _(msg`Speak`),
    act: _(msg`Act`),
    assess: _(msg`Assess`),
  };

  type IconProps = {
    readonly type: 'start' | 'speak' | 'act' | 'assess';
    readonly state: 'past' | 'current' | 'future';
  };

  function onArticleOpen() {
    trackEvent({
      action: 'click',
      element: `timeline-article-link-${strength}-${type}`,
    });
    navigate(`/article-categories/${rootCategoryId}/article/${articleId}`);
  }

  function Icon(props: IconProps) {
    const {type, state} = props;
    const size = 18;
    switch (type) {
      case 'start': {
        return <LightbulbFill size={size} color={iconColor[state]} />;
      }

      case 'speak': {
        return <ChatDotsFill size={size} color={iconColor[state]} />;
      }

      case 'act': {
        return <HeartFill size={size} color={iconColor[state]} />;
      }

      case 'assess': {
        return <Stars size={size} color={iconColor[state]} />;
      }

      default: {
        return null;
      }
    }
  }

  const popover = (
    <Popover>
      <Popover.Body>
        <div className="d-flex gap-3 pb-3">
          <div
            style={{
              width: 50,
              height: 50,
              backgroundColor: color,
            }}
            className="rounded-circle border d-flex align-items-center justify-content-center"
          >
            <div className="align-self-center">
              <Icon type={type} state="current" />
            </div>
          </div>

          <div className="align-self-center fs-4">{titles[type]}</div>
        </div>
        <Trans>
          Read the article{' '}
          <a
            href="#"
            onClick={(event) => {
              event.preventDefault();
              onArticleOpen();
            }}
          >
            here.
          </a>
        </Trans>
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="text-center flex-shrink-0">
      <OverlayTrigger
        rootClose
        trigger="click"
        show={state === 'future' ? false : undefined}
        overlay={popover}
      >
        <Button
          style={{
            width: 50,
            height: 50,
            cursor: state === 'future' ? 'not-allowed' : 'pointer',
            textAlign: 'center',
            backgroundColor: state === 'current' ? color : 'white',
            ...(state === 'current' && {
              boxShadow: `0 0 0 0 ${hexToRGBA(color, 0.4)}`,
            }),
          }}
          className={clsx('rounded-circle border mb-1', {
            'pulse-button': state === 'current',
          })}
        >
          <Icon type={type} state={state} />
        </Button>
      </OverlayTrigger>
      <br />
      {titles[type]}
    </div>
  );
}
