'use client';

import {useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {DATA_API_URL} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {getImageData, resizeImage} from '@/lib/utils';
import useAnalytics from '@/hooks/useAnalytics';
import {ImageIcon} from '@/components/atomic/atoms/ImageIcon';

const texts = {
  uploadingText: {
    'en-US': 'Uploading...',
    'sv-SE': 'Laddar upp...',
    'fi-FI': 'Ladataan...',
  },
  addImageText: {
    'en-US': 'Add photo',
    'sv-SE': 'Lägg till bild',
    'fi-FI': 'Lisää kuva',
  },
  failedToUpload: {
    'en-US': 'Failed to upload file.',
    'sv-SE': 'Det gick inte att ladda upp filen.',
    'fi-FI': 'Tiedoston lisääminen epäonnistui.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly onFileChange: (fileId: string) => void;
  readonly onUploadStarted: () => void;
  readonly onUploadDone: (fileId: string | undefined) => void;
  readonly fileId?: string | undefined;
  readonly folderId?: string | undefined;
  readonly authToken?: string;
  readonly peekAccessToken?: string | undefined;
};

export const MediaButton = (props: Props) => {
  const {
    onFileChange,
    onUploadStarted,
    onUploadDone,
    peekAccessToken,
    fileId,
    authToken,
  } = props;
  const {recordEvent} = useAnalytics();
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const searchParameters = useSearchParams();

  const target = searchParameters.get('target')!;

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    onUploadStarted();
    event.preventDefault();
    setIsLoadingUpload(true);

    await refreshAuthIfExpired();
    const directus = createClientSideDirectusClient();

    let folderId;

    if (target === 'other') {
      folderId = props.folderId;
    } else {
      try {
        let fields: string[] = [];
        if (target === 'self') {
          fields = ['swl_wall.media_folder'];
        }

        if (target === 'org') {
          fields = ['active_organization.swl_wall.media_folder'];
        } // prettier-ignore

        const folderDataCall = await directus.users.me.read({
          fields,
        });
        // console.log('fd', folderDataCall)
        if (target === 'self') {
          folderId = folderDataCall.swl_wall.media_folder;
        }

        if (target === 'org') {
          folderId = folderDataCall.active_organization.swl_wall.media_folder;
        } // prettier-ignore
      } catch (error) {
        console.error((error as Error).message);
        toast.error(t('failedToUpload', locale));
        onUploadDone(undefined);
        return;
      }
    }

    const file = event?.target?.files?.[0];
    const imageData = getImageData(file!);
    const resizedFile = (await resizeImage(file!, imageData)) as Blob;
    let newFileId;
    // NOTE: this might fail in a non HTTPS environment (or non localhost)
    // see for example:
    try {
      newFileId = crypto.randomUUID();
    } catch {
      toast.error(t('failedToUpload', locale));
      setIsLoadingUpload(false);
      onUploadDone(undefined);
      return;
    }

    if (folderId && file && resizedFile) {
      const formData = new FormData();
      const now = new Date();
      const newFileTitle = `${now.toISOString()}_${now.getTime()}`;
      formData.append('id', newFileId);
      formData.append('title', newFileTitle);
      formData.append('folder', folderId);
      formData.append('storage', 's3');
      formData.append('peek_access_token', peekAccessToken ?? '');
      formData.append('file', resizedFile);

      try {
        await directus.files.createOne(formData);
      } catch (error) {
        setImage(undefined);
        console.error((error as Error).message);
        toast.error(t('failedToUpload', locale));
        onUploadDone(newFileId);
        setIsLoadingUpload(false);
        return;
      }

      setIsLoadingUpload(false);
      setImage(URL.createObjectURL(file));
      onFileChange(newFileId);
      recordEvent('seethegood:upload_image', {
        width: imageData?.width,
        height: imageData?.height,
        type: file?.type,
        size: file?.size,
      });
    } else {
      console.error('no folder, file, or resizedFile set');
      toast.error(t('failedToUpload', locale));
    }

    onUploadDone(newFileId);
  };

  const handleSelectMediaClick = (event: any) => {
    event?.preventDefault();
    recordEvent('seethegood:start_add_image');
    document?.getElementById?.('file-upload')?.click();
  };

  if (!image && !fileId) {
    return (
      <>
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-100 p-4"
          disabled={isLoadingUpload}
          onClick={handleSelectMediaClick}
        >
          <div className="w-full text-left">
            {isLoadingUpload ? (
              <div className="flex space-x-4">
                <div className="flex items-center justify-center">
                  <div className="loader h-5 w-5 rounded-full border-4 border-gray-200 ease-linear" />
                </div>
                <span>{t('uploadingText', locale)}</span>
              </div>
            ) : (
              <span className="font-bold">{t('addImageText', locale)}</span>
            )}
          </div>
          <div
            className="flex items-center justify-center"
            style={{width: 32, height: 32}}
          >
            <ImageIcon style={{width: 16, height: 16}} />
          </div>
        </button>

        <input
          id="file-upload"
          type="file"
          accept="image/*"
          style={{display: 'none'}}
          onChange={handleUpload}
        />
      </>
    );
  }

  return (
    <div className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-100">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={
          image ?? `${DATA_API_URL}/assets/${fileId}?access_token=${authToken}`
        }
        alt="Preview"
        className="h-full w-full rounded-md object-cover"
      />
    </div>
  );
};
