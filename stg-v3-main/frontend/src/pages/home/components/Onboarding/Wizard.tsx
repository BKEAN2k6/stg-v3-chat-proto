import React, {
  type ReactElement,
  useCallback,
  useMemo,
  useRef,
  useEffect,
  useState,
} from 'react';
import {Modal, Button, Carousel} from 'react-bootstrap';
import {type CarouselRef} from 'react-bootstrap/esm/Carousel';
import {Trans} from '@lingui/react/macro';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import './Wizard.scss';

export type BeforeNextFunction<D> = (
  context: WizardRenderContext<D>,
) => Promise<boolean | void> | boolean | void;

export type WizardRenderContext<D> = {
  data: D;
  setData: React.Dispatch<React.SetStateAction<D>>;
  next: () => void;
  previous: () => void;
  goTo: (index: number) => void;
  index: number;
  count: number;
  setNextDisabled: (disabled: boolean) => void;
};

export type WizardStepProperties<D> = {
  id: string;
  initialData?: D;
  title?: string;
  overflowHidden?: boolean; // eslint-disable-line react/boolean-prop-naming
  beforeNext?: BeforeNextFunction<D>;
  nextLabel?: string;
  children:
    | React.ReactNode
    | ((context: WizardRenderContext<D>) => React.ReactNode);
};

function WizardStep<D>(_: WizardStepProperties<D>) {
  return null;
}

WizardStep.displayName = 'WizardStep';

export type WizardProperties = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onFinish: () => void;
  readonly initialIndex?: number;
  readonly children:
    | ReactElement<WizardStepProperties<any>>
    | Array<ReactElement<WizardStepProperties<any>>>;
};

export function Wizard({
  isOpen,
  onClose,
  onFinish,
  initialIndex = 0,
  children,
}: WizardProperties) {
  const {_} = useLingui();
  const carouselReference = useRef<CarouselRef>(null);
  const [index, setIndex] = useState(initialIndex);
  const [disabledMap, setDisabledMap] = useState<Record<number, boolean>>({});

  const stepEls = React.Children.toArray(children) as Array<
    React.ReactElement<WizardStepProperties<any>>
  >;
  const count = stepEls.length;
  const [stepData, setStepData] = useState<unknown[]>(() =>
    stepEls.map((element) => element.props.initialData as unknown),
  );

  const goTo = useCallback(
    (i: number) => {
      const clamped = Math.max(0, Math.min(count - 1, i));
      setIndex(clamped);
    },
    [count],
  );

  useEffect(() => {
    const carousel = carouselReference.current;
    if (!carousel) return;

    carousel.element?.scrollTo({top: 0, behavior: 'smooth'});
  }, [index]);

  const previous = useCallback(() => {
    goTo(index - 1);
  }, [goTo, index]);
  const next = useCallback(() => {
    goTo(index + 1);
  }, [goTo, index]);

  const baseNavivage = useMemo(
    () => ({next, previous, goTo, index, count}),
    [next, previous, goTo, index, count],
  );

  const current = stepEls[index]?.props as
    | WizardStepProperties<any>
    | undefined;

  const resolveTitle = (): string => {
    return current?.title ?? ' ';
  };

  const resolveNextLabel = (): string => {
    return (
      current?.nextLabel ??
      (index === count - 1 ? _(msg`Finish`) : _(msg`Next`))
    );
  };

  const isNextDisabled = Boolean(disabledMap[index]);

  const handlePrimary = async () => {
    const before = current?.beforeNext;
    if (before) {
      const context: WizardRenderContext<any> = {
        data: stepData[index],
        setData(updater: any) {
          setStepData((array) => {
            const nextArray = [...array];
            const current_ = array[index];
            nextArray[index] =
              typeof updater === 'function'
                ? (updater as (argument: unknown) => unknown)(current_)
                : updater;
            return nextArray;
          });
        },
        setNextDisabled(v: boolean) {
          setDisabledMap((m) => ({...m, [index]: v}));
        },
        ...baseNavivage,
      };
      const ok = await Promise.resolve(before(context));
      if (ok === false) return;
    }

    if (index === count - 1) {
      onFinish();
      return;
    }

    next();
  };

  return (
    <Modal
      centered
      scrollable
      show={isOpen}
      backdrop="static"
      fullscreen="lg-down"
      contentClassName="d-flex flex-column"
      className="wizard-modal"
      onHide={onClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>{resolveTitle()}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="flex-grow-1 p-0 overflow-hidden">
        <Carousel
          ref={carouselReference}
          touch
          slide
          wrap={false}
          indicators={false}
          activeIndex={index}
          controls={false}
          interval={null}
          className="h-100"
          onSelect={(i) => {
            goTo(i);
          }}
        >
          {stepEls.map((element, i) => {
            const properties = element.props;

            const setStepDataAt = (updater: any) => {
              setStepData((array) => {
                const nextArray = [...array];
                const current_ = array[i];
                nextArray[i] =
                  typeof updater === 'function'
                    ? (updater as (argument: unknown) => unknown)(current_)
                    : updater;
                return nextArray;
              });
            };

            const itemContext: WizardRenderContext<any> = {
              data: stepData[i],
              setData: setStepDataAt,
              setNextDisabled(v: boolean) {
                setDisabledMap((m) => ({...m, [i]: v}));
              },
              ...baseNavivage,
            };

            const content =
              typeof properties.children === 'function'
                ? (
                    properties.children as (
                      context: WizardRenderContext<any>,
                    ) => React.ReactNode
                  )(itemContext)
                : properties.children;

            return (
              <Carousel.Item key={properties.id ?? i} className="h-100">
                <div
                  className={`wizard-step-scroll ${properties.overflowHidden ? 'overflow-hidden' : 'overflow-auto'}`}
                >
                  {content}
                </div>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Modal.Body>

      <Modal.Footer className="w-100">
        <div className="d-none d-sm-flex align-items-center justify-content-between w-100">
          <Button
            variant="outline-secondary"
            disabled={index === 0}
            style={{width: 110}}
            onClick={previous}
          >
            <Trans>Previous</Trans>
          </Button>

          <div className="flex-grow-1 d-flex justify-content-center">
            {Array.from({length: count}).map((_, iDot) => (
              <span
                key={stepEls[iDot].props.id}
                className={`mx-1 rounded-circle ${iDot === index ? 'bg-primary' : 'bg-secondary'}`}
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  cursor: 'pointer',
                  opacity: iDot === index ? 1 : 0.5,
                }}
                onClick={() => {
                  goTo(iDot);
                }}
              />
            ))}
          </div>

          <Button
            style={{width: 110}}
            disabled={isNextDisabled}
            onClick={handlePrimary}
          >
            {resolveNextLabel()}
          </Button>
        </div>

        <div className="d-flex d-sm-none flex-column w-100">
          <div className="d-flex justify-content-center w-100 mb-3">
            {Array.from({length: count}).map((_, iDot) => (
              <span
                key={stepEls[iDot].props.id}
                className={`mx-1 rounded-circle ${iDot === index ? 'bg-primary' : 'bg-secondary'}`}
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  cursor: 'pointer',
                  opacity: iDot === index ? 1 : 0.5,
                }}
                onClick={() => {
                  goTo(iDot);
                }}
              />
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center w-100">
            <Button
              variant="outline-secondary"
              disabled={index === 0}
              style={{width: 110}}
              onClick={previous}
            >
              <Trans>Previous</Trans>
            </Button>

            <Button
              style={{width: 110}}
              disabled={isNextDisabled}
              onClick={handlePrimary}
            >
              {resolveNextLabel()}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

Wizard.Step = WizardStep as unknown as <D>(
  properties: WizardStepProperties<D>,
) => React.ReactElement | undefined;

export default Wizard;
