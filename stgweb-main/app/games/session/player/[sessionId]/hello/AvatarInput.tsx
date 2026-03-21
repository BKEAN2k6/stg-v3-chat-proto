'use client';
import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import {Edit} from 'lucide-react';
import {AvatarInputModal} from './AvatarInputModal';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  chooseAvatar: {
    'en-US': 'Avatar',
    'fi-FI': 'Avatar',
    'sv-SE': 'Avatar',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly avatar: string;
  readonly setAvatar: (avatar: string) => void;
  readonly isLoading: boolean;
};

export const AvatarInput = (props: Props) => {
  const {avatar, setAvatar, isLoading} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const handleSetAvatar = (avatar: string) => {
    setAvatar(avatar);
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        data-testid="color-input-button"
        className="h-12 w-full rounded bg-white p-2 font-bold text-primary"
        disabled={isLoading}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <div className="flex justify-items-start ">
          <div className="flex-none">
            <div
              className="h-[32px] w-[32px] rounded-full"
              style={{
                backgroundImage: `url(/images/avatars/birds/${avatar}.svg)`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '100% 100%',
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div className="ml-4 mt-[6px] grow text-left text-black">
            <div>{t('chooseAvatar', locale)}</div>
          </div>
          <div className="flex-none">
            <Edit size={16} className="mr-2 mt-2" />
          </div>
        </div>
      </button>
      <AvatarInputModal
        isOpen={isModalOpen}
        avatar={avatar}
        setAvatar={handleSetAvatar}
        locale={locale}
        handleClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
