'use client';

import React, {
  type ReactNode,
  cloneElement,
  useCallback,
  useEffect,
  useState,
} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import {flushSync} from 'react-dom';
import {SliderButton} from './SliderButton';
import {cn} from '@/lib/utils';

const TWEEN_FACTOR = 4.2;

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max);

type Parameters_ = {
  readonly children: ReactNode[];
  readonly itemCount: number;
  readonly className?: string;
};

export const CarouselSlider = ({
  children,
  itemCount,
  className,
}: Parameters_) => {
  const onlyOneSlide = itemCount <= 4;
  const onlyTwoSlides = !onlyOneSlide && itemCount > 4 && itemCount <= 8;
  const slideCount = Math.ceil(itemCount / 4);

  const [emblaRef, emblaApi] = useEmblaCarousel({loop: true});
  const [tweenValues, setTweenValues] = useState<number[]>([]);

  // this waits for the transition
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedIndex, setSelectedIndex] = useState(0);
  // this is set immediately
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollPrevious = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    if (onlyTwoSlides) {
      emblaApi.scrollTo(0);
      return;
    }

    emblaApi.scrollPrev();
  }, [emblaApi, onlyTwoSlides]);

  const scrollNext = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    if (onlyTwoSlides) {
      emblaApi.scrollTo(1);
      return;
    }

    emblaApi.scrollNext();
  }, [emblaApi, onlyTwoSlides]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(-1);
    setTimeout(() => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, 1000);
    setActiveIndex(emblaApi.selectedScrollSnap());
    // if we only have one slide, always force user back to that
    if (onlyOneSlide) {
      emblaApi.scrollTo(0);
    }

    // if we only have two slides, go to first page from the second (third is a "placeholder")
    if (onlyTwoSlides && emblaApi.selectedScrollSnap() === 2) {
      emblaApi.scrollTo(0);
    }
  }, [emblaApi, setSelectedIndex, onlyOneSlide, onlyTwoSlides]);

  const onScroll = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    const engine = emblaApi.internalEngine();
    const scrollProgress = emblaApi.scrollProgress();

    const styles = emblaApi.scrollSnapList().map((scrollSnap, index) => {
      let diffToTarget = scrollSnap - scrollProgress;

      if (engine.options.loop) {
        for (const loopItem of engine.slideLooper.loopPoints) {
          const target = loopItem.target();
          if (index === loopItem.index && target !== 0) {
            const sign = Math.sign(target);
            if (sign === -1) {
              diffToTarget = scrollSnap - (1 + scrollProgress);
            }

            if (sign === 1) {
              diffToTarget = scrollSnap + (1 - scrollProgress);
            }
          }
        }
      }

      const tweenValue = 1 - Math.abs(diffToTarget * TWEEN_FACTOR);
      return numberWithinRange(tweenValue, 0, 1);
    });
    setTweenValues(styles);
  }, [emblaApi, setTweenValues]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    onScroll();
    emblaApi.on('scroll', () => {
      flushSync(() => {
        onScroll();
      });
    });
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onScroll);
  }, [emblaApi, onScroll, onSelect]);

  return (
    <div className={cn('mx-auto', className)}>
      <div ref={emblaRef} className="flex items-center overflow-hidden">
        <div className="backface-hidden touch-action[pan-y] flex min-w-0">
          {children?.map((child: any) =>
            cloneElement(child, {
              emblaTweenValues: tweenValues,
              emblaActiveIndex: activeIndex,
              emblaScrollTo: scrollTo,
              emblaSlideCount: slideCount,
            }),
          )}
        </div>
      </div>
      <div className="relative mx-auto max-w-[510px]">
        {!onlyOneSlide && (
          <>
            {(!onlyTwoSlides || activeIndex === 1) && (
              <SliderButton isVisible type="prev" onClick={scrollPrevious} />
            )}
            {(!onlyTwoSlides || activeIndex === 0) && (
              <SliderButton isVisible type="next" onClick={scrollNext} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
