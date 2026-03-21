import {useRef} from 'react';
import {useDropzone} from 'react-dropzone';
import TextareaAutosize from 'react-textarea-autosize';
import {type CreateArticleImageResponse} from '@client/ApiTypes';
import {useToasts} from '@/components/toasts/index.js';

type EditMaterialProperties = {
  readonly content: string;
  readonly onChange: (updatedContent: string) => void;
};

export default function ArticleTextArea(properties: EditMaterialProperties) {
  const {content, onChange} = properties;
  const toasts = useToasts();
  const textAreaReference = useRef<HTMLTextAreaElement>(null);

  const handleImageUpload = async (image: Blob): Promise<string> => {
    const response = await fetch(`/api/v1/articles/images`, {
      method: 'POST',
      headers: {
        'Content-Type': image.type,
      },
      body: image,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const {path} = (await response.json()) as CreateArticleImageResponse;

    return path;
  };

  const handleAttachmentUpload = async (attachment: File): Promise<string> => {
    const response = await fetch(
      `/api/v1/articles/attachments/${attachment.name}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': attachment.type,
        },
        body: attachment,
      },
    );

    if (!response.ok) {
      throw new Error('Failed to upload attachment');
    }

    const {path} = (await response.json()) as CreateArticleImageResponse;

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
      } else if (file.type.startsWith('application/pdf')) {
        const attachmentUrl = await handleAttachmentUpload(file);
        const markdownAttachmentTag = `[${file.name}](${attachmentUrl})`;
        insertTextAtCursor(markdownAttachmentTag);
      } else {
        toasts.danger({
          header: 'Oops!',
          body: 'Only images and PDFs are supported',
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
      'application/pdf': ['.pdf'], // eslint-disable-line @typescript-eslint/naming-convention
    },
  });

  const insertTextAtCursor = (text: string) => {
    const textarea = textAreaReference.current;
    if (!textarea) {
      return;
    }

    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const {scrollTop} = textarea;
    textarea.value =
      textarea.value.slice(0, Math.max(0, startPos)) +
      text +
      textarea.value.slice(endPos);
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
        ref={textAreaReference}
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
