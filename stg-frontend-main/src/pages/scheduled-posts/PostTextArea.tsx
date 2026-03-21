import {useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import {useToasts} from '@/components/toasts';
import {type CreateProxyPostImageResponse} from '@/api/ApiTypes';

type Props = {
  readonly content: string;
  readonly onChange: (updatedContent: string) => void;
};

export default function PostTextArea(props: Props) {
  const {content, onChange} = props;
  const toasts = useToasts();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (image: Blob): Promise<string> => {
    const response = await fetch(`/api/v1/proxy-posts/images`, {
      method: 'POST',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const {path} = (await response.json()) as CreateProxyPostImageResponse;

    return path;
  };

  const onDrop = async (acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        toasts.danger({
          header: 'Oops!',
          body: 'Upload one file at a time',
        });
        return;
      }

      const file = acceptedFiles[0];

      if (file.type.startsWith('image/')) {
        const altText = file.name.replace(/\.[^/.]+$/, '');
        const imageUrl = await handleImageUpload(file);
        const markdownImageTag = `![${altText}](${imageUrl})`;
        insertTextAtCursor(markdownImageTag);
      } else {
        toasts.danger({
          header: 'Oops!',
          body: 'Only images are supported',
        });
      }
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while uploading the image',
      });
    }
  };

  const {getRootProps, getInputProps} = useDropzone({
    onDrop,
    noClick: true,
    maxFiles: 1,
    accept: {
      'image/png': ['.png'], // eslint-disable-line @typescript-eslint/naming-convention
      'image/jpeg': ['.jpeg', '.jpg'], // eslint-disable-line @typescript-eslint/naming-convention
    },
  });

  const insertTextAtCursor = (text: string) => {
    const textarea = textAreaRef.current;
    if (!textarea) {
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const scrollTop = textarea.scrollTop;
    textarea.value =
      textarea.value.slice(0, Math.max(0, startPos)) +
      text +
      textarea.value.slice(endPos, textarea.value.length);
    textarea.focus();
    textarea.selectionStart = startPos + text.length;
    textarea.selectionEnd = startPos + text.length;
    textarea.scrollTop = scrollTop;
    onChange(textarea.value);
  };

  return (
    <div {...getRootProps()} style={{}}>
      <input {...getInputProps()} />

      <TextareaAutosize
        ref={textAreaRef}
        className="form-control"
        value={content}
        name="content"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
