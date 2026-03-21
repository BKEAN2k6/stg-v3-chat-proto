import {useMemo, useRef, useState} from 'react';
import Form from 'react-bootstrap/Form';
import clsx from 'clsx';
import {useDropzone} from 'react-dropzone';
import AvatarEditor from 'react-avatar-editor';
import {Button} from 'react-bootstrap';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {ZoomIn, ZoomOut} from 'react-bootstrap-icons';
import {useToasts} from '../toasts';
import Avatar from './Avatar';
import {confirm} from './confirm';
import {Loader} from './Loader';
import constants from '@/constants';

type AvatarInputProps = {
  readonly color: string;
  readonly name: string;
  readonly className?: string;
  readonly existingAvatar?: string;
  readonly onSave: (image: Blob) => Promise<void>;
  readonly onDelete?: () => void;
};

async function canvasToBlobPromise(
  canvas: HTMLCanvasElement,
  mimeType?: string,
  qualityArgument?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      mimeType,
      qualityArgument,
    );
  });
}

export default function AvatarInput(props: AvatarInputProps) {
  const {_} = useLingui();
  const {className, existingAvatar, onSave, onDelete} = props;
  const toasts = useToasts();

  const [image, setImage] = useState<File | string>('');
  const [scale, setScale] = useState(1);
  const [hasNewImage, setHasNewImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const editorRef = useRef<AvatarEditor>(null);

  const dropzone = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 1,
    maxSize: constants.MAX_FILE_SIZE_IN_BYTES,
    accept: {
      'image/png': ['.png'], // eslint-disable-line @typescript-eslint/naming-convention
      'image/jpg': ['.jpg', '.jpeg'], // eslint-disable-line @typescript-eslint/naming-convention
    },
    onDropRejected() {
      toasts.danger({
        header: _(msg`Invalid file`),
        body: _(
          msg`The file might be too large or be in an unsupported format`,
        ),
      });
    },
    async onDropAccepted(acceptedFiles) {
      setImage(acceptedFiles[0]);
      setHasNewImage(true);
    },
  });

  const handleSave = async () => {
    if (!editorRef?.current) {
      showFailToast();
      return;
    }

    const canvas = editorRef.current.getImageScaledToCanvas();
    const imageBlob = await canvasToBlobPromise(canvas, 'image/jpeg', 1);
    if (!imageBlob) {
      showFailToast();
      return;
    }

    setScale(1);
    setIsSaving(true);
    await onSave(imageBlob);
    setIsSaving(false);
    setHasNewImage(false);
  };

  const showFailToast = () => {
    toasts.danger({
      header: _(msg`Image upload failed.`),
      body: _(
        msg`Failed to upload the image. Please try again with another image.`,
      ),
    });
  };

  const handleClear = async () => {
    if (hasNewImage) {
      setImage('');
      setScale(1);
      setHasNewImage(false);
    } else {
      await handleImageDelete();
    }
  };

  const handleImageDelete = async () => {
    const confirmed = await confirm({
      title: _(msg`Remove avatar`),
      text: _(
        msg`Are you sure you want to remove your avatar image? This can't be undone.`,
      ),
      cancel: _(msg`No, cancel`),
      confirm: _(msg`Yes, remove`),
    });

    if (!confirmed) {
      return;
    }

    setImage('');
    setScale(1);
    setHasNewImage(false);
    onDelete?.();
  };

  const Wrapper = useMemo(() => {
    return ({children}: {readonly children: React.ReactNode}) => (
      <Form.Group className={clsx(className)}>
        <div className="d-inline-flex flex-column">
          <Form.Label className="visually-hidden">Avatar</Form.Label>
          {children}
        </div>
      </Form.Group>
    );
  }, [className]);

  if (isSaving) {
    return (
      <Wrapper>
        <div
          className="d-flex justify-content-center align-items-center"
          style={{width: 180, height: 120}}
        >
          <Loader />
        </div>
      </Wrapper>
    );
  }

  if (hasNewImage) {
    return (
      <Wrapper>
        <div className="d-flex flex-column gap-2">
          <div className="d-flex justify-content-center">
            <AvatarEditor
              ref={editorRef}
              width={120}
              height={120}
              style={{borderRadius: '50%'}}
              border={0}
              scale={scale}
              image={image}
              color={[255, 255, 255, 0.6]} // RGBA
            />
          </div>
          <input {...dropzone.getInputProps()} type="file" className="d-none" />
          <div style={{width: 180}}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <ZoomOut />
              <Form.Range
                value={scale}
                min={1}
                max={10}
                step={0.1}
                onChange={(event) => {
                  setScale(Number.parseFloat(event.target.value));
                }}
              />
              <ZoomIn />
            </div>
            <div className="d-flex flex-column">
              <Button type="button" className="mb-2" onClick={handleSave}>
                <Trans>Save</Trans>
              </Button>
              <Button variant="secondary" type="button" onClick={handleClear}>
                <Trans>Clear</Trans>
              </Button>
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="d-flex flex-column gap-2">
        {existingAvatar && (
          <div className="d-flex justify-content-center">
            <Avatar
              size={120}
              path={existingAvatar}
              name={props.name}
              color={props.color}
            />
          </div>
        )}
        <input {...dropzone.getInputProps()} type="file" className="d-none" />
        <div style={{width: 180}}>
          <div className="d-flex flex-column">
            <Button type="button" className="mb-2" onClick={dropzone.open}>
              <Trans>Select image</Trans>
            </Button>
            {existingAvatar && (
              <Button variant="secondary" type="button" onClick={handleClear}>
                <Trans>Clear current</Trans>
              </Button>
            )}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}
