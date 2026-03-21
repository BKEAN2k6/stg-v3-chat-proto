'use client';

import {X} from 'lucide-react';
import {useState} from 'react';
import toast from 'react-hot-toast';
import {useCookies} from 'next-client-cookies';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';
import {cn} from '@/lib/utils';
import {
  latinAlphabetWithSpecials,
  numbers,
  spaceAndDash,
  validateAndNormalizeInput,
} from '@/lib/validation';
import {refreshAuthIfExpired} from '@/lib/directus';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  groupNamePlaceholder: {
    'en-US': 'Group name',
    'fi-FI': 'Ryhmän nimi',
    'sv-SE': 'Gruppnamn',
  },
  letsGo: {
    'en-US': "Let's go",
    'fi-FI': 'Aloitetaan!',
    'sv-SE': 'Nu kör vi!',
  },
  invalidName: {
    'en-US': 'Invalid name',
    'fi-FI': 'Virheellinen nimi',
    'sv-SE': 'Ogiltigt namn',
  },
  failedToCreateGroup: {
    'en-US': 'Failed to create group',
    'fi-FI': 'Ryhmän luominen epäonnistui',
    'sv-SE': 'Det gick inte att skapa en grupp',
  },
  create: {
    'en-US': 'Create',
    'fi-FI': 'Luo',
    'sv-SE': 'Skapa',
  },
  createGroup: {
    'en-US': 'Create group',
    'fi-FI': 'Luo ryhmä',
    'sv-SE': 'Skapa grupp',
  },
  groupName: {
    'en-US': 'Group name',
    'fi-FI': 'Ryhmän nimi',
    'sv-SE': 'Gruppens namn',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly onCreateGroup: () => void;
};

export const CreateGroupDialogAndTrigger = (props: Props) => {
  const {onCreateGroup} = props;
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [groupName, setGroupName] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleOpen = (event: any) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const handleClose = (event: any) => {
    event.preventDefault();
    setIsOpen(false);
  };

  const handleCreate = async (event: any) => {
    event.preventDefault();
    setIsCreating(true);
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch(PATHS.homeGroupsCreateGroup, {
        method: 'POST',
        body: JSON.stringify({
          name: groupName,
        }),
      });
      const body = await call.json();
      if (!call.ok) {
        throw new Error(body.message);
      }
    } catch (error) {
      const message = (error as Error).message;
      if (message === 'invalid-name') {
        toast.error(t('invalidName', locale));
      } else {
        toast.error(t('failedToCreateGroup', locale));
      }

      setIsCreating(false);
      return;
    }

    onCreateGroup?.();
    // setGroupName('');
    // setIsCreating(false);
    // setIsOpen(false);
    // @TODO refactoring note, should refresh sidebar state instead of refresh the whole page (this is just easier for now...)
    window.location.reload();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGroupName(
      validateAndNormalizeInput(
        event.target.value,
        `${latinAlphabetWithSpecials}${numbers}${spaceAndDash}`,
      ),
    );
  };

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent
          className={cn(
            'h-full max-h-[calc(100vh_-_50%)] md:max-h-[calc(100vh_-_50%)]',
            'w-full max-w-[calc(100vw_-_20%)] md:max-w-[calc(100vw_-_50%)] ',
            'min-h-[300px]',
            'items-center justify-center',
          )}
        >
          <a
            href="#"
            className="absolute top-0 p-4"
            data-testid="close-button"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </a>
          <div className="overflow-y-auto">
            <div className="flex flex-col ">
              <div className="flex flex-col items-center justify-center px-4 text-center">
                <form onSubmit={handleCreate}>
                  <div>
                    <input
                      autoFocus
                      className="form-control mb-2 w-full rounded-md border p-5 text-center font-mono text-md"
                      type="text"
                      id="group-name"
                      value={groupName}
                      placeholder={t('groupName', locale)}
                      maxLength={50}
                      disabled={isCreating}
                      onChange={(event) => {
                        handleNameChange(event);
                      }}
                    />
                  </div>
                  <div className="mb-2 mt-4 flex justify-center">
                    <ButtonWithLoader
                      id="continue-button"
                      type="submit"
                      className="bg-primary text-white"
                      isLoading={isCreating}
                      isDisabled={isCreating}
                    >
                      {t('create', locale)}
                    </ButtonWithLoader>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ButtonWithLoader
        className="mt-4 border border-primary bg-primary py-2 text-white"
        onClick={handleOpen}
      >
        {t('createGroup', locale)}
      </ButtonWithLoader>
    </>
  );
};
