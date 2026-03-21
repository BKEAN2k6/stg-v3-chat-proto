import {useCallback, useEffect} from 'react';
import Lightbox, { // eslint-disable-line import/no-named-as-default
  type Slide,
  type CustomSlide,
} from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import {useWindowSize} from 'react-use';
import fm from 'front-matter';
import AutoScaleSlide from './AutoScaleSlide';
import {usePlayerContext} from '@/context/Video/PlayerProvider';

declare module 'yet-another-react-lightbox' {
  export type CustomSlide = {
    type: 'custom-slide';
    content: string;
    slideNumber: number;
    slideCount: number;
  } & GenericSlide;

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SlideTypes {
    'custom-slide': CustomSlide;
  }
}

type ArticleAttributes = {
  layout?: 'default' | 'centered' | 'full' | 'notes';
  color: string;
  background: string;
  backgroundColor: string;
  paddingTop: string | number;
  paddingBottom: string | number;
  paddingLeft: string | number;
  paddingRight: string | number;
};

function isCustomSlide(slide: Slide): slide is CustomSlide {
  return slide.type === 'custom-slide';
}

type Props = {
  readonly content: string[];
  readonly isSlideLightboxOpen: boolean;
  readonly slideIndex: number;
  readonly onEnded: () => void;
  readonly onClose: () => void;
  readonly onView: (index: number) => void;
};

export default function SlideLightbox(props: Props) {
  const {stopAllPlayers} = usePlayerContext();
  const {width, height} = useWindowSize();
  const {content, slideIndex, onEnded, onClose, onView, isSlideLightboxOpen} =
    props;

  const onSlideEnd = useCallback(() => {
    onEnded();
    const container = document.querySelector('.yarl__container');
    if (container instanceof HTMLElement) {
      container.focus();
    }
  }, [onEnded]);

  useEffect(() => {
    return () => {
      stopAllPlayers();
    };
  }, [slideIndex, stopAllPlayers]);

  let fullScreenWidth;
  let fullScreenHeight;

  if (width / height > 16 / 9) {
    fullScreenWidth = height * (16 / 9);
    fullScreenHeight = height;
  } else {
    fullScreenWidth = width;
    fullScreenHeight = width * (9 / 16);
  }

  return (
    <Lightbox
      styles={{
        slide: {
          padding: '0',
          backgroundColor: 'black',
        },
      }}
      carousel={{finite: true}}
      slides={content.map(
        (section, index): CustomSlide => ({
          type: 'custom-slide',
          content: section,
          slideNumber: index + 1,
          slideCount: content.length,
        }),
      )}
      render={{
        slide({slide}) {
          if (isCustomSlide(slide)) {
            const {content, slideNumber, slideCount} = slide;
            const {body, attributes} = fm(content);
            const {
              layout,
              color,
              background = 'default',
              backgroundColor,
              paddingTop = '50px',
              paddingBottom = '50px',
              paddingLeft = '50px',
              paddingRight = '50px',
            } = attributes as ArticleAttributes;

            return (
              <div
                style={{
                  width: fullScreenWidth,
                  height: fullScreenHeight,
                }}
              >
                <AutoScaleSlide
                  isVideoFullScreenDisabled
                  body={body}
                  layout={layout}
                  color={color}
                  background={background}
                  backgroundColor={backgroundColor}
                  paddingTop={paddingTop}
                  paddingBottom={paddingBottom}
                  paddingLeft={paddingLeft}
                  paddingRight={paddingRight}
                  slideNumber={slideNumber}
                  slideCount={slideCount}
                  onEnded={onSlideEnd}
                />
              </div>
            );
          }

          return null;
        },
        buttonPrev: slideIndex === 0 ? () => null : undefined,
        buttonNext: slideIndex === content.length - 1 ? () => null : undefined,
      }}
      plugins={[Fullscreen]}
      open={isSlideLightboxOpen}
      index={slideIndex}
      close={() => {
        onClose();
      }}
      on={{
        view({index}) {
          onView(index);
        },
      }}
    />
  );
}
