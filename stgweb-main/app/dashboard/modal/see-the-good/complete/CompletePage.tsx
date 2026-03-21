'use client';

import {useState} from 'react';
import {AnimatePresence} from 'framer-motion';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {type LocaleCode, getLocaleCode} from '@/lib/locale';
import {grantRewardCredits} from '@/lib/reward';
import useLegacyEffect from '@/hooks/use-legacy-effect';
import {FadeInAndOut} from '@/components/FadeInAndOut';
import {FullHeightCentered} from '@/components/atomic/atoms/FullHeightCentered';
import {HeartIcon} from '@/components/atomic/atoms/HeartIcon';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';

const texts = {
  creditsEarnedText: {
    'en-US': 'Credits earned',
    'sv-SE': 'Poäng intjänade',
    'fi-FI': 'Pistettä ansaittu',
  },
  dailyFlowCompletedText: {
    'en-US': 'Daily flow completed',
    'sv-SE': 'Dagligt flöde avslutat',
    'fi-FI': 'Päivittäinen tehtävä suoritettu',
  },
  closeButtonText: {
    'en-US': 'Close',
    'fi-FI': 'Sulje',
    'sv-SE': 'Stäng',
  },
  keepGoodGoingText: {
    'en-US': 'Nicely done! Let’s keep the good going tomorrow as well.',
    'sv-SE': 'Bra jobbat! Låt oss fortsätta det goda imorgon också.',
    'fi-FI': 'Hienosti tehty! Jatketaan hyvän huomaamista huomennakin.',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const Close = (props: {readonly locale: LocaleCode}) => {
  const {locale} = props;
  return (
    <div className="flex w-full justify-center pb-12">
      <LinkButtonWithLoader
        href={PATHS.profile}
        className="w-full max-w-xs bg-primary text-white"
      >
        {t('closeButtonText', locale)}
      </LinkButtonWithLoader>
    </div>
  );
};

export const CompletePage = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const [showCloseOnly, setShowCloseOnly] = useState(false);
  const [showReward, setShowReward] = useState(false);

  useLegacyEffect(() => {
    const run = async () => {
      const creditsGranted = await grantRewardCredits(
        'daily-see-the-good-flow',
      );
      if (!creditsGranted) {
        setShowCloseOnly(true);
      }

      setTimeout(() => {
        if (creditsGranted) {
          setShowReward(true);
        }
      }, 1500);
    };

    run();
  }, []);

  return (
    <AnimatePresence mode="wait">
      {showReward ? (
        <FadeInAndOut
          key="showing-reward-true"
          className="relative z-20 h-full px-12 text-center"
        >
          <FullHeightCentered requiredHeight={500} className="h-full">
            <div className="mt-12 flex w-full flex-col items-center">
              <div className="relative mb-8 flex h-[144px] min-h-[144px] w-[144px] min-w-[144px] items-center justify-center rounded-full border-8 border-solid border-primary bg-primary-lighter-2">
                <div className="relative mb-[-8px]">
                  <HeartIcon width="100" height="100" />
                  <span className="absolute top-9 block w-full text-center text-lg font-bold text-white">
                    50
                  </span>
                </div>
              </div>
              <div className="mb-8 text-base">
                {t('creditsEarnedText', locale)}
              </div>
              <div className="mb-20 text-xl font-bold">
                {t('dailyFlowCompletedText', locale)}
              </div>
              <Close locale={locale} />
            </div>
          </FullHeightCentered>
        </FadeInAndOut>
      ) : (
        <FadeInAndOut
          key="showing-reward-false"
          className="relative z-20 h-full px-12 text-center"
        >
          <FullHeightCentered requiredHeight={0} className="h-full">
            <div className="h-[314px]">
              <h1 className="mb-10 mt-12 w-full max-w-2xl text-xl font-bold text-black sm:mb-20 sm:text-2xl md:text-3xl">
                {t('keepGoodGoingText', locale)}
              </h1>
              {showCloseOnly && <Close locale={locale} />}
            </div>
          </FullHeightCentered>
        </FadeInAndOut>
      )}
    </AnimatePresence>
  );
};
