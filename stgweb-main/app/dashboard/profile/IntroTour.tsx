'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {useCookies} from 'next-client-cookies';
import ReactJoyride from 'react-joyride';
import {useDebounce, useWindowSize} from 'react-use';
import {PreventNavigationBack} from './PreventNavigationBack';
import {getLocaleCode} from '@/lib/locale';
import {
  MOBILE_WITHOUT_RIGHT_SIDEBAR_BREAKPOINT,
  MOBILE_WITH_BOTTOM_NAVI_BREAKPOINT,
  PATHS,
} from '@/constants.mjs';

const texts = {
  tourContent1: {
    'en-US': 'This is your profile. Let’s have a look around!',
    'sv-SE': 'Detta är din profil. Låt oss titta runt!',
    'fi-FI': 'Tämä on profiilisi. Katsotaanpa ympärillemme!',
  },
  tourContent2: {
    'en-US': 'Here you can see your ongoing tools and continue them',
    'sv-SE': 'Här kan du se dina pågående verktyg och fortsätta dem',
    'fi-FI': 'Täällä voit nähdä käynnissä olevat työkalut ja jatkaa niitä',
  },
  tourContent3: {
    'en-US':
      'Here’s your collection preview. Unlock new items with earned hearts.',
    'sv-SE':
      'Här är din samling förhandsvisning. Lås upp nya föremål med intjänade hjärtan.',
    'fi-FI':
      'Tässä on kokoelmaesikatselu. Avaa uusia kohteita ansaituilla sydämillä.',
  },
  tourContent4: {
    'en-US': 'Here you can see your strength collection',
    'sv-SE': 'Här kan du se din styrkesamling',
    'fi-FI': 'Tässä näet vahvuuskokoelmasi',
  },
  tourContent5: {
    'en-US':
      'These are the strengths that you saw in yourself during the onboarding.<br /><br /> If someone else sees strengths in you, they will show up here as well!',
    'sv-SE':
      'Dessa är de styrkor som du såg hos dig själv under omboarding.<br /><br /> Om någon annan ser styrkor hos dig, kommer de också att visas här!',
    'fi-FI':
      'Nämä ovat vahvuudet, jotka huomasit itsessäsi perehdytyksen aikana.<br /><br /> Jos joku muu huomaa vahvuutta sinussa se lisätään listaan!',
  },
  tourContent6: {
    'en-US':
      "Here is your strength composition. It's made from the top strengths you've received to quickly show what are the most common strengths yourself and others have seen in you",
    'sv-SE':
      'Här är din styrkekomposition. Den är skapad från de främsta styrkor du har fått för att snabbt visa vilka styrkor du och andra oftast har sett hos dig',
    'fi-FI':
      'Tässä on vahvuuskoostumuksesi. Se koostuu eniten nähdyistä vahvuuksistasi.',
  },
  tourContent7: {
    'en-US': 'Open individual strengths to see more details',
    'sv-SE': 'Öppna enskilda styrkor för att se mer information',
    'fi-FI': 'Avaa yksittäinen vahvuus nähdäksesi lisätietoja',
  },
  tourSeeTheGood: {
    'en-US': "It's time to See the Good!",
    'sv-SE': 'Det är dags att Se det Goda!',
    'fi-FI': 'Nyt on aika Huomata Hyvä!',
  },
  tourSkip: {
    'en-US': 'Skip tour',
    'sv-SE': 'Skippa',
    'fi-FI': 'Ohita kierros',
  },
  tourPrevious: {
    'en-US': 'Previous',
    'sv-SE': 'Föregående',
    'fi-FI': 'Edellinen',
  },
  tourNext: {
    'en-US': 'Next',
    'sv-SE': 'Nästa',
    'fi-FI': 'Seuraava',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

const Tooltip = (parameters: any) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {index, tooltipProps, primaryProps, backProps, skipProps, step} =
    parameters;
  return (
    <div
      {...tooltipProps}
      className="max-w-[320px] cursor-pointer rounded-md bg-primary-darker-1 p-4 text-center font-bold text-white"
    >
      {step.title && <div>{step.title}</div>}
      <div
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{__html: step.content}}
        onClick={primaryProps.onClick}
      />

      {step.id !== 'final' && (
        <>
          <div className="my-4 border-t border-primary" />
          <div className="mt-3 flex justify-between space-x-3 text-xs">
            <a href="#" className="hover:underline" onClick={skipProps.onClick}>
              {t('tourSkip', locale)}
            </a>
            <div className="space-x-3">
              {index >= 1 && (
                <a
                  href="#"
                  className="hover:underline"
                  onClick={backProps.onClick}
                >
                  {t('tourPrevious', locale)}
                </a>
              )}
              <a
                href="#"
                className="hover:underline"
                onClick={primaryProps.onClick}
              >
                {t('tourNext', locale)}
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export const IntroTour = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const [render, setRender] = useState(false);
  const [steps, setSteps] = useState<any[]>([]);
  const router = useRouter();
  const {width} = useWindowSize();
  const searchParameters = useSearchParams();
  const tour = searchParameters.get('tour');

  const step1 = {
    target: '#intro-tour-step-1',
    content: t('tourContent1', locale),
    disableBeacon: true,
    spotlightPadding: 0,
  };
  const step2 = {
    target: '#intro-tour-step-2',
    placement: 'left',
    content: t('tourContent2', locale),
    disableBeacon: true,
    disableScrolling: true,
  };
  const step3 = {
    target: '#intro-tour-step-3',
    placement: 'left',
    content: t('tourContent3', locale),
    disableBeacon: true,
    disableScrolling: true,
  };
  const step4 = {
    target: '#intro-tour-step-4',
    content: t('tourContent4', locale),
    disableBeacon: true,
  };
  const step5 = {
    target: '#intro-tour-step-5',
    content: t('tourContent5', locale),
    disableBeacon: true,
    disableScrolling: true,
  };
  const step6 = {
    target: '#intro-tour-step-6',
    content: t('tourContent6', locale),
    disableBeacon: true,
    disableScrolling: true,
  };
  const step7 = {
    target: '#intro-tour-step-7',
    content: t('tourContent7', locale),
    disableBeacon: true,
  };
  const step8Desktop = {
    id: 'final',
    target: '#intro-tour-step-see-the-good-desktop',
    placement: 'right',
    content: t('tourSeeTheGood', locale),
    disableScrolling: true,
    disableBeacon: true,
  };
  const step8Mobile = {
    id: 'final',
    target: '#intro-tour-step-see-the-good-mobile',
    content: t('tourSeeTheGood', locale),
    disableScrolling: true,
    disableBeacon: true,
  };
  // ... Define other steps

  const joyrideCallback = (parameters: any) => {
    if (parameters.action === 'skip') {
      router.push(PATHS.profile);
    }

    if (
      parameters.action === 'close' &&
      parameters.type === 'tour:end' &&
      tour === 'intro2'
    ) {
      router.push(PATHS.seeTheGoodModal);
    }
  };

  const setStepsResponsive = () => {
    if (tour === 'intro1') {
      // allSteps = [step1]
      if (width <= MOBILE_WITHOUT_RIGHT_SIDEBAR_BREAKPOINT) {
        // all but step 2 and 3, since the sidebar isn't there
        setSteps([step1, step4, step5, step6, step7]);
      } else {
        // all steps 1-7
        setSteps([step1, step2, step3, step4, step5, step6, step7]);
      }
    }

    if (tour === 'intro2') {
      if (width <= MOBILE_WITH_BOTTOM_NAVI_BREAKPOINT) {
        // different step 8, since the button is in a different location
        setSteps([step8Mobile]);
      } else {
        setSteps([step8Desktop]);
      }
    }
  };

  useEffect(() => {
    let tourInitTimeout: any;
    if (['intro1', 'intro2'].includes(tour ?? '')) {
      tourInitTimeout = setTimeout(() => {
        setStepsResponsive();
        setRender(true);
      }, 300);
    }

    return () => {
      clearTimeout(tourInitTimeout);
    };
  }, [tour]);

  useDebounce(setStepsResponsive, 100, [width]);

  if (render) {
    return (
      <>
        {/* hack to remove the "arrow" pointer from the joyride modals */}
        {/* eslint-disable-next-line react/no-unknown-property */}
        <style jsx global>{`
          .__floater__arrow {
            display: none !important;
          }
        `}</style>
        {/* this is just a fixed floating placeholder for the first step, since
        it's not actually pointing to any specific element */}
        <div
          id="intro-tour-step-1"
          className="fixed left-1/2 top-20 h-[0px] w-[0px]"
        />
        <ReactJoyride
          continuous
          showSkipButton
          steps={steps}
          tooltipComponent={Tooltip}
          callback={joyrideCallback}
        />
        <PreventNavigationBack />
      </>
    );
  }

  return null;
};
