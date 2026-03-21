'use client';

import {useState} from 'react';
import Image from 'next/image';
import {motion} from 'framer-motion';
import {useCookies} from 'next-client-cookies';
import {OnboardingContinueButton} from '../../OnboardingContinueButton';
import {PATHS} from '@/constants.mjs';
import welcomeRewardCrow from '@/public/images/rewards/welcome-reward-crow.png';
import {getLocaleCode} from '@/lib/locale';
import {grantRewardCredits} from '@/lib/reward';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {HeartIcon} from '@/components/atomic/atoms/HeartIcon';
import Confetti1 from '@/components/draft/confetti-1';
import Confetti2 from '@/components/draft/confetti-2';
import useElementPosition from '@/components/draft/use-element-position';

const texts = {
  rewardTitle: {
    'en-US':
      'Here is a reward for completing the onboarding. Click on it to open!',
    'fi-FI':
      'Tässä sinulle palkinto vahvuuksien tunnistamisesta. Klikkaa avataksesi se!',
    'sv-SE':
      'Här är en belöning för att ha slutfört onboarding. Klicka för att öppna den!',
  },
  receivedTitle: {
    'en-US': 'You received 500 credits!',
    'fi-FI': 'Sait 500 pistettä!',
    'sv-SE': 'Du har fått 500 poäng!',
  },
  creditsUsage: {
    'en-US': 'Credits can be used to unlock customization items.',
    'fi-FI': 'Voi käyttää pisteitä työyhteisösi ilahduttamiseen.',
    'sv-SE': 'Poäng kan användas för att låsa upp anpassningsartiklar.',
  },
  continueButton: {
    'en-US': 'Continue',
    'fi-FI': 'Jatka',
    'sv-SE': 'Fortsätt',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const Reward = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [opening, setOpening] = useState(false);
  const [opened, setOpened] = useState(false);
  const {position, elementRef} = useElementPosition();

  const handleOpen = async () => {
    setOpening(true);
    setTimeout(() => {
      setOpening(false);
      setOpened(true);
    }, 1000);
    await grantRewardCredits('onboarding');
  };

  return (
    <>
      {opened && <Confetti2 />}
      <FullHeightCentered requiredHeight={470}>
        <div className="z-10">
          <div ref={elementRef} className="flex justify-center pb-4 pt-8">
            {!opened && (
              <motion.div
                animate={opening ? {rotateY: 360} : {rotateY: 0}}
                transition={{
                  loop: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  duration: 1,
                }}
                className="flex h-36 w-36 items-center justify-center rounded-full border-8 border-solid border-primary bg-primary-lighter-2"
                onClick={handleOpen}
              >
                <div className="mb-[-16px] text-[110px] text-primary">
                  {!opening && '?'}
                </div>
              </motion.div>
            )}
            {opened && (
              <>
                <Confetti1 x={position.x / 100} y={position.y / 100} />
                <div className="relative">
                  <div className="relative z-20 flex h-36 w-36 items-center justify-center rounded-full border-8 border-solid border-primary bg-primary-lighter-2">
                    <div className="relative mb-[-8px]">
                      <HeartIcon width="100" height="100" />
                      <span className="absolute top-9 block w-full text-center text-lg font-bold text-white">
                        500
                      </span>
                    </div>
                  </div>
                  <motion.div
                    animate={{right: -98, rotate: 30}}
                    transition={{
                      ease: 'easeInOut',
                      duration: 0.5,
                    }}
                    className="absolute right-[-20px] top-[-10px] z-10 w-[143px]"
                  >
                    <Image
                      priority
                      src={welcomeRewardCrow}
                      alt="welcome reward crow laughing"
                    />
                  </motion.div>
                </div>
              </>
            )}
          </div>

          <div className="mt-10 h-40 w-full max-w-2xl px-4 text-center">
            <h1 className="text-lg font-semibold text-black sm:text-xl">
              {opened ? t('receivedTitle', locale) : t('rewardTitle', locale)}
            </h1>

            {opened && <p>{t('creditsUsage', locale)}</p>}
          </div>

          <div className="h-20 px-4">
            {opened && (
              <div className="flex justify-center pb-4">
                <OnboardingContinueButton
                  target={PATHS.profileOnboardingStep1}
                  className="bg-primary text-white"
                >
                  {t('continueButton', locale)}
                </OnboardingContinueButton>
              </div>
            )}
          </div>
        </div>
      </FullHeightCentered>
    </>
  );
};
