/* eslint-disable @typescript-eslint/naming-convention */
import {useEffect, useRef, useState} from 'react';
import {Trans} from '@lingui/react/macro';
import {Stack} from 'react-bootstrap';
import StrengthCarousel from '../../StrengthCarousel/StrengthCarousel.js';

const CHAPTER_TOOLTIP_TOP_PCT = 45.4;
const CHAPTER_TOOLTIP_LEFT_PCT = 16.8;

const SETTINGS_TOOLTIP_TOP_PCT = 8;
const SETTINGS_TOOLTIP_RIGHT_PCT = 15;

const SLIDES_TOOLTIP_TOP_PCT = 48;
const SLIDES_TOOLTIP_LEFT_PCT = 70;

const ARROW_SIZE_PX = 12;
const ARROW_TIP_OFFSET_PX = ARROW_SIZE_PX / Math.SQRT2;
const ARROW_CENTER_OFFSET_PX = ARROW_SIZE_PX / 2 - 1;

const baseWidth = 480;
const aspectRatio = 16 / 17.6;
const baseHeight = baseWidth / aspectRatio;

export default function Materials() {
  const frameReference = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!frameReference.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      setScale(Math.min(1, w / baseWidth));
    });
    ro.observe(frameReference.current);
    return () => {
      ro.disconnect();
    };
  }, []);

  return (
    <Stack className="align-items-start gap-3 flex-column flex-md-row p-4 pb-0">
      <div className="w-100 w-md-auto">
        <p>
          <Trans>
            This is the strength guide. It always recommends the next lesson for
            your group. You can adjust the strength guide’s <b>settings</b> at
            any time.
          </Trans>
        </p>

        <p>
          <Trans>
            After completing a lesson, mark it as finished on the last page.
            Your group will then receive a badge! The next lesson will
            automatically appear on your home page.
          </Trans>
        </p>
        <p>
          <Trans>
            Try it now: click through the <b>lessons</b> to explore their
            contents. Click a <b>slide</b> to view it in full screen.
          </Trans>
        </p>
      </div>

      <div className="w-100 w-md-auto">
        <div
          ref={frameReference}
          className="mx-auto"
          style={{
            width: '100%',
            maxWidth: 460,
            minWidth: 320,
            height: baseHeight * scale,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: baseWidth,
              height: baseHeight,
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            <StrengthCarousel isDemo />
          </div>
          <div
            className="wizard-tooltip tooltip-bounce-y"
            style={{
              position: 'absolute',
              top: `${CHAPTER_TOOLTIP_TOP_PCT}%`,
              left: `${CHAPTER_TOOLTIP_LEFT_PCT}%`,
              transform:
                'translate(-50%, calc(-100% + 40px + var(--bounce-y)))',
            }}
          >
            <Trans>Chapters</Trans>
            <div
              style={{
                position: 'absolute',
                top: -6,
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: ARROW_SIZE_PX,
                height: ARROW_SIZE_PX,
                background: 'var(--bs-primary)',
              }}
            />
          </div>
          <div
            className="wizard-tooltip tooltip-bounce-y"
            style={{
              top: `${SLIDES_TOOLTIP_TOP_PCT}%`,
              left: `${SLIDES_TOOLTIP_LEFT_PCT}%`,
              transform: 'translate(-50%, calc(-100% + var(--bounce-y)))',
            }}
          >
            <Trans>Slides</Trans>
            <div
              style={{
                position: 'absolute',
                bottom: -6,
                left: '50%',
                transform: 'translateX(-50%) rotate(45deg)',
                width: ARROW_SIZE_PX,
                height: ARROW_SIZE_PX,
                background: 'var(--bs-primary)',
              }}
            />
          </div>
          <div
            className="wizard-tooltip tooltip-bounce-x"
            style={{
              top: `${SETTINGS_TOOLTIP_TOP_PCT}%`,
              right: `${SETTINGS_TOOLTIP_RIGHT_PCT}%`,
              transform: `translate(calc(${-ARROW_TIP_OFFSET_PX}px + var(--bounce-x)), calc(-50% + 1px))`,
            }}
          >
            <Trans>Settings</Trans>
            <div
              style={{
                position: 'absolute',
                top: 'calc(50% - 1px)',
                right: -ARROW_CENTER_OFFSET_PX,
                transform:
                  'translate(calc(-1 * var(--bounce-x)), -50%) rotate(45deg)',
                transformOrigin: '50% 50%',
                width: ARROW_SIZE_PX,
                height: ARROW_SIZE_PX,
                background: 'var(--bs-primary)',
                willChange: 'transform',
              }}
            />
          </div>
        </div>
      </div>
    </Stack>
  );
}
