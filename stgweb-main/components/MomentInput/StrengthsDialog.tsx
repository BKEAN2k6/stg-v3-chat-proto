'use client';

import {X} from 'lucide-react';
import {StrengthIconAndName} from '../atomic/molecules/StrengthIconAndName';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';
import {cn} from '@/lib/utils';
import {StrengthSlugs, type StrengthSlug} from '@/lib/strength-data';

type Props = {
  readonly selectedStrengths: StrengthSlug[];
  readonly onStrengthSelected: (slug: StrengthSlug) => void;
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export const StrengthsDialog = (props: Props) => {
  const {onStrengthSelected, selectedStrengths, isOpen, onClose} = props;

  const handleClose = (event: any) => {
    event.preventDefault();
    onClose();
  };

  const handleSelectStrength = async (event: any, slug: StrengthSlug) => {
    event.preventDefault();
    onStrengthSelected?.(slug);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className={cn(
          'h-full max-h-[calc(100vh_-_50%)] md:max-h-[calc(100vh_-_50%)]',
          'w-full max-w-[calc(100vw_-_10%)] md:max-w-[calc(100vw_-_50%)] ',
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
        <div className="h-full overflow-y-auto px-8 py-12">
          <div className="flex flex-wrap justify-center">
            {StrengthSlugs.filter(
              (slug) => !selectedStrengths.includes(slug),
            ).map((slug) => (
              <div
                key={`${slug}-item`}
                className="m-4 w-[70px]"
                onClick={async (event: any) =>
                  handleSelectStrength(event, slug)
                }
              >
                <StrengthIconAndName
                  size="sm"
                  slug={slug}
                  imageWrapperClassName={cn(
                    'mb-2',
                    'h-[70px] w-[70px]',
                    'md:h-[70px] md:w-[70px]',
                    'lg:h-[70px] lg:w-[70px]',
                  )}
                  textWrapperClassName="h-auto text-[12px] md:text-[12px] lg:text-[12px]"
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
