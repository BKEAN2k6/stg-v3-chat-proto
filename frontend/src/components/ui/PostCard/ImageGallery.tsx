import {useState} from 'react';
import Lightbox from 'yet-another-react-lightbox';
import {ColumnsPhotoAlbum} from 'react-photo-album';
import 'react-photo-album/columns.css';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import {type UserImage} from '@client/ApiTypes';
import useBreakpoint from '@/hooks/useBreakpoint.js';
import constants from '@/constants.js';

type Properties = {
  readonly images: UserImage[];
};

export default function ImageGallery(properties: Properties) {
  const {images} = properties;
  const breakpoint = useBreakpoint();
  const [index, setIndex] = useState(-1);

  const slides = images.map((image) => {
    return {
      src: `${constants.FILE_HOST}${image.resizedImageUrl}`,
      width: Math.max(image.aspectRatio, 1) * 1600,
      height: (image.aspectRatio > 1 ? 1 : 1 / image.aspectRatio) * 1600,
    };
  });
  const isFullscreenEnabled = () =>
    document.fullscreenEnabled ??
    document.webkitFullscreenEnabled ??
    document.mozFullScreenEnabled ??
    document.msFullscreenEnabled;

  const fullScreenPlugins = [Counter];
  if (slides.length > 1 && ['lg', 'xl', 'xxl'].includes(breakpoint)) {
    fullScreenPlugins.push(Thumbnails);
  }

  if (isFullscreenEnabled()) {
    fullScreenPlugins.push(Fullscreen);
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="mb-3">
      <ColumnsPhotoAlbum
        photos={slides}
        columns={() => {
          if (images.length > 3) {
            return 3;
          }

          if (images.length > 1) {
            return 2;
          }

          return 1;
        }}
        spacing={2}
        render={{
          image({onClick}, {photo}) {
            return (
              <img
                src={photo.src}
                style={
                  images.length === 1 && images[0].aspectRatio < 1
                    ? {
                        maxHeight: 500,
                        maxWidth: 500 * images[0].aspectRatio,
                        margin: 'auto',
                      }
                    : undefined
                }
                className="react-photo-album--image"
                loading="lazy"
                decoding="async"
                onClick={onClick}
              />
            );
          },
        }}
        onClick={({index}) => {
          setIndex(index);
        }}
      />

      <Lightbox
        plugins={fullScreenPlugins}
        carousel={{finite: true}}
        render={{
          buttonPrev: index === 0 ? () => null : undefined,
          buttonNext: index === slides.length - 1 ? () => null : undefined,
        }}
        thumbnails={{
          showToggle: true,
        }}
        index={index}
        slides={slides}
        open={index >= 0}
        close={() => {
          setIndex(-1);
        }}
        on={{
          view({index}) {
            setIndex(index);
          },
        }}
      />
    </div>
  );
}
