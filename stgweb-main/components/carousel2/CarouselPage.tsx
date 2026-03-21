import {cloneElement} from 'react';

const atLeast = (min: number, value: number) => {
  if (value < min) {
    return min;
  }

  return value;
};

type Props = {
  readonly children: any;
  readonly index: number;
  readonly emblaActiveIndex?: number;
  readonly emblaTweenValues?: number[];
  readonly emblaScrollTo?: (i: number) => void;
  // opacity: number
};

export const CarouselPage = ({
  children,
  index,
  emblaActiveIndex,
  emblaTweenValues,
  emblaScrollTo,
}: Props) => (
  <div
    key={index}
    className="relative min-w-0 flex-none px-[1rem]"
    style={{
      ...(emblaTweenValues?.length && {
        opacity: atLeast(0.25, emblaTweenValues[index]) || 1,
      }),
    }}
    onClick={() => {
      if (emblaActiveIndex !== index) {
        emblaScrollTo?.(index);
      }
    }}
  >
    <div className="relative flex-none">
      <div className="w-[50vw] min-w-[220px] max-w-[1200px] justify-center">
        {/* {emblaActiveIndex} - {index} - {emblaSlideCount} -{" "}
          {JSON.stringify(index > emblaActiveIndex)} */}
        {children &&
          cloneElement(children, {
            isPageVisible: emblaActiveIndex === index,
            isOnTheLeft: index < (emblaActiveIndex ?? 0),
            isOnTheRight: index > (emblaActiveIndex ?? 0),
          })}
      </div>
    </div>
  </div>
);
