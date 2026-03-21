import {Trans} from '@lingui/macro';
import {
  useState,
  createContext,
  useContext,
  type ReactNode,
  useMemo,
} from 'react';
import {Button} from 'react-bootstrap';
import {Image, X} from 'react-bootstrap-icons';
import {useDropzone} from 'react-dropzone';
import clsx from 'clsx';
import {useToasts} from './toasts';
import {Loader} from './ui/Loader';
import constants from '@/constants';
import {type CreateCommunityUserImageResponse} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';

const uploadImage = async (communityId: string, file: Blob) => {
  const response = await fetch(
    `/api/v1/communities/${communityId}/userimages`,
    {
      method: 'POST',
      headers: {
        'Content-Type': file.type,
      },
      body: file,
    },
  );

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return response.json() as Promise<CreateCommunityUserImageResponse>;
};

type MediaUploadContexType = {
  readonly images: Array<{id?: string; previewUrl: string}>;
  readonly setImages: React.Dispatch<
    React.SetStateAction<
      Array<{
        id?: string | undefined;
        previewUrl: string;
      }>
    >
  >;
  readonly pendingImages: string[];
  readonly setPendingImages: React.Dispatch<React.SetStateAction<string[]>>;
  readonly isUploading: boolean;
  readonly setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
};

const MediaUploadContext = createContext<MediaUploadContexType | undefined>(
  undefined,
);

type MediaUploadProps = {
  readonly existingImages?: Array<{id: string; previewUrl: string}>;
  readonly children: ReactNode;
};

function MediaUpload(props: MediaUploadProps) {
  const {existingImages, children} = props;
  const [images, setImages] = useState<MediaUploadContexType['images']>(
    existingImages ?? [],
  );
  const [pendingImages, setPendingImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const value = useMemo(
    () => ({
      images,
      setImages,
      pendingImages,
      setPendingImages,
      isUploading,
      setIsUploading,
    }),
    [
      images,
      setImages,
      pendingImages,
      setPendingImages,
      isUploading,
      setIsUploading,
    ],
  );

  return (
    <MediaUploadContext.Provider value={value}>
      {children}
    </MediaUploadContext.Provider>
  );
}

type TriggerProps = {
  readonly className?: string;
};

function Trigger(props: TriggerProps) {
  const context = useContext(MediaUploadContext);
  if (!context)
    throw new Error(
      'MediaUpload.Trigger component cannot be rendered outside the MediaUpload component',
    );

  const {setImages, setPendingImages, setIsUploading} = context;
  const {className} = props;

  const {currentUser} = useCurrentUser();
  const communityId = currentUser?.selectedCommunity;

  const toasts = useToasts();

  const dropzone = useDropzone({
    noClick: true,
    noKeyboard: true,
    maxFiles: 5,
    maxSize: constants.MAX_FILE_SIZE_IN_BYTES,
    accept: {
      'image/png': ['.png'], // eslint-disable-line @typescript-eslint/naming-convention
      'image/jpg': ['.jpg', '.jpeg'], // eslint-disable-line @typescript-eslint/naming-convention
    },
    onDropRejected() {
      toasts.danger({
        header: 'Invalid file',
        body: 'The file might be too large or be in an unsupported format',
      });
    },
    async onDropAccepted(acceptedFiles) {
      if (!communityId) return;

      setIsUploading(true);

      for (const file of acceptedFiles) {
        setPendingImages((currentPendingImages) => [
          ...currentPendingImages,
          URL.createObjectURL(file),
        ]);
      }

      const newImageUploads = acceptedFiles.map(async (file) => {
        try {
          const uploadResponse = await uploadImage(communityId, file);
          const previewUrl = URL.createObjectURL(file);
          return {id: uploadResponse._id, previewUrl};
        } catch {
          toasts.danger({
            header: 'Upload failed',
            body: 'Image upload failed. Please try again.',
          });
          return {id: undefined, previewUrl: ''};
        }
      });
      const newImages = await Promise.all(newImageUploads);
      setImages((currentImages) => [
        ...currentImages,
        ...newImages.filter((i) => i.id),
      ]);
      setPendingImages([]);
      setIsUploading(false);
    },
  });

  return (
    <>
      <input {...dropzone.getInputProps()} type="file" className="d-none" />
      <Button
        className={className}
        variant="outline-secondary"
        onClick={dropzone.open}
      >
        <div className="d-flex gap-2 align-items-center">
          <Image />
          <div style={{marginBottom: -2}}>
            <Trans>
              <span className="d-none d-sm-inline">Add</span>{' '}
              <span className="text-sm-lowercase">Images</span>
            </Trans>
          </div>
        </div>
      </Button>
    </>
  );
}

type PreviewProps = {
  readonly className?: string;
};

function Preview(props: PreviewProps) {
  const context = useContext(MediaUploadContext);
  if (!context)
    throw new Error(
      'MediaUpload.Trigger component cannot be rendered outside the MediaUpload component',
    );

  const {className} = props;

  const {images, setImages, pendingImages} = context;

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const previewImages = useMemo(() => {
    return [
      ...images.map(({previewUrl}) => ({
        url: previewUrl,
        isPending: false,
      })),
      ...pendingImages.map((previewUrl) => ({
        url: previewUrl,
        isPending: true,
      })),
    ];
  }, [images, pendingImages]);

  if (previewImages.length === 0) return null;

  return (
    <div className={clsx('d-flex flex-wrap gap-2', className)}>
      {previewImages.map(({url, isPending}, index) => (
        <div
          key={url}
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
          }}
        >
          {isPending ? (
            <div className="d-flex justify-content-center align-items-center bg-black bg-opacity-75 position-absolute w-100 h-100">
              <Loader />
            </div>
          ) : (
            <Button
              style={{
                width: '1.5rem',
                height: '1.5rem',
                position: 'absolute',
                top: -5,
                right: -5,
                padding: 0,
              }}
            >
              <X
                style={{
                  marginTop: -3,
                  marginLeft: -1,
                  width: '1.5rem',
                  height: '1.5rem',
                }}
                onClick={() => {
                  handleImageRemove(index);
                }}
              />
            </Button>
          )}
          <img
            src={url}
            alt="preview"
            className="rounded"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            onLoad={() => {
              if (isPending) URL.revokeObjectURL(url);
            }}
          />
        </div>
      ))}
    </div>
  );
}

export const useMediaUpload = () => {
  const mediaUploadContext = useContext(MediaUploadContext);

  if (!mediaUploadContext) {
    throw new Error('useMediaUpload has to be used within <MediaUpload>');
  }

  return mediaUploadContext;
};

MediaUpload.Trigger = Trigger;
MediaUpload.Preview = Preview;

export default MediaUpload;
