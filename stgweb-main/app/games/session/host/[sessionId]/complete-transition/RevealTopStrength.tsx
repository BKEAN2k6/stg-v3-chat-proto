'use client';

import {useRef, useEffect, useState} from 'react';
import {gsap} from 'gsap';
import Image from 'next/image';
import {useCookies} from 'next-client-cookies';
import {sp} from '../../../_utils';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import Confetti1 from '@/components/draft/confetti-1';
import {ButtonWithLoader} from '@/components/atomic/atoms/ButtonWithLoader';
import {FadeInAndOut} from '@/components/FadeInAndOut';
import {getLocaleCode} from '@/lib/locale';
import {PATHS} from '@/constants.mjs';
import {LinkButtonWithLoader} from '@/components/atomic/atoms/LinkButtonWithLoader';

type Props = {
  readonly sessionId: string;
  readonly topStrengthSlug: StrengthSlug;
  readonly topStrengthCount: number;
};

const texts = {
  topStrengthOfTheSprintWas: {
    'en-US': 'Top strength of the sprint was...',
    'fi-FI': 'Tuokion huomatuin vahvuus oli...',
    'sv-SE': 'Toppstyrkan i sprinten var...',
  },
  revealButton: {
    'en-US': 'Reveal',
    'fi-FI': 'Paljasta',
    'sv-SE': 'Avslöja',
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

export const RevealTopStrength = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {sessionId, topStrengthSlug, topStrengthCount} = props;
  const [topStrengthRevealed, setTopStrengthRevealed] = useState(false);
  const [topStrengthVisible, setTopStrengthVisible] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const animatedTextRef = useRef<HTMLHeadingElement>(null);
  const strengthRef = useRef<HTMLDivElement>(null);
  const topCaptionRef = useRef<HTMLDivElement>(null);

  const handleReveal = () => {
    setTopStrengthRevealed(true);
  };

  useEffect(() => {
    if (topStrengthRevealed && animatedTextRef.current && wrapperRef.current) {
      const tl = gsap.timeline();
      setTimeout(() => {
        setTopStrengthVisible(true);
      }, 800);
      // 2. Slide off the text
      tl.to(animatedTextRef.current, {
        x: '999%',
        ease: 'power3.in',
        duration: 0.3,
      });

      // Zoom in of the strength image and name
      tl.fromTo(
        strengthRef.current,
        {
          scale: 0.2,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: 'power4.inOut',
          duration: 1,
        },
        'sameTime',
      );

      // Fade in top caption
      tl.fromTo(
        topCaptionRef.current,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: 1,
        },
        'sameTime',
      );

      // Change the background color
      tl.to(
        wrapperRef.current,
        {
          backgroundColor: StrengthColorMap[topStrengthSlug][200],
          duration: 1.5,
        },
        'sameTime',
      );
    }
  }, [topStrengthRevealed]);

  useEffect(() => {
    if (animatedTextRef.current) {
      const words = animatedTextRef.current.textContent!.split(' ');
      animatedTextRef.current.textContent = '';

      const letterTl = gsap.timeline();

      let globalIndex = 0; // This will keep track of the overall letter index across all words

      const wordEntries = Array.from(words.entries());
      for (const [wordIndex, word] of wordEntries) {
        const wordContainer = document.createElement('span');
        wordContainer.style.display = 'inline-block';

        if (wordIndex !== 0) {
          // Don't add space before the first word
          const spaceSpan = document.createElement('span');
          spaceSpan.textContent = ' ';
          spaceSpan.style.width = '0.25em';
          animatedTextRef.current.append(spaceSpan);
        }

        const letters = Array.from(word);
        const letterEntries = Array.from(letters.entries());
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, letter] of letterEntries) {
          const span = document.createElement('span');
          span.textContent = letter;
          span.style.display = 'inline-block';
          span.style.opacity = '0';

          wordContainer.append(span);

          const startTime = globalIndex * 0.05;

          letterTl.fromTo(
            span,
            {
              y: 80,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              ease: 'back.inOut(1.7)',
              duration: 0.4,
            },
            startTime,
          );

          globalIndex++;
        }

        animatedTextRef.current.append(wordContainer);
      }
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="min-safe-h-screen flex w-full flex-col items-center justify-center space-y-4 bg-primary-darker-1"
    >
      <div className="min-safe-h-screen relative w-full">
        {topStrengthRevealed && (
          <>
            <div ref={topCaptionRef} className="absolute top-0 w-full px-4">
              <h2 className="mt-4 text-center text-lg font-bold">
                {t('topStrengthOfTheSprintWas', locale)}
              </h2>
            </div>
            <div
              ref={strengthRef}
              className="min-safe-h-screen flex flex-col items-center justify-center opacity-0"
            >
              <Image
                width={350}
                src={strengthImageBySlug(topStrengthSlug)}
                alt={StrengthTranslationMap[topStrengthSlug][locale]}
              />
              <h3 className="px-4 text-center text-3xl md:text-4xl">
                {StrengthTranslationMap[topStrengthSlug][locale]}
                <span className="font-semibold"> x{topStrengthCount}</span>
              </h3>
            </div>
            {topStrengthVisible && (
              <div className="absolute bottom-0 w-full pb-16 text-center">
                <FadeInAndOut>
                  <div className="flex w-full flex-col items-center px-4">
                    <LinkButtonWithLoader
                      href={sp(PATHS.strengthSessionStats, sessionId)}
                      className="w-full max-w-sm bg-primary text-white"
                    >
                      {t('continueButton', locale)}
                    </LinkButtonWithLoader>
                  </div>
                </FadeInAndOut>
              </div>
            )}
            {topStrengthVisible && <Confetti1 />}
          </>
        )}
      </div>
      <div className="absolute overflow-hidden px-4 text-center">
        <h1
          ref={animatedTextRef}
          className="text-3xl font-bold text-white md:text-4xl"
        >
          {t('topStrengthOfTheSprintWas', locale)}
        </h1>
      </div>
      {!topStrengthRevealed && (
        <div className="absolute bottom-0 w-full pb-16">
          <div className="flex w-full flex-col items-center px-4">
            <ButtonWithLoader
              className="w-full max-w-sm"
              onClick={handleReveal}
            >
              {t('revealButton', locale)}
            </ButtonWithLoader>
          </div>
        </div>
      )}
    </div>
  );
};
