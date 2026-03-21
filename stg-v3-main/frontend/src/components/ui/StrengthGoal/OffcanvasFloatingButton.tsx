import {useState, useEffect, useRef} from 'react';
import {useWindowSize} from 'react-use';
import {Trans} from '@lingui/react/macro';
import {type StrengthSlug} from '@client/ApiTypes';
import {Button} from 'react-bootstrap';
import {type OffcanvasMode} from './OffcanvasMode.js';
import GoalProgressbar from './GoalProgressbar.js';
import ArticleGoalInstructions from './ArticleGoalInstructions.js';
import stopPropagationHandlers from './stopPropagationHandlers.js';
import GoalTrophy from './GoalTrophy.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import {strengthColorMap} from '@/helpers/strengths.js';

const margin = 20;
const tooltipWidth = 170;
const tooltipArrowSize = 8;
const tooltipMargin = 25;

type Properties = {
  readonly mode: OffcanvasMode;
  readonly strength: StrengthSlug;
  readonly events: any[];
  readonly target: number;
  readonly isExploding: boolean;
  readonly goalButtonSize: number;
  readonly completedCount: number;
  readonly setIsExploding: (value: boolean) => void;
  readonly id: string;
  readonly onClick: () => void;
};

export default function OffcanvasFloatingButton({
  mode,
  strength,
  events,
  target,
  isExploding,
  completedCount,
  goalButtonSize,
  setIsExploding,
  id,
  onClick,
}: Properties) {
  const {width, height} = useWindowSize();
  const [buttonCoords, setButtonCoords] = useState<{top: number; left: number}>(
    {
      top: height - goalButtonSize - margin,
      left: width - goalButtonSize - margin,
    },
  );

  const buttonReference = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState<{x: number; y: number}>({
    x: 0,
    y: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transitionDuration, setTransitionDuration] = useState('0.3s');
  const [isButtonMounted, setIsButtonMounted] = useState(true);
  const [animateIn, setAnimateIn] = useState(false);
  const pointerStart = useRef<{x: number; y: number} | undefined>(undefined);
  const wasDragged = useRef(false);

  useEffect(() => {
    const buttonWidth = buttonReference.current?.offsetWidth ?? goalButtonSize;
    const buttonHeight =
      buttonReference.current?.offsetHeight ?? goalButtonSize;
    setButtonCoords({
      top: height - buttonHeight - margin,
      left: width - buttonWidth - margin,
    });
  }, [width, height, goalButtonSize]);

  useEffect(() => {
    if (mode === 'closed') {
      setIsButtonMounted(true);
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setAnimateIn(true);
      }, 50);
      return () => {
        clearTimeout(timer);
      };
    }

    setAnimateIn(false);
    const timer = setTimeout(() => {
      setIsButtonMounted(false);
    }, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [mode]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setTransitionDuration('0.5s');
      setTimeout(() => {
        const buttonWidth =
          buttonReference.current?.offsetWidth ?? goalButtonSize;
        const buttonHeight =
          buttonReference.current?.offsetHeight ?? goalButtonSize;
        setButtonCoords({
          left: window.innerWidth - buttonWidth - margin,
          top: window.innerHeight - buttonHeight - margin,
        });
        setTimeout(() => {
          setTransitionDuration('0.3s');
        }, 500);
      }, 150);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [goalButtonSize]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
    pointerStart.current = {x: event.clientX, y: event.clientY};
    wasDragged.current = false;
    const rect = event.currentTarget.getBoundingClientRect();
    setDragOffset({x: event.clientX - rect.left, y: event.clientY - rect.top});
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    event.preventDefault();
    event.stopPropagation();

    if (pointerStart.current) {
      const dx = event.clientX - pointerStart.current.x;
      const dy = event.clientY - pointerStart.current.y;
      if (Math.hypot(dx, dy) > (event.pointerType === 'mouse' ? 2 : 5)) {
        wasDragged.current = true;
      }
    }

    const newLeft = event.clientX - dragOffset.x;
    const newTop = event.clientY - dragOffset.y;
    if (buttonReference.current) {
      const buttonWidth = buttonReference.current.offsetWidth;
      const buttonHeight = buttonReference.current.offsetHeight;
      setButtonCoords({
        left: Math.min(
          Math.max(newLeft, margin),
          window.innerWidth - buttonWidth - margin,
        ),
        top: Math.min(
          Math.max(newTop, margin),
          window.innerHeight - buttonHeight - margin,
        ),
      });
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (!wasDragged.current) onClick();
  };

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const getButtonPositionStyle = (): React.CSSProperties => ({
    position: 'fixed',
    top: `${buttonCoords.top}px`,
    left: `${buttonCoords.left}px`,
    transition: isDragging
      ? 'none'
      : `top ${transitionDuration} ease, left ${transitionDuration} ease`,
    zIndex: 10_001,
    cursor: 'pointer',
    touchAction: 'none',
  });

  const getTooltipStyles = () => {
    const spaceRight = window.innerWidth - (buttonCoords.left + goalButtonSize);
    const spaceLeft = buttonCoords.left;
    const placement = spaceRight >= spaceLeft ? 'right' : 'left';

    const tooltipStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      transition: 'left 0.3s ease',
    };

    const arrowStyle: React.CSSProperties = {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 0,
      height: 0,
      transition: 'left 0.3s ease',
    };

    if (placement === 'right') {
      tooltipStyle.left = goalButtonSize + tooltipMargin;
      arrowStyle.left = -tooltipArrowSize;
      arrowStyle.borderRight = `${tooltipArrowSize}px solid var(--bs-primary)`;
      arrowStyle.borderTop = `${tooltipArrowSize / 1.333}px solid transparent`;
      arrowStyle.borderBottom = `${tooltipArrowSize / 1.333}px solid transparent`;
    } else {
      tooltipStyle.left = -tooltipWidth - tooltipMargin;
      arrowStyle.left = tooltipWidth;
      arrowStyle.borderLeft = `${tooltipArrowSize}px solid var(--bs-primary)`;
      arrowStyle.borderTop = `${tooltipArrowSize / 1.333}px solid transparent`;
      arrowStyle.borderBottom = `${tooltipArrowSize / 1.333}px solid transparent`;
    }

    return {tooltipStyle, arrowStyle};
  };

  if (!isButtonMounted) return null;

  return (
    <>
      <ArticleGoalInstructions
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
        }}
      />
      <div
        ref={buttonReference}
        className="d-none d-lg-block"
        style={getButtonPositionStyle()}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDragStart={handleDragStart}
      >
        <div style={{position: 'relative'}}>
          <div
            style={{
              transform: animateIn ? 'scale(1)' : 'scale(0)',
              opacity: animateIn ? 1 : 0,
              transition: 'transform 0.3s ease, opacity 0.3s ease',
            }}
          >
            {(events.length === 0 || events.length === target) && (
              <div
                className="flex-column gap-2 p-3 text-center"
                style={{
                  position: 'absolute',
                  width: tooltipWidth,
                  backgroundColor: 'var(--bs-primary)',
                  color: 'white',
                  borderRadius: 10,
                  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  zIndex: 2,
                  transition: 'opacity 0.3s ease, left 0.3s ease',
                  ...getTooltipStyles().tooltipStyle,
                }}
              >
                {events.length === target ? (
                  <Trans>Click here to start a new goal!</Trans>
                ) : (
                  <>
                    <Trans>Click here to set a goal for the lesson!</Trans>
                    <Button
                      className="w-100"
                      size="sm"
                      style={{
                        backgroundColor: 'var(--bs-light)',
                        color: 'var(--bs-primary)',
                      }}
                      {...stopPropagationHandlers}
                      onClick={() => {
                        setIsModalOpen(!isModalOpen);
                      }}
                    >
                      <Trans>Read more</Trans>
                    </Button>
                  </>
                )}
                <span style={getTooltipStyles().arrowStyle} />
              </div>
            )}
            <div
              className="rounded-circle"
              style={{
                backgroundColor: strengthColorMap[strength][300],
                border: `1px solid ${strengthColorMap[strength][500]}`,
                cursor: 'pointer',
                pointerEvents: 'auto',
                boxShadow: '0 0 10px rgba(0,0,0,0.3)',
              }}
            >
              {events.length === target ? (
                <div
                  style={{
                    position: 'relative',
                    width: goalButtonSize,
                    height: goalButtonSize,
                  }}
                >
                  <SimpleLottiePlayer
                    autoplay
                    loop
                    src={`/animations/strengths/${strength}.json`}
                    style={{
                      backgroundColor: strengthColorMap[strength][300],
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      border: `1px solid ${strengthColorMap[strength][500]}`,
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '78%',
                      left: '78%',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 2,
                    }}
                  >
                    <GoalTrophy
                      completedCount={completedCount}
                      size={goalButtonSize / 2}
                    />
                  </div>
                </div>
              ) : (
                <GoalProgressbar
                  key={id}
                  isAnimated
                  strength={strength}
                  events={events}
                  target={target}
                  isExploding={isExploding}
                  setIsExploding={setIsExploding}
                  size={goalButtonSize}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
