'use client';

import {X} from 'lucide-react';
import {type LocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';

const texts = {
  close: {
    'en-US': 'Close',
    'sv-SE': 'Nära',
    'fi-FI': 'Sulje',
  },
  editParticipants: {
    'en-US': 'Edit participants',
    'sv-SE': 'Redigera deltagare',
    'fi-FI': 'Muokkaa osallistujia',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type User = {
  id: string;
  first_name?: string;
  color?: string;
  isLoading?: boolean;
};

type Props = {
  readonly locale: LocaleCode;
  readonly isOpen: boolean;
  readonly users: User[];
  readonly close: () => void;
  readonly removeUser: (user: User) => void;
};

export const UserListDialog = (props: Props) => {
  const {isOpen, close, locale, users, removeUser} = props;

  const handleClose = (event: any) => {
    event.preventDefault();
    close();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={cn(
          'h-full max-h-[calc(100vh_-_60px)] md:max-h-[calc(100vh_-_160px)]',
          'w-full max-w-[calc(100vw_-_60px)] md:max-w-[calc(100vw_-_160px)]',
          'overflow-y-auto',
        )}
      >
        <a
          href="#"
          className="absolute p-4"
          data-testid="close-button"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </a>
        <div className="pt-10">
          <div className="flex h-20 flex-col text-center">
            <h1 className="text-xl font-bold">
              {t('editParticipants', locale)}
            </h1>
          </div>
          {users.map((user) => (
            <div
              key={user.id}
              className="mx-auto flex max-w-xl flex-row justify-between px-4 py-2"
            >
              <div
                className="rounded-full"
                style={{backgroundColor: user.color}}
              >
                <div className="px-4 py-2 text-center text-lg font-bold">
                  {user.first_name}
                </div>
              </div>

              <ButtonWithLoader
                className="bg-primary text-white"
                isLoading={user.isLoading}
                onClick={() => {
                  removeUser(user);
                }}
              >
                Remove
              </ButtonWithLoader>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
