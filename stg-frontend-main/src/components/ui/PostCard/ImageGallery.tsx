import {useState} from 'react';
import Lightbox from 'yet-another-react-lightbox'; // eslint-disable-line import/no-named-as-default
import PhotoAlbum from 'react-photo-album'; // eslint-disable-line import/no-named-as-default
import clsx from 'clsx';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import 'yet-another-react-lightbox/styles.css';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import {type UserImage} from '@/api/ApiTypes';
import useBreakpoint from '@/hooks/useBreakpoint';
import constants from '@/constants';

type Props = {
  readonly images: UserImage[];
};

export default function ImageGallery(props: Props) {
  const {images} = props;
  const breakpoint = useBreakpoint();
  const [index, setIndex] = useState(-1);

  const slides = images.map((image) => {
    return {
      src: `${constants.FILE_HOST}${image.resizedImageUrl}`,
      width: (image.aspectRatio > 1 ? image.aspectRatio : 1) * 1600,
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
      <PhotoAlbum
        layout="columns"
        photos={slides}
        targetRowHeight={150}
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
        renderPhoto={({
          imageProps: {src, alt, style, className, ...restImageProps},
        }) => {
          if (images.length === 1 && images[0].aspectRatio < 1) {
            style = {
              ...style,
              maxHeight: 500,
              maxWidth: 500 * images[0].aspectRatio,
              margin: 'auto',
            };
          }

          return (
            <img
              src={src}
              alt={alt}
              style={style}
              {...restImageProps}
              className={clsx(className, 'z-2')}
            />
          );
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
