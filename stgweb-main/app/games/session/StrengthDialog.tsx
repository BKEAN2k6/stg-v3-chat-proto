'use client';

import {X} from 'lucide-react';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';
import {StrengthFact} from '@/components/atomic/molecules/StrengthFact';
import {type LocaleCode} from '@/lib/locale';
import {StrengthColorMap, type StrengthSlug} from '@/lib/strength-data';
import {cn} from '@/lib/utils';

type Props = {
  readonly locale: LocaleCode;
  readonly slug?: StrengthSlug;
  readonly close: () => void;
};

export const StrengthDialog = (props: Props) => {
  const {slug, close, locale} = props;

  const handleClose = (event: any) => {
    event.preventDefault();
    close();
  };

  if (!slug) return null;

  return (
    <Dialog open={slug !== undefined}>
      <DialogContent
        className={cn(
          'h-full max-h-[calc(100vh_-_60px)] md:max-h-[calc(100vh_-_160px)]',
          'w-full max-w-[calc(100vw_-_60px)] md:max-w-[calc(100vw_-_160px)]',
        )}
        style={{backgroundColor: StrengthColorMap[slug][200]}}
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
          <div className="flex flex-col px-4 pb-12">
            <StrengthFact slug={slug} locale={locale} />
            <div className="flex flex-col items-center justify-center px-4 text-center">
              <ButtonWithLoader
                className="bg-primary text-white"
                data-testid="primary-button"
                onClick={close}
              >
                Ok
              </ButtonWithLoader>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
