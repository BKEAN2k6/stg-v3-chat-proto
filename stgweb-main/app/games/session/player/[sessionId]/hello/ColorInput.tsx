'use client';
import {useCookies} from 'next-client-cookies';
import {useState} from 'react';
import {Edit} from 'lucide-react';
import {ColorInputModal} from './ColorInputModal';
import {getLocaleCode} from '@/lib/locale';

const texts = {
  chooseColor: {
    'en-US': 'Color',
    'fi-FI': 'Väri',
    'sv-SE': 'Färg',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly color: string;
  readonly setColor: (color: string) => void;
  readonly isLoading: boolean;
};

export const ColorInput = (props: Props) => {
  const {color, setColor, isLoading} = props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const handleSetColor = (color: string) => {
    setColor(color);
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
        <div className="flex justify-items-start">
          <div className="flex-none">
            <div
              className="h-[32px] w-[32px] rounded-full"
              style={{
                backgroundColor: color,
                border: '1px solid #ccc',
              }}
            />
          </div>
          <div className="ml-4 mt-[6px] grow text-left text-black">
            <div>{t('chooseColor', locale)}</div>
          </div>
          <div className="flex-none">
            <Edit size={16} className="mr-2 mt-2" />
          </div>
        </div>
      </button>
      <ColorInputModal
        isOpen={isModalOpen}
        color={color}
        setColor={handleSetColor}
        locale={locale}
        handleClose={() => {
          setIsModalOpen(false);
        }}
      />
    </>
  );
};
