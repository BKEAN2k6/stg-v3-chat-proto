'use client';

import {useState} from 'react';
import {PATHS} from '@/constants.mjs';
import {type LocaleCode} from '@/lib/locale';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';
import {
  MomentCard,
  type MomentCardData,
} from '@/components/atomic/molecules/MomentCard';

const texts = {
  logInButton: {
    'en-US': 'Log in to keep seeing the good!',
    'sv-SE': 'Logga in för att fortsätta se det goda!',
    'fi-FI': 'Kirjaudu sisään ja huomaa hyvää!',
  },
  revealButton: {
    'en-US': 'Click to show the moment',
    'sv-SE': 'Klicka för att visa ögonblicket',
    'fi-FI': 'Klikkaa näyttääksesi hetken',
  },
  revealNote: {
    'en-US':
      'Note! This can only be done once from here. You can access the moment again after logging in to your account.',
    'sv-SE':
      'Observera! Detta kan bara göras en gång härifrån. Du kan komma åt momentet igen efter att ha loggat in på ditt konto.',
    'fi-FI':
      'Huom! Voit avata hetken vain kerran tästä linkistä. Voit kirjautua sisään löytääksesi sen uudelleen.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly moment: MomentCardData;
  readonly locale: LocaleCode;
  readonly peekAccessToken: string;
  readonly hasBeenAccessed: boolean;
};

export const MomentPage = (props: Props) => {
  const {moment, peekAccessToken, locale} = props;
  const [revealed, setRevealed] = useState(props.hasBeenAccessed);

  const handleReveal = async () => {
    setRevealed(true);
    try {
      const revealCall = await fetch(PATHS.peekMomentReveal, {
        method: 'POST',
        body: JSON.stringify({
          peekAccessToken,
        }),
      });
      if (!revealCall.ok) {
        const body = await revealCall.json();
        throw new Error(body.message);
      }
    } catch {
      console.error('failed-to-reveal');
    }
  };

  return (
    <>
      <div className="my-8 w-full max-w-[640px]">
        <MomentCard
          showFullCardIfStrengthOnly
          target="other" // NOTE! This is always OK for now, but needs to change if we also send notifications from community moments.
          moment={moment}
          locale={locale}
          peekAccessToken={peekAccessToken}
        />
        <div className="mt-8 flex w-full justify-center px-4">
          <LinkButtonWithLoader
            href={PATHS.login}
            className="bg-primary text-white"
          >
            {t('logInButton', locale)}
          </LinkButtonWithLoader>
        </div>
      </div>
      {!revealed && (
        <>
          <div className="min-safe-h-screen fixed left-0 top-0 z-10 w-screen bg-white/30 backdrop-blur-md" />
          <div className="absolute left-1/2 top-1/2 z-20 h-60 w-full max-w-sm -translate-x-1/2 -translate-y-1/2">
            <div className="absolute z-20 h-full w-full rounded-lg bg-gray-600 opacity-50" />
            <div className="absolute z-30 h-full w-full">
              <div className="flex h-full w-full flex-col items-center justify-center p-4">
                <ButtonWithLoader
                  className="mx-auto bg-primary text-white"
                  onClick={handleReveal}
                >
                  {t('revealButton', locale)}
                </ButtonWithLoader>
                <p className="mt-4 max-w-xs text-center text-white">
                  {t('revealNote', locale)}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
