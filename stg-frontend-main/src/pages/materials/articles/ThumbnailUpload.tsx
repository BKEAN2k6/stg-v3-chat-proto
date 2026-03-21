import {Form} from 'react-bootstrap';
import {type CreateArticleThumbnailResponse} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';

type Props = {
  readonly onChange: (path: string) => void;
};

export default function ThumbnailUpload(props: Props) {
  const {onChange} = props;
  const toasts = useToasts();

  const handleImageUpload = async (image: Blob): Promise<string> => {
    const response = await fetch(`/api/v1/articles/thumbnails`, {
      method: 'POST',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const {path} = (await response.json()) as CreateArticleThumbnailResponse;

    return path;
  };

  const handleThumbnailChange = async (event: {target: {files: File[]}}) => {
    try {
      const imageUrl = await handleImageUpload(event.target.files[0]);
      onChange(imageUrl);
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while uploading the thumbnail',
      });
    }
  };

  return (
    <Form.Control
      type="file"
      name="thumbnail"
      accept="image/*"
      onChange={(event) => {
        void handleThumbnailChange(
          event as unknown as {target: {files: File[]}},
        );
      }}
    />
  );
}
