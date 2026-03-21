'use client';

import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {X} from 'lucide-react';
import {useCookies} from 'next-client-cookies';
import {PATHS} from '@/constants.mjs';
import {getLocaleCode} from '@/lib/locale';
import {ArrowRightIcon} from '@/components/atomic/atoms/ArrowRightIcon';

const texts = {
  // startHeadingText: {
  //   "en-US": "Who did you see good in?",
  //   "sv-SE": "Vem såg du något gott i?",
  //   "fi-FI": "Kenessä huomasit hyvää?",
  // },
  pickUserHeadingText: {
    'en-US': 'Which colleague did you see the good in?',
    'sv-SE': 'Vilken kollega såg du något gott i?',
    'fi-FI': 'Kenessä kollegassa huomasit hyvää?',
  },
  pickStrengthHeadingText: {
    'en-US': 'Which strength did you see?',
    'sv-SE': 'Vilken styrka såg du?',
    'fi-FI': 'Mitä vahvuutta huomasit?',
  },
  customizeHeadingText: {
    'en-US': 'Customise before sending',
    'sv-SE': 'Anpassa innan du skickar',
    'fi-FI': 'Syvennä palautetta ennen lähettämistä',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export const HeadingText = () => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const router = useRouter();
  const searchParameters = useSearchParams();

  let headingText;
  const givenReturn = searchParameters.get('return');

  const handleBackAction = () => {
    if (givenReturn) {
      router.push(givenReturn);
      return;
    }

    history.back();
  };

  const pathname = usePathname();
  switch (pathname) {
    case PATHS.seeTheGoodModal: {
      // headingText = t("startHeadingText", locale)
      headingText = ' ';
      break;
    }

    case PATHS.seeTheGoodModalPickUser: {
      headingText = t('pickUserHeadingText', locale);
      break;
    }

    case PATHS.seeTheGoodModalPickStrength: {
      headingText = t('pickStrengthHeadingText', locale);
      break;
    }

    case PATHS.seeTheGoodModalCustomize: {
      headingText = t('customizeHeadingText', locale);
      break;
    }

    default: {
      headingText = '';
    }
  }

  if (!headingText) {
    return null;
  }

  return (
    <div className="flex w-full px-6 pb-4 pt-6">
      <div className="flex-none">
        <a onClick={handleBackAction}>
          <ArrowRightIcon />
        </a>
      </div>
      <div className="flex-1">
        <div className="px-4 text-center">
          <h1 className="text-lg font-bold">{headingText}</h1>
        </div>
      </div>
      <div className="flex-none">
        {/* NOTE: this isn't optimal, as the return isn't forwarded (returns to
        profile from the second screen of the seethegood flow if it was started
        from inbox for example...) */}
        <Link href={givenReturn ?? PATHS.profile}>
          <X className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};
