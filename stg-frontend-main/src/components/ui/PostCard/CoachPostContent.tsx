import ImageGallery from './ImageGallery';
import {type UserImage} from '@/api/ApiTypes';
import {MarkdownView} from '@/components/ui/MarkdownView';

type Props = {
  readonly content: string;
  readonly images: UserImage[];
};

export default function CoachPostContent(props: Props) {
  const {content, images} = props;

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
