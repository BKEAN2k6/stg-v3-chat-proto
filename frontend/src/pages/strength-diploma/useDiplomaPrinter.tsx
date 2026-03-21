import {
  type ReactNode,
  type ReactPortal,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {createPortal} from 'react-dom';

type UseDiplomaPrinterProperties = {
  readonly content: ReactNode;
};

type UseDiplomaPrinterResult = {
  readonly handlePrint: () => void;
  readonly DiplomaPrintPortal: () => ReactPortal | undefined;
};

function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.userAgent.toLowerCase().includes('firefox');
}

async function waitForImages(container?: HTMLElement): Promise<void> {
  if (!container) return;
  const images = [...container.querySelectorAll('img')];
  const pending = images.filter((image) => !image.complete);
  if (pending.length === 0) return;

  await new Promise<void>((resolve) => {
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

export function useDiplomaPrinter({
  content,
}: UseDiplomaPrinterProperties): UseDiplomaPrinterResult {
  const [isPrinting, setIsPrinting] = useState(false);
  const stageReference = useRef<HTMLDivElement | undefined>(undefined);

  const printableContent = useMemo((): ReactNode => content, [content]);

  const handlePrint = useCallback(() => {
    if (typeof globalThis === 'undefined') return;
    setIsPrinting(true);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    if (!isPrinting) return undefined;

    const className = 'diploma-printing';
    document.body.classList.add(className);

    // Inject Firefox-specific @page margin
    let styleElement: HTMLStyleElement | undefined;
    if (isFirefox()) {
      styleElement = document.createElement('style');
      styleElement.textContent = '@page { margin: 5mm !important; }';
      document.head.append(styleElement);
    }

    return () => {
      document.body.classList.remove(className);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isPrinting]);

  useEffect(() => {
    if (!isPrinting) return undefined;
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

      await waitForImages(stageReference.current ?? undefined);
      if (isCancelled) return;

      const originalTitle = document.title;

      try {
        globalThis.print();
      } finally {
        document.title = originalTitle;
        if (!isCancelled) {
          setIsPrinting(false);
        }
      }
    };

    (async () => {
      try {
        await runPrint();
      } catch (error: unknown) {
        console.error('Failed to print diploma frame', error);
        setIsPrinting(false);
      }
    })();

    return () => {
      isCancelled = true;
      if (animationFrame) globalThis.cancelAnimationFrame(animationFrame);
    };
  }, [isPrinting]);

  const DiplomaPrintPortal = useCallback(() => {
    if (typeof document === 'undefined') return undefined;

    const className = `diploma-print-stage${
      isPrinting ? ' diploma-print-stage--active' : ''
    }`;

    return createPortal(
      <div className={className} aria-hidden={!isPrinting}>
        {isPrinting ? (
          <div className="diploma-print-stage__frame">
            <div
              ref={(element) => {
                stageReference.current = element ?? undefined;
              }}
              className="diploma-print-stage__content"
            >
              {printableContent}
            </div>
          </div>
        ) : undefined}
      </div>,
      document.body,
    );
  }, [isPrinting, printableContent]);

  return {handlePrint, DiplomaPrintPortal};
}
