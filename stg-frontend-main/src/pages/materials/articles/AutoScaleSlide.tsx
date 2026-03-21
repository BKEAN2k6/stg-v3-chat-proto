import {useState, useEffect, useRef} from 'react';
import ere from 'element-resize-event';
import {MarkdownView} from '@/components/ui/MarkdownView';

type AutoScaleProps = {
  readonly body: string;
  readonly layout?: 'default' | 'centered' | 'full' | 'notes';
  readonly color: string;
  readonly background: string;
  readonly backgroundColor: string;
  readonly paddingTop: string | number;
  readonly paddingBottom: string | number;
  readonly paddingLeft: string | number;
  readonly paddingRight: string | number;
  readonly isVideoFullScreenDisabled?: boolean;
  readonly slideNumber: number;
  readonly slideCount: number;
  readonly onEnded?: () => void;
};

const slideWidth = 1280;
const slideHeight = 720;

function AutoScaleSlide({
  body,
  layout,
  color,
  background = 'default',
  backgroundColor,
  paddingTop = '50px',
  paddingBottom = '50px',
  paddingLeft = '50px',
  paddingRight = '50px',
  isVideoFullScreenDisabled = false,
  slideNumber,
  slideCount,
  onEnded,
}: AutoScaleProps) {
  const [contentSize, setContentSize] = useState({width: 0, height: 0});
  const [scale, setScale] = useState(1);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateScale = () => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current?.children[0] as HTMLDivElement;

    if (wrapper && content) {
      const newWrapperSize = {
        width: wrapper.offsetWidth,
        height: wrapper.offsetHeight,
      };
      const newContentSize = {
        width: content.offsetWidth,
        height: content.offsetHeight,
      };

      const newScale = newWrapperSize.width / newContentSize.width;

      setContentSize(newContentSize);
      setScale(newScale);
    }
  };

  useEffect(() => {
    updateScale();

    const wrapper = wrapperRef.current;
    const content = contentRef.current?.children[0] as HTMLDivElement;

    if (wrapper && content) {
      ere(content, updateScale);
      ere(wrapper, updateScale);
    }

    return () => {
      if (wrapper && content) {
        ere.unbind(content, updateScale);
        ere.unbind(wrapper, updateScale);
      }
    };
  }, []);

  const containerHeight = Math.ceil(scale * contentSize.height);
  const containerWidth = Math.ceil(scale * contentSize.width);

  const pixelPaddinRight =
    typeof paddingRight === 'string' && paddingRight.endsWith('%')
      ? (slideWidth * Number.parseInt(paddingRight, 10)) / 100
      : paddingRight;

  const pixelPaddingLeft =
    typeof paddingLeft === 'string' && paddingLeft.endsWith('%')
      ? (slideWidth * Number.parseInt(paddingLeft, 10)) / 100
      : paddingLeft;

  const pixelPaddingTop =
    typeof paddingTop === 'string' && paddingTop.endsWith('%')
      ? (slideHeight * Number.parseInt(paddingTop, 10)) / 100
      : paddingTop;

  const pixelPaddingBottom =
    typeof paddingBottom === 'string' && paddingBottom.endsWith('%')
      ? (slideHeight * Number.parseInt(paddingBottom, 10)) / 100
      : paddingBottom;

  return (
    <div ref={wrapperRef}>
      <div
        style={{
          maxWidth: '100%',
          overflow: 'hidden',
          width: containerWidth,
          height: containerHeight,
        }}
      >
        <div
          ref={contentRef}
          style={{transform: `scale(${scale})`, transformOrigin: '0 0 0'}}
        >
          <div
            style={{
              position: 'relative',
              width: slideWidth,
              height: slideHeight,
              ...(layout !== 'full' && {
                paddingTop: pixelPaddingTop,
                paddingBottom: pixelPaddingBottom,
                paddingLeft: pixelPaddingLeft,
                paddingRight: pixelPaddinRight,
              }),
              ...(layout === 'centered' && {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
              }),

              ...(background &&
                !backgroundColor &&
                layout !== 'full' && {
                  backgroundImage: `url(/images/slide-backgrounds/${background}.jpg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }),
              backgroundColor: backgroundColor || 'white',
              color,
            }}
          >
            <div className="slide-content">
              <MarkdownView
                isVideoFullScreenDisabled={isVideoFullScreenDisabled}
                content={body}
                onEnded={onEnded}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '35px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                padding: '4px 8px 0px',
                borderRadius: '8px',
                fontSize: '18px',
                color: '#000',
                pointerEvents: 'none',
              }}
            >
              {slideNumber}/{slideCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AutoScaleSlide;
