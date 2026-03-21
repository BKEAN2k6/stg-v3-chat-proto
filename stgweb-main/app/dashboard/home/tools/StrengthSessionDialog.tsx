'use client';

import {X} from 'lucide-react';
import {PATHS} from '@/constants.mjs';
import {type LocaleCode} from '@/lib/locale';
import {cn} from '@/lib/utils';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';

const texts = {
  close: {
    'en-US': 'Close',
    'sv-SE': 'Nära',
    'fi-FI': 'Sulje',
  },
  start: {
    'en-US': 'Start',
    'sv-SE': 'Starta',
    'fi-FI': 'Aloita',
  },
  info: {
    'en-US': 'Info',
    'sv-SE': 'Info',
    'fi-FI': 'Info',
  },
  ages: {
    'en-US': 'Ages',
    'sv-SE': 'Åldrarna',
    'fi-FI': 'Iät',
  },
  strengthSessionCaption: {
    'en-US': 'Strength sprint',
    'sv-SE': 'Styrkesprint',
    'fi-FI': 'Vahvuustuokio',
  },
  strengthSessionDescription: {
    'en-US':
      'Practice seeing the good together with the whole class in this short sprint filled with strengths.',
    'sv-SE':
      'Öva på att se det som är bra tillsammans med hela klassen i denna korta sprint fylld med styrkor.',
    'fi-FI':
      'Harjoittele vahvuuksien huomaamista yhdessä koko luokan kanssa lyhyellä vahvuustuokiolla.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly locale: LocaleCode;
  readonly isOpen: boolean;
  readonly close: (x: boolean) => void;
};

export const StrengthSessionDialog = (props: Props) => {
  const {isOpen, close, locale} = props;

  const handleClose = (event: any) => {
    event.preventDefault();
    close?.(false);
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
        <>
          <a href="#" className="absolute p-4" onClick={handleClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">{t('close', locale)}</span>
          </a>
          <div
            style={{
              backgroundImage:
                "url('/images/misc/strength-session-dialog-bg.jpg')",
              backgroundPosition: 'top',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
            }}
            className="px-16 pt-24 sm:px-32 sm:pt-56"
          >
            <div className="flex flex-col justify-start">
              <h1 className="text-xl font-bold">
                {t('strengthSessionCaption', locale)}
              </h1>
              <h2 className="text-gray-500">{t('ages', locale)} 10 - 99</h2>
              <LinkButtonWithLoader
                href={PATHS.strengthSessionCreate}
                className="mt-4 max-w-[100px] bg-primary text-white"
              >
                {t('start', locale)}
              </LinkButtonWithLoader>
            </div>
            <div className="mt-12 flex space-x-8 border-b border-gray-200 px-4">
              <a
                href="#"
                className="border-b-2 border-primary pb-2 font-bold text-primary"
              >
                {t('info', locale)}
              </a>
            </div>
            <div className="mb-16 mt-6 text-gray-500">
              <p>{t('strengthSessionDescription', locale)}</p>
            </div>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
};
