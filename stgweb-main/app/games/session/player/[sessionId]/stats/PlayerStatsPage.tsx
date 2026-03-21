'use client';

import {useRef, useState} from 'react';
import {toPng} from 'html-to-image';
import {useCookies} from 'next-client-cookies';
import toast from 'react-hot-toast';
import {PlayerStats, type PlayerStrengthItem} from '../../../PlayerStats';
import {StrengthDialog} from '../../../StrengthDialog';
import {getLocaleCode} from '@/lib/locale';
import {DownloadIcon} from '@/components/atomic/atoms/DownloadIcon';
import {PageTransitionWrapper} from '@/components/draft/page-transition-wrapper';
import {type StrengthSlug} from '@/lib/strength-data';

const texts = {
  header: {
    'en-US': 'Your strengths',
    'fi-FI': 'Sinun vahvuutesi',
    'sv-SE': 'Dina styrkor',
  },
  failedToDowload: {
    'en-US': 'Failed to download',
    'fi-FI': 'Lataaminen epäonnistui',
    'sv-SE': 'Misslyckades med att ladda ner',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

function formatDate(dateString?: string | undefined) {
  const date = dateString ? new Date(dateString) : new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}`;
}

type Props = {
  readonly date?: string | undefined;
  readonly playerName?: string | undefined;
  readonly playerColor?: string | undefined;
  readonly strengths?: PlayerStrengthItem[];
};

export const PlayerStatsPage = (props: Props) => {
  const {date, playerName, playerColor, strengths} = props;
  const playerStatsRef = useRef(null);
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [selectedStrengthSlug, setSelectedStrengthSlug] = useState<
    StrengthSlug | undefined
  >();

  const handleDownloadClick = () => {
    if (playerStatsRef.current) {
      toPng(playerStatsRef.current)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = `${formatDate(date)}-${playerName}-strengths.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(() => {
          toast.error(t('failedToDownload', locale));
        });
    }
  };

  return (
    <PageTransitionWrapper className="w-full">
      <StrengthDialog
        slug={selectedStrengthSlug}
        close={() => {
          setSelectedStrengthSlug(undefined);
        }}
        locale={locale}
      />
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center">
        {/* Caption and Download Button */}
        <div className="mb-8 mt-6 flex w-full items-center justify-between">
          <div className="w-10" />
          <h1 className="flex-1 px-4 text-center text-lg font-bold">
            {t('header', locale)}
          </h1>
          <div className="mr-2 w-10">
            <button
              type="button"
              className="rounded-full bg-primary p-3 text-xs"
              onClick={handleDownloadClick}
            >
              <div style={{'--icon-color': '#fff'} as React.CSSProperties}>
                <DownloadIcon />
              </div>
            </button>{' '}
          </div>
        </div>

        <div
          ref={playerStatsRef}
          className="flex w-full max-w-xl items-center justify-center bg-white p-4"
        >
          <PlayerStats
            playerName={playerName}
            playerColor={playerColor}
            strengths={strengths}
            date={date}
            locale={locale}
            onStrengthCardClick={(event: any, strengthSlug: StrengthSlug) => {
              event.preventDefault();
              setSelectedStrengthSlug(strengthSlug);
            }}
          />
        </div>
      </div>
    </PageTransitionWrapper>
  );
};
