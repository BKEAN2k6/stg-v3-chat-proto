import {
  type ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type HTMLProps,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import './styles.scss';

type FlippyProps = {
  readonly isFlipped?: boolean;
  readonly flipDirection?: 'horizontal' | 'vertical';
  readonly flipOnHover?: boolean;
  readonly flipOnClick?: boolean;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onTouchStart?: (event: TouchEvent<HTMLDivElement>) => void;
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
} & HTMLProps<HTMLDivElement>;

type FlippyHandle = {
  toggle: () => void;
};

const Flippy = forwardRef<FlippyHandle, FlippyProps>(
  (
    {
      isFlipped: _isFlipped,
      className,
      flipDirection = 'horizontal',
      style,
      children,
      flipOnHover = false,
      flipOnClick = true,
      onClick,
      onTouchStart,
      onMouseEnter,
      onMouseLeave,
      ...rest
    },
    ref: ForwardedRef<FlippyHandle>,
  ) => {
    const simpleFlag = useRef({isTouchDevice: false});
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [isFlipped, setIsFlipped] = useState(_isFlipped);
    const toggle = () => {
      setIsFlipped(!isFlipped);
    };

    useImperativeHandle(ref, () => ({toggle}));

    const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
      if (!isTouchDevice) {
        simpleFlag.current.isTouchDevice = true;
        setIsTouchDevice(true);
      }

      onTouchStart?.(event);
    };

    const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
      if (flipOnHover && !simpleFlag.current.isTouchDevice) {
        setIsFlipped(true);
      }

      onMouseEnter?.(event);
    };

    const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
      if (flipOnHover && !simpleFlag.current.isTouchDevice) {
        setIsFlipped(false);
      }

      if (onMouseLeave) {
        onMouseLeave(event);
      }
    };

    const handleClick = (event: MouseEvent<HTMLDivElement>) => {
      switch (true) {
        case flipOnHover && !simpleFlag.current.isTouchDevice:
        case !flipOnClick && !flipOnHover: {
          break;
        }

        default: {
          setIsFlipped(!isFlipped);
          break;
        }
      }

      onClick?.(event);
    };

    useEffect(() => {
      if (typeof _isFlipped === 'boolean' && _isFlipped !== isFlipped) {
        setIsFlipped(_isFlipped);
      }
    }, [_isFlipped, isFlipped]);

    return (
      <div
        {...rest}
        className={`flippy-container ${className ?? ''}`}
        style={{
          ...style,
        }}
        onTouchStart={handleTouchStart}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className={`flippy-cardContainer-wrapper ${flipDirection}`}>
          <div
            className={`flippy-cardContainer ${isFlipped ? 'isActive' : ''} ${
              isTouchDevice ? 'istouchdevice' : ''
            }`}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

Flippy.defaultProps = {
  flipDirection: 'horizontal',
  flipOnHover: false,
  flipOnClick: true,
  isFlipped: false,
  onMouseEnter() {
    return null;
  },
  onMouseLeave() {
    return null;
  },
  onTouchStart() {
    return null;
  },
  onClick() {
    return null;
  },
};

export default Flippy;
