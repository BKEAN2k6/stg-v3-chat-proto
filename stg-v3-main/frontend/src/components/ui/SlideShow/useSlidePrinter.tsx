import {
  type ReactPortal,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {createPortal} from 'react-dom';
import AutoScaleSlide from './AutoScaleSlide.js';
import {type SlideAttributes} from './SlideTypes.js';

type PrintableSlide = {
  body: string;
  attributes: SlideAttributes;
  slideNumber?: number;
  slideCount?: number;
  title?: string;
};

type UseSlidePrinterResult = {
  printSlide: (slide: PrintableSlide) => void;
  SlidePrintPortal: () => ReactPortal | undefined;
};

async function waitForImages(container?: HTMLElement): Promise<void> {
  if (!container) return;
  const images = [...container.querySelectorAll('img')];
  const pending = images.filter((image) => !image.complete);
  if (pending.length === 0) return;

  return new Promise<void>((resolve) => {
    let remaining = pending.length;
    const handleDone = () => {
      remaining -= 1;
      if (remaining <= 0) resolve();
    };

    for (const image of pending) {
      const handle = () => {
        handleDone();
      };

      image.addEventListener('load', handle, {once: true});
      image.addEventListener('error', handle, {once: true});
    }
  });
}

export function useSlidePrinter(): UseSlidePrinterResult {
  const [request, setRequest] = useState<PrintableSlide | undefined>(undefined);
  const stageReference = useRef<HTMLDivElement | undefined>(undefined);

  const printSlide = useCallback((slide: PrintableSlide) => {
    if (typeof globalThis === 'undefined') return;
    setRequest(slide);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!request) return undefined;

    const className = 'slide-printing';
    document.body.classList.add(className);

    return () => {
      document.body.classList.remove(className);
    };
  }, [request]);

  useEffect(() => {
    if (!request) return undefined;
    if (typeof globalThis === 'undefined') return undefined;

    let isCancelled = false;
    let animationFrame = 0;

    const runPrint = async () => {
      await new Promise<void>((resolve) => {
        animationFrame = globalThis.requestAnimationFrame(() => {
          globalThis.requestAnimationFrame(() => {
            resolve();
          });
        });
      });

      if (isCancelled) return;
      const container = stageReference.current;
      if (!container) return;

      await waitForImages(container);
      if (isCancelled) return;

      try {
        const originalTitle = document.title;
        if (request.title) {
          document.title = request.title;
        }

        globalThis.print();

        if (request.title) {
          document.title = originalTitle;
        }
      } finally {
        if (!isCancelled) {
          setRequest(undefined);
        }
      }
    };

    (async () => {
      try {
        await runPrint();
      } catch (error: unknown) {
        console.error('Failed to print slide', error);
        setRequest(undefined);
      }
    })();

    return () => {
      isCancelled = true;
      if (animationFrame) globalThis.cancelAnimationFrame(animationFrame);
    };
  }, [request]);

  const SlidePrintPortal = useCallback(() => {
    if (typeof document === 'undefined') return undefined;

    return createPortal(
      <div className="slide-print-stage" aria-hidden={!request}>
        {request ? (
          <div className="slide-print-stage__frame">
            <div
              ref={(element) => {
                stageReference.current = element ?? undefined;
              }}
              className="slide-print-stage__content"
            >
              <AutoScaleSlide
                className="slide-print-stage__slide"
                body={request.body}
                layout={request.attributes.layout}
                color={request.attributes.color}
                shadowColor={request.attributes.shadowColor}
                background={request.attributes.background}
                backgroundColor={request.attributes.backgroundColor}
                paddingTop={request.attributes.paddingTop}
                paddingBottom={request.attributes.paddingBottom}
                paddingLeft={request.attributes.paddingLeft}
                paddingRight={request.attributes.paddingRight}
                isScrollable={request.attributes.scrollable}
                slideNumber={request.slideNumber}
                slideCount={request.slideCount}
                isAnimationClickable={false}
              />
            </div>
          </div>
        ) : undefined}
      </div>,
      document.body,
    );
  }, [request]);

  return {printSlide, SlidePrintPortal};
}
