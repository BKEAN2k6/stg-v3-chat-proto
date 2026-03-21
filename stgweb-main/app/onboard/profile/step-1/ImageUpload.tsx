'use client';

import React, {useState} from 'react';
import Link from 'next/link';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {AVATAR_FOLDER_ID, PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {getImageData, resizeImage} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useAnalytics from '@/hooks/useAnalytics';
import {Loader} from '@/components/atomic/atoms/Loader';

const texts = {
  uploading: {
    'en-US': 'Uploading...',
    'fi-FI': 'Lataa...',
    'sv-SE': 'Laddar upp...',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
  addLaterButton: {
    'en-US': 'Add later',
    'fi-FI': 'Lisää myöhemmin',
    'sv-SE': 'Lägg till senare',
  },
  failedToUpload: {
    'en-US': 'Failed to upload file.',
    'fi-FI': 'Tiedoston lataaminen epäonnistui.',
    'sv-SE': 'Det gick inte att ladda upp filen.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const DEBUG = process.env.NODE_ENV === 'development';

export const ImageUpload = () => {
  const cookies = useCookies();
  const {recordEvent} = useAnalytics();
  const locale = getLocaleCode(cookies.get('locale'));

  const {getLoggedInUserId} = useAuth();
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);
  const [nextPage, setNextPage] = useState<string | undefined>(undefined);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    await refreshAuthIfExpired();
    const directus = createClientSideDirectusClient();

    const folderId = AVATAR_FOLDER_ID;

    const file = event?.target?.files?.[0];
    const imageData = getImageData(file!);
    const resizedFile = (await resizeImage(file!, imageData, 200)) as Blob;
    if (folderId && file && resizedFile) {
      setImage(URL.createObjectURL(file));

      const formData = new FormData();
      const newFileId = crypto.randomUUID();
      const loggedInUserId = getLoggedInUserId() ?? '';
      const newFileTitle = `avatar_for_${loggedInUserId.slice(0, 8)}`;
      formData.append('id', newFileId);
      formData.append('title', newFileTitle);
      formData.append('folder', folderId);
      formData.append('storage', 's3');
      formData.append('file', resizedFile);

      setIsLoadingUpload(true);
      try {
        await directus.files.createOne(formData);
        await directus.users.me.update({
          avatar: newFileId,
        });
      } catch (error) {
        setImage(undefined);
        console.error((error as Error).message);
        toast.error(t('failedToUpload', locale));
      }

      setIsLoadingUpload(false);
      recordEvent('profile-onboarding:upload_avatar', {
        width: imageData?.width,
        height: imageData?.height,
        type: file?.type,
        size: file?.size,
      });
    } else {
      if (DEBUG) {
        console.error('no folder, file, or resizedFile set');
      } // prettier-ignore

      toast.error(t('failedToUpload', locale));
    }
  };

  const handleUploadStart = (event: any) => {
    event?.preventDefault();
    recordEvent('profile-onboarding:start_add_avatar');
    document?.getElementById?.('file-upload')?.click();
  };

  useLegacyEffect(() => {
    const run = async () => {
      localStorage.removeItem('refreshing_auth');
      await refreshAuthIfExpired();
      const directus = createClientSideDirectusClient();
      const user = await directus.users.me.read();
      if (user.expires_at) {
        // move to setting username and password
        setNextPage(PATHS.profileOnboardingStep2);
      } else {
        // if user isn't set to expire, they are already set, so go to profile with intro
        setNextPage(`${PATHS.profile}?tour=intro1`);
      }
    };

    run();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="flex h-[128px] min-h-[128px] w-[128px] min-w-[128px] cursor-pointer items-center justify-center rounded-full border border-dashed border-gray-500">
        <a
          href="#"
          className="flex h-full w-full items-center justify-center"
          onClick={handleUploadStart}
        >
          {isLoadingUpload ? (
            <Loader />
          ) : image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt="Preview"
              className="h-full w-full rounded-full"
            />
          ) : (
            <ImagePlaceholderIcon />
          )}
        </a>
        <input
          id="file-upload"
          type="file"
          accept="image/*"
          title="avatar-image"
          placeholder="Avatar image"
          style={{display: 'none'}}
          onChange={handleUpload}
        />
      </div>
      <div className="mt-8">
        {isLoadingUpload ? (
          <span>{t('uploading', locale)}</span>
        ) : (
          <Link href={nextPage ?? '#'} className="hover:underline">
            {image ? t('continueButton', locale) : t('addLaterButton', locale)}
          </Link>
        )}
      </div>
    </div>
  );
};

const ImagePlaceholderIcon = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="20" cy="20" r="20" fill="white" />
    <path
      d="M26.25 13.125H13.75C12.7145 13.125 11.875 13.9645 11.875 15V25C11.875 26.0355 12.7145 26.875 13.75 26.875H26.25C27.2855 26.875 28.125 26.0355 28.125 25V15C28.125 13.9645 27.2855 13.125 26.25 13.125Z"
      stroke="#282C34"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M23.125 18.125C23.8154 18.125 24.375 17.5654 24.375 16.875C24.375 16.1846 23.8154 15.625 23.125 15.625C22.4346 15.625 21.875 16.1846 21.875 16.875C21.875 17.5654 22.4346 18.125 23.125 18.125Z"
      stroke="#282C34"
      strokeWidth="1.5"
      strokeMiterlimit="10"
    />
    <path
      d="M21.875 23.1171L18.3336 19.5823C18.1082 19.357 17.8054 19.2263 17.4868 19.2169C17.1683 19.2074 16.8582 19.32 16.6199 19.5315L11.875 23.7503"
      stroke="#282C34"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.75 26.8752L23.568 22.0572C23.7883 21.8364 24.0832 21.706 24.3948 21.6915C24.7064 21.6771 25.0121 21.7796 25.252 21.9791L28.125 24.3752"
      stroke="#282C34"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
