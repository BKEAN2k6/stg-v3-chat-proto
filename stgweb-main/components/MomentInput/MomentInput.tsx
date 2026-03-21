'use client';

import React, {useEffect, useState} from 'react';
import toast from 'react-hot-toast';
import TextareaAutosize from 'react-textarea-autosize';
import {useCookies} from 'next-client-cookies';
import {PlusIcon, ArrowDownIcon} from 'lucide-react';
import {StrengthIconAndName} from '../atomic/molecules/StrengthIconAndName';
import {PaperplaneIcon} from '../atomic/atoms/PaperplaneIcon';
import {NoteIcon} from '../atomic/atoms/NoteIcon';
import {StrengthsDialog} from './StrengthsDialog';
import {MediaButton} from './MediaButton';
import {cn, generateId, notify} from '@/lib/utils';
import {StrengthIDMap, type StrengthSlug} from '@/lib/strength-data';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import useAuth from '@/hooks/use-auth';
import useGlobal from '@/hooks/useGlobal';
import {
  latinAlphabetWithSpecials,
  numbers,
  validateAndNormalizeInput,
  spaceAndDash,
  commonSpecialCharacters,
  linebreak,
} from '@/lib/validation';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  addStrength: {
    'en-US': 'Add strength',
    'sv-SE': 'Lägg till styrka',
    'fi-FI': 'Lisää vahvuus',
  },
  failedToSend: {
    'en-US': 'Failed to send',
    'sv-SE': 'Misslyckades med att skicka',
    'fi-FI': 'Lähettäminen epäonnistui',
  },
  iSawStrengthIn: {
    'en-US': 'I saw strength in',
    'sv-SE': 'Jag såg styrka i',
    'fi-FI': 'Huomasin vahvuutta',
  },
  whatWentWell: {
    'en-US': 'What went well?',
    'sv-SE': 'Vad gick bra?',
    'fi-FI': 'Mikä meni hyvin?',
  },
  strengthFeedbackWasSentTo: {
    'en-US': 'Strength feedback was sent to',
    'sv-SE': 'Feedback om styrkan skickades till',
    'fi-FI': 'Vahvuuspalaute lähetettiin',
  },
  toYourself: {
    'en-US': 'yourself',
    'sv-SE': 'dig själv',
    'fi-FI': 'itsellesi',
  },
  inMyself: {
    'en-US': 'myself',
    'sv-SE': 'mig själv',
    'fi-FI': 'itsessäni',
  },
  addText: {
    'en-US': 'Add text',
    'sv-SE': 'Lägg till text',
    'fi-FI': 'Lisää teksti',
  },
  clickHereToSend: {
    'en-US': 'Click here to send',
    'sv-SE': 'Klicka här för att skicka',
    'fi-FI': 'Klikkaa tästä lähettääksesi',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly target: 'self' | 'org' | 'group' | 'other';
  readonly targetName: string;
  readonly swlWallId: string;
  readonly targetUserId?: string;
};

export const MomentInput = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {target, targetName, swlWallId, targetUserId} = props;

  const {globalState} = useGlobal();
  const {getLoggedInUserId} = useAuth();

  const [fileId, setFileId] = useState<string | undefined>();
  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);
  const [peekAccessToken, setPeekAccessToken] = useState<string | undefined>();
  const [selectedStrengths, setSelectedStrengths] = useState<StrengthSlug[]>([]); // prettier-ignore
  const [textAreaValue, setTextAreaValue] = useState('');
  const [isStrengthsDialogOpen, setIsStrengthsDialogOpen] = useState(false);
  const [hasText, setHasText] = useState(false);

  const handleNewStrengthSelected = (slug: StrengthSlug) => {
    setSelectedStrengths((previousStrengths) => [...previousStrengths, slug]);
  };

  const handleRemoveStrength = (slug: StrengthSlug) => {
    setSelectedStrengths((previousStrengths) =>
      previousStrengths.filter((s) => s !== slug),
    );
  };

  const handleFileChange = (newFileId: string | undefined) => {
    setFileId(newFileId);
    if (!newFileId) {
      generateNewPeekAccessToken();
    }
  };

  const handleUploadStarted = () => {
    setUploading(true);
  };

  const handleUploadDone = () => {
    setUploading(false);
  };

  const handleTextAreaValueChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setTextAreaValue(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${numbers}${spaceAndDash}${commonSpecialCharacters}${linebreak}`,
        false,
        true,
      ),
    );
  };

  const handleStrengthsDialogOpen = () => {
    setIsStrengthsDialogOpen(true);
  };

  const handleStrengthsDialogClose = () => {
    setIsStrengthsDialogOpen(false);
  };

  const handleAddTextClick = () => {
    setHasText(true);
  };

  const targetNameTranslator = (preposition: 'to' | 'in') => {
    if (target === 'self') {
      return {
        prefix: '',
        text: t(preposition === 'to' ? 'toYourself' : 'inMyself', locale),
      };
    }

    if (locale === 'fi-FI') {
      const fiMappings = {
        other: {to: 'henkilölle', in: 'henkilössä'},
        org: {to: 'kohteelle', in: 'kohteessa'},
        group: {to: 'ryhmälle', in: 'ryhmässä'},
      };
      return {
        prefix: fiMappings[target][preposition],
        text: targetName,
      };
    }

    return {
      prefix: '',
      text: targetName,
    };
  };

  const targetNameToString = (preposition: 'to' | 'in') => {
    const targetNameTranslated = targetNameTranslator(preposition);
    return `${targetNameTranslated.prefix} ${targetNameTranslated.text}`;
  };

  const targetNameToJsx = (preposition: 'to' | 'in') => {
    const targetNameTranslated = targetNameTranslator(preposition);
    return (
      <>
        {targetNameTranslated.prefix}{' '}
        <strong>{targetNameTranslated.text}</strong>
      </>
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSending(true);

    await refreshAuthIfExpired({force: true});
    const directus = createClientSideDirectusClient();

    let createdMomentId;

    // // CASE FOR SENDING TO OTHERS (using custom route due to permissions)
    if (target === 'other') {
      try {
        const call = await fetch(PATHS.postToUsersWall, {
          method: 'POST',
          body: JSON.stringify({
            targetSwlWallId: swlWallId,
            peekAccessToken,
            content: textAreaValue,
            strengths: selectedStrengths.map((slug) => {
              return {strength: StrengthIDMap[slug]};
            }),
          }),
        });
        if (!call.ok) {
          const body = await call.json();
          throw new Error(body.message || 'unknown');
        }

        const body = await call.json();
        createdMomentId = body.mid;
      } catch (error) {
        console.log(error);
        toast.error(t('failedToSend', locale));
        setSending(false);
        return;
      }

      // also notify when sending to others
      if (targetUserId) {
        await notify({
          target,
          loggedInUserId: getLoggedInUserId(),
          recipientId: targetUserId,
          peekAccessToken,
          wsocEventType: 'moment_created',
          wsocEventListenerValue: swlWallId,
          wsocEventLookupValue: createdMomentId,
        });
      }

      setSending(false);
      setSelectedStrengths([]);
      setTextAreaValue('');
      setFileId(undefined);
      generateNewPeekAccessToken();

      toast.success(
        `${t('strengthFeedbackWasSentTo', locale)} ${targetNameToString('to')}`,
        {duration: 5000},
      );
    }

    // CASE FOR SENDING TO SELF, ORG OR GROUP (writing directly with directus)
    if (['self', 'org', 'group'].includes(target)) {
      try {
        const createMomentCall: any = await directus
          .items('swl_moment')
          .createOne({
            status: 'published',
            created_by: getLoggedInUserId(),
            peek_access_token: peekAccessToken,
            swl_item: {
              type: 'moment',
              swl_wall_links: [{swl_wall: swlWallId}],
            },
            strengths: selectedStrengths.map((slug) => {
              return {strength: StrengthIDMap[slug]};
            }),
            ...(textAreaValue && {markdown_content: textAreaValue}),
            ...(fileId && {files: [{directus_files: fileId}]}),
          });
        createdMomentId = createMomentCall.id;
      } catch (error) {
        console.error('error', (error as Error).message);
        toast.error(t('failedToSend', locale));
        setSending(false);
        return;
      }

      // @TODO this is not great, but works for now...
      window.location.reload();
    }
  };

  const generateNewPeekAccessToken = () => {
    const newPeekAccessToken = generateId(32);
    setPeekAccessToken(newPeekAccessToken);
  };

  useEffect(() => {
    generateNewPeekAccessToken();
  }, []);

  if (selectedStrengths.length === 0) {
    return (
      <>
        <StrengthsDialog
          selectedStrengths={selectedStrengths}
          isOpen={isStrengthsDialogOpen}
          onStrengthSelected={handleNewStrengthSelected}
          onClose={handleStrengthsDialogClose}
        />
        <div className="mb-8 flex w-full items-center justify-center">
          <button
            type="button"
            className="rounded-full border bg-primary px-8 py-3 text-white"
            onClick={handleStrengthsDialogOpen}
          >
            {t('iSawStrengthIn', locale)}
            <span> </span>
            {targetNameToJsx('in')}
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <StrengthsDialog
        selectedStrengths={selectedStrengths}
        isOpen={isStrengthsDialogOpen}
        onStrengthSelected={handleNewStrengthSelected}
        onClose={handleStrengthsDialogClose}
      />
      <div className="container mx-auto border border-x-0 border-[#d1d5db] bg-white p-4 pt-2 sm:rounded-lg sm:border-x">
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex items-center">
            {selectedStrengths.map((strength, idx) => (
              <div
                key={`${strength}-selected`}
                className={cn('p-2', idx === 0 && 'pl-0')}
                onClick={() => {
                  handleRemoveStrength(strength);
                }}
              >
                <StrengthIconAndName
                  size="sm"
                  slug={strength}
                  imageWrapperClassName={cn(
                    'mb-2',
                    'h-[70px] w-[70px]',
                    'md:h-[70px] md:w-[70px]',
                    'lg:h-[70px] lg:w-[70px]',
                  )}
                  textWrapperClassName="h-auto text-[12px] md:text-[12px] lg:text-[12px] whitespace-nowrap truncate"
                />
              </div>
            ))}
            {selectedStrengths.length < 3 && (
              <button
                type="button"
                className="rounded-lg hover:bg-gray-50"
                onClick={handleStrengthsDialogOpen}
              >
                <div className="flex w-full flex-col items-center p-2">
                  <div className="mb-2 flex h-[70px] w-[70px] items-center justify-center">
                    <PlusIcon className="w-[36px]" />
                  </div>
                  <span className="text-[12px]">
                    {t('addStrength', locale)}
                  </span>
                </div>
              </button>
            )}
          </div>
          {hasText && (
            <TextareaAutosize
              className="mt-4 block w-full resize-none border-none border-transparent bg-white text-md text-gray-900 outline-none"
              minRows={3}
              value={textAreaValue}
              placeholder={t('whatWentWell', locale)}
              onChange={handleTextAreaValueChange}
            />
          )}
          <div className="mt-4 flex items-end justify-between">
            <div className="flex items-end space-x-2">
              {target !== 'other' && fileId && (
                <MediaButton
                  target={target}
                  fileId={fileId}
                  authToken={globalState.userAuthToken}
                  peekAccessToken={peekAccessToken}
                  onFileChange={handleFileChange}
                  onUploadStarted={handleUploadStarted}
                  onUploadDone={handleUploadDone}
                />
              )}
              {!hasText && (
                <button
                  type="button"
                  className="flex max-h-[42px] items-center justify-center rounded-md border border-[#e5e7eb] bg-[#f9fafb] px-2 py-1"
                  onClick={handleAddTextClick}
                >
                  <div
                    className="mr-1 flex items-center justify-center"
                    style={{width: 32, height: 32}}
                  >
                    <NoteIcon style={{width: 16, height: 16}} />
                  </div>
                  <div className="w-full text-left">
                    <span>{t('addText', locale)}</span>
                  </div>
                </button>
              )}
              {/* NOTE: sending media to other users disabled for now due to how
              complex it would have been to set up the permissions */}
              {target !== 'other' && !fileId && (
                <MediaButton
                  target={target}
                  authToken={globalState.userAuthToken}
                  peekAccessToken={peekAccessToken}
                  onFileChange={handleFileChange}
                  onUploadStarted={handleUploadStarted}
                  onUploadDone={handleUploadDone}
                />
              )}
            </div>
            <div className="relative h-[40px] w-[40px] rounded-full">
              {!sending && (
                <>
                  <span className="absolute right-10 top-[-30px] z-10 whitespace-nowrap text-xs font-medium text-primary">
                    {t('clickHereToSend', locale)}
                  </span>
                  <div className="absolute right-[8px] top-[-30px] animate-bounce">
                    <ArrowDownIcon className="h-6 w-6 text-primary" />
                  </div>
                </>
              )}
              <button
                type="submit"
                disabled={uploading || sending}
                className="flex h-full w-full items-center justify-center rounded-full bg-primary "
              >
                {sending ? (
                  <div className="items-center justify-center">
                    <div className="loader h-4 w-4 rounded-full border-4 border-gray-200 ease-linear" />
                  </div>
                ) : (
                  <PaperplaneIcon color="#fff" className="h-[20px] w-[20px]" />
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
