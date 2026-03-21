import {
  useEffect,
  useRef,
  useState,
  type HTMLProps,
  type MouseEvent,
  type TouchEvent,
} from 'react';
import './styles.scss';

type FlippyProperties = {
  readonly isFlipped?: boolean;
  readonly flipDirection?: 'horizontal' | 'vertical';
  readonly isFlipOnHover?: boolean;
  readonly isFlipOnClick?: boolean;
  readonly onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void;
  readonly onTouchStart?: (event: TouchEvent<HTMLDivElement>) => void;
  readonly onClick?: (event: MouseEvent<HTMLDivElement>) => void;
} & HTMLProps<HTMLDivElement>;

function Flippy({
  isFlipped: _isFlipped = false,
  className,
  flipDirection = 'horizontal',
  style,
  children,
  isFlipOnHover = false,
  isFlipOnClick = true,
  onClick,
  onTouchStart,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: FlippyProperties) {
  const simpleFlag = useRef({isTouchDevice: false});
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isFlipped, setIsFlipped] = useState(_isFlipped);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    if (!isTouchDevice) {
      simpleFlag.current.isTouchDevice = true;
      setIsTouchDevice(true);
    }

    onTouchStart?.(event);
  };

  const handleMouseEnter = (event: MouseEvent<HTMLDivElement>) => {
    if (isFlipOnHover && !simpleFlag.current.isTouchDevice) {
      setIsFlipped(true);
    }

    onMouseEnter?.(event);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    if (isFlipOnHover && !simpleFlag.current.isTouchDevice) {
      setIsFlipped(false);
    }

    if (onMouseLeave) {
      onMouseLeave(event);
    }
  };

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    const shouldSkipFlip =
      (isFlipOnHover && !simpleFlag.current.isTouchDevice) ||
      (!isFlipOnClick && !isFlipOnHover);

    if (!shouldSkipFlip) {
      setIsFlipped(!isFlipped);
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
}

export default Flippy;
