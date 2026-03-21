'use client';

import {useState} from 'react';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import {toast} from 'react-hot-toast';
import {SeeTheGoodSelectedItems} from '../CarouselSelectedItems';
import {MediaButton} from './MediaButton';
import {NoteButton} from './NoteButton';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {getLocaleCode} from '@/lib/locale';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {generateId, notify} from '@/lib/utils';
import useAuth from '@/hooks/use-auth';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import useDashboard from '@/hooks/useDashboard';
import useGlobal from '@/hooks/useGlobal';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {Loader} from '@/components/atomic/atoms/Loader';
import useCarousel from '@/components/carousel/useCarousel';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';

const texts = {
  customizationOptional: {
    'en-US': 'Customizing is optional. Click below to send just the strength.',
    'sv-SE':
      'Anpassning är valfritt. Klicka nedan för att skicka bara styrkan.',
    'fi-FI':
      'Mukauttaminen ei ole pakollista. Klikkaa alla olevaa nappia lähettääksesi vain vahvuuden.',
  },
  sendButton: {
    'en-US': 'Send',
    'sv-SE': 'Skicka',
    'fi-FI': 'Lähetä',
  },
  somethingWentWrong: {
    'en-US': 'Something went wrong. Try again later.',
    'sv-SE': 'Något gick fel. Försök igen senare.',
    'fi-FI': 'Jokin meni pieleen. Yritä myöhemmin uudelleen.',
  },
  tryAgain: {
    'en-US': 'Try again',
    'sv-SE': 'Försök igen',
    'fi-FI': 'Yritä uudelleen',
  },
  failedToUpdate: {
    'en-US': 'Failed to post.',
    'sv-SE': 'Misslyckades med att posta.',
    'fi-FI': 'Lähettäminen epäonnistui.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const CustomizePage = () => {
  const {globalState} = useGlobal();
  const {dashboardState} = useDashboard();
  const {selectedUserData} = useCarousel();
  const {getLoggedInUserId} = useAuth();
  const router = useRouter();
  const cookies = useCookies();
  const pathname = usePathname();
  const searchParameters = useSearchParams();
  const locale = getLocaleCode(cookies.get('locale'));

  const [isLoadingContinue, setIsLoadingContinue] = useState(false);
  const [fileId, setFileId] = useState<string | undefined>(undefined);
  const [note, setNote] = useState<string | undefined>(undefined);
  const [createdMomentId, setCreatedMomentId] = useState<string | undefined>(
    undefined,
  );
  const [createFailed, setCreateFailed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [targetMediaFolder, setTargetMediaFolder] = useState<
    string | undefined
  >(undefined);
  const [peekAccessToken, setPeekAccessToken] = useState<string | undefined>(
    undefined,
  );

  const target = searchParameters.get('target')!;
  const strength = searchParameters.get('strength') as StrengthSlug;
  const mid = searchParameters.get('mid') as StrengthSlug;
  const tmfid = searchParameters.get('tmfid') ?? undefined;
  const pat = searchParameters.get('pat') ?? undefined;
  const fid = searchParameters.get('fid') ?? undefined;

  const query = new URLSearchParams({
    'target-data': searchParameters.get('target-data')!,
    target,
    strength,
  });

  const handleFileChange = (newFileId: string) => {
    setFileId(newFileId);
  };

  const handleUploadStarted = () => {
    setUploading(true);
  };

  const handleUploadDone = (fileId: string | undefined) => {
    // put uploaded file id into url
    if (fileId) {
      const newQuery = new URLSearchParams(
        Array.from(searchParameters.entries()),
      );
      newQuery.append('fid', fileId);
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      router.replace(`${pathname}?${newQuery}`);
    }

    setUploading(false);
  };

  const handleNoteChange = (newNote: string) => {
    setNote(newNote);
  };

  const handleContinue = async () => {
    if (!createdMomentId) {
      return;
    }

    setIsLoadingContinue(true);
    await refreshAuthIfExpired();
    const directus = createClientSideDirectusClient();
    try {
      await directus.items('swl_moment').updateOne(createdMomentId, {
        status: 'published',
        ...(note && {markdown_content: note}),
        ...(fileId && {files: [{directus_files: fileId}]}),
      });
      await notify({
        target,
        loggedInUserId: getLoggedInUserId(),
        recipientId: selectedUserData.id,
        peekAccessToken,
        wsocEventType: 'moment_created',
        wsocEventListenerValue: selectedUserData.swlId,
        wsocEventLookupValue: createdMomentId,
      });
      router.push(PATHS.seeTheGoodModalComplete);
    } catch {
      setIsLoadingContinue(false);
      toast.error(t('failedToUpdate', locale));
    }
  };

  const handleCreate = async () => {
    const newPeekAccessToken = generateId(32);
    setPeekAccessToken(newPeekAccessToken);

    await refreshAuthIfExpired();

    // CASE FOR SENDING TO OTHERS
    if (target === 'other') {
      try {
        const call = await fetch(PATHS.postToUsersWall, {
          method: 'POST',
          body: JSON.stringify({
            targetSwlWallId: selectedUserData.swlId,
            peekAccessToken: newPeekAccessToken,
            strengths: [{strength: StrengthIDMap[strength]}],
          }),
        });
        const body = await call.json();
        setCreatedMomentId(body.mid);
        setTargetMediaFolder(body.targetMediaFolder);
        // NOTE: we do this to prevent new draft moments to be created if user happens to refresh the page
        query.append('mid', body.mid);
        query.append('tmfid', body.targetMediaFolder);
        query.append('pat', newPeekAccessToken);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.replace(`${pathname}?${query}`);
      } catch (error) {
        console.log(error);
        setCreateFailed(true);
      }
    }

    // CASE FOR SENDING TO SELF OR ORG
    if (['self', 'org'].includes(target)) {
      let swlWallIdToPostTo = dashboardState.userStrengthWallId;
      if (target === 'org') {
        swlWallIdToPostTo = dashboardState.userActiveOrganizationStrengthWallId;
      }

      const directus = createClientSideDirectusClient();
      try {
        const createMomentCall: any = await directus
          .items('swl_moment')
          .createOne({
            created_by: getLoggedInUserId(),
            peek_access_token: newPeekAccessToken,
            swl_item: {
              type: 'moment',
              swl_wall_links: [{swl_wall: swlWallIdToPostTo}],
            },
            strengths: [{strength: StrengthIDMap[strength]}],
          });
        setCreatedMomentId(createMomentCall.id);
        // NOTE: we do this to prevent new draft moments to be created if user happens to refresh the page
        query.append('mid', createMomentCall.id);
        query.append('pat', newPeekAccessToken);
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        router.replace(`${pathname}?${query}`);
      } catch (error) {
        console.error('error', (error as Error).message);
        setCreateFailed(true);
      }
    }
  };

  const tryAgain = async () => {
    setIsLoadingContinue(true);
    await new Promise((r) => {
      setTimeout(r, 3000);
    });
    window.location.reload();
  };

  useLegacyEffect(() => {
    if (mid) {
      // these need to get set after a page refresh
      setCreatedMomentId(mid);
      setTargetMediaFolder(tmfid);
      setPeekAccessToken(pat);
      setFileId(fid);
    } else {
      handleCreate();
    }
  }, []);

  if (createFailed) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p>{t('somethingWentWrong', locale)}</p>
        <ButtonWithLoader
          className="mt-8 bg-primary text-white"
          isLoading={isLoadingContinue}
          onClick={tryAgain}
        >
          {t('tryAgain', locale)}
        </ButtonWithLoader>
      </div>
    );
  }

  return (
    <>
      <SeeTheGoodSelectedItems />
      <PageTransitionWrapper>
        {createdMomentId ? (
          <>
            <div className="mx-auto flex w-full max-w-md flex-col items-center space-y-4 px-4">
              <MediaButton
                fileId={fid}
                authToken={globalState.userAuthToken}
                folderId={targetMediaFolder}
                peekAccessToken={peekAccessToken}
                onFileChange={handleFileChange}
                onUploadStarted={handleUploadStarted}
                onUploadDone={handleUploadDone}
              />
              <NoteButton onNoteChange={handleNoteChange} />
            </div>
            <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 pb-16">
              <div className="pt-6 text-center text-xs text-gray-500">
                {!(note ?? fileId) && (
                  <p>{t('customizationOptional', locale)}</p>
                )}
              </div>
              <ButtonWithLoader
                className="my-6 w-full max-w-xs border border-gray-300 bg-primary text-white"
                isDisabled={isLoadingContinue || uploading}
                isLoading={isLoadingContinue}
                onClick={handleContinue}
              >
                {t('sendButton', locale)}
              </ButtonWithLoader>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <Loader />
          </div>
        )}
      </PageTransitionWrapper>
    </>
  );
};
