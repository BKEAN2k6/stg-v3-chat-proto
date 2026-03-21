import {type UserImage} from '@client/ApiTypes';
import ImageGallery from './ImageGallery.js';
import {MarkdownView} from '@/components/ui/MarkdownView.js';

type Properties = {
  readonly content: string;
  readonly images: UserImage[];
};

export default function CoachPostContent(properties: Properties) {
  const {content, images} = properties;

  if (content === '' && images.length === 0) {
    return null;
  }

  return (
    <div className="d-flex flex-column text-break">
      <MarkdownView content={content} />
      <ImageGallery images={images} />
    </div>
  );
}
