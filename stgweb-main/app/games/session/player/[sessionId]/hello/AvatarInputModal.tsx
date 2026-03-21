'use client';

import {X} from 'lucide-react';
import {useState} from 'react';
import {type LocaleCode} from '@/lib/locale';
import {Dialog, DialogContent} from '@/components/atomic/atoms/RouteDialog';
import {avatarSlugs} from '@/lib/avatar-data';

const texts = {
  close: {
    'en-US': 'Close',
    'sv-SE': 'Nära',
    'fi-FI': 'Sulje',
  },
  selectColor: {
    'en-US': 'Choose an avatar',
    'sv-SE': 'Välj en avatar',
    'fi-FI': 'Valitse avatar',
  },
  done: {
    'en-US': 'Done',
    'sv-SE': 'Klart',
    'fi-FI': 'Valitse',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly locale: LocaleCode;
  readonly isOpen: boolean;
  readonly handleClose: () => void;
  readonly avatar: string;
  readonly setAvatar: (color: string) => void;
};

export const AvatarInputModal = (props: Props) => {
  const {locale, isOpen, handleClose, setAvatar, avatar} = props;
  const [candidateAvatar, setCandidateAvatar] = useState<string>(avatar);

  const colorObjects = avatarSlugs.slice(0, 25).map((loopAvatar) => ({
    avatar: loopAvatar,
    isSelected: loopAvatar === candidateAvatar,
  }));

  const handleCloseButtonClick = (event: any) => {
    event.preventDefault();
    setCandidateAvatar(avatar);
    handleClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent data-testid="color-input-modal">
        <a
          href="#"
          className="absolute p-4"
          data-testid="close-button"
          onClick={handleCloseButtonClick}
        >
          <X className="h-4 w-4" />
        </a>
        <div className="p-10 text-center">
          <div className="flex h-20 flex-col text-center">
            <h1 className="text-xl font-bold">{t('selectColor', locale)}</h1>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-5 justify-items-center gap-4 p-10">
              {colorObjects.map(({avatar, isSelected}) => (
                <div
                  key={avatar}
                  data-testid={avatar}
                  className="float-right h-10 w-10 rounded-lg md:h-16 md:w-16"
                  style={{
                    backgroundImage: `url(/images/avatars/birds/${avatar}.svg)`,
                    backgroundColor: '#F9FAFB',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '100% 100%',
                    border: isSelected
                      ? '4px solid hsl(var(--primary))'
                      : '1px solid hsl(var(--secondary))',
                  }}
                  onClick={() => {
                    setCandidateAvatar(avatar);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              data-testid="set-color-button"
              className="w-1/2 rounded-full bg-primary p-3 font-bold text-white"
              onClick={() => {
                setAvatar(candidateAvatar);
              }}
            >
              {t('done', locale)}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
