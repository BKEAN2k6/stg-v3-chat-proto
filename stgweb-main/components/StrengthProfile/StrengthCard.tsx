'use client';

import {useCookies} from 'next-client-cookies';
import {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import Link from 'next/link';
import useElementPosition from '../draft/use-element-position';
import {StrengthBadge} from '../atomic/molecules/StrengthBadge';
import {LargerThanIcon} from '../atomic/atoms/LargerThanIcon';
import Confetti1 from '../draft/confetti-1';
import {
  StrengthColorMap,
  StrengthTranslationMap,
  type StrengthSlug,
} from '@/lib/strength-data';
import {getLocaleCode} from '@/lib/locale';
import useDashboard from '@/hooks/useDashboard';
import {PATHS} from '@/constants.mjs';
import {cn, sp} from '@/lib/utils';

const texts = {
  strengthOpenText: {
    'en-US': 'Open',
    'sv-SE': 'Öppna',
    'fi-FI': 'Avaa',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly slug: StrengthSlug;
  readonly initialCount: number;
  readonly id?: string;
  readonly className?: string;
  readonly isFetchingData?: boolean;
  readonly target: 'group' | 'self';
};

export const StrengthCard = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));
  const {slug, id, className, initialCount, isFetchingData, target} = props;
  const {position, elementRef} = useElementPosition();
  const {dashboardState, setDashboardState} = useDashboard();
  const [count, setCount] = useState(initialCount);
  const [shouldPop, setShouldPop] = useState(false);
  const [popped, setPopped] = useState(false);
  const parameters = useParams();

  let cardLinkPath = PATHS.home;
  if (target === 'group') {
    cardLinkPath = sp(PATHS.groupStrengthDetailsModal, {
      strength: slug,
      groupSlug: parameters.groupSlug as string,
    });
  }

  if (target === 'self') {
    cardLinkPath = sp(PATHS.profileStrengthDetailsModal, {strength: slug});
  }

  useEffect(() => {
    if (!popped && slug === dashboardState.lastIncrementedStrength?.slug) {
      setCount(count + 1);
      setShouldPop(true);
      setPopped(true);
      setTimeout(() => {
        setShouldPop(false);
      }, 3000);
    }

    return () => {
      setDashboardState({
        ...dashboardState,
        lastIncrementedStrength: undefined,
      });
    };
  }, [dashboardState.lastIncrementedStrength]);

  return (
    <Link
      id={id}
      href={cardLinkPath}
      className={cn(
        'flex w-full items-center justify-between rounded-lg bg-gray-200 p-4',
        className,
      )}
      style={{backgroundColor: StrengthColorMap[slug][200]}}
    >
      <div className="flex items-center">
        <div className="mr-8 w-[80px]">
          <StrengthBadge slug={slug} />
        </div>
        <div ref={elementRef}>
          <p className="mb-2 text-2xl font-bold">
            {isFetchingData ? '...' : count}
          </p>
          <p className="text-xs font-bold uppercase">
            {StrengthTranslationMap[slug][locale]}
          </p>
        </div>
      </div>
      <div className="flex cursor-pointer items-center space-x-2">
        <p className="hidden text-sm xs:block">
          {t('strengthOpenText', locale)}
        </p>
        <LargerThanIcon className="h-6 w-6" />
      </div>
      {shouldPop && (
        <Confetti1 x={(position.x - 2) / 100} y={position.y / 100} />
      )}
    </Link>
  );
};
