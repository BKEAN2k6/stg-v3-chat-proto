'use client';

import {useCookies} from 'next-client-cookies';
import {type StrengthPieChartItem} from '../atomic/organisms/StrengthPieChart';
import {StrengthCard} from './StrengthCard';
import {getLocaleCode} from '@/lib/locale';
import {StrengthColorMap, StrengthTranslationMap} from '@/lib/strength-data';

const texts = {
  strengthProfileTitle: {
    'en-US': 'Strength profile',
    'sv-SE': 'Styrkeprofil',
    'fi-FI': 'Vahvuusprofiili',
  },
  strengthOpenText: {
    'en-US': 'Open',
    'sv-SE': 'Öppna',
    'fi-FI': 'Avaa',
  },
  strengthDetailsText: {
    'en-US': 'Show details',
    'sv-SE': 'Visa detaljer',
    'fi-FI': 'Näytä yksityiskohdat',
  },
  yourStrengthsTitle: {
    'en-US': 'Strengths',
    'sv-SE': 'Styrkor',
    'fi-FI': 'Vahvuudet',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type Props = {
  readonly strengths: any;
  readonly topStrengths: any;
  readonly target: 'group' | 'self';
};

export const StrengthProfile = (props: Props) => {
  const cookies = useCookies();
  const locale = getLocaleCode(cookies.get('locale'));

  const {strengths, topStrengths, target} = props;
  const fetchingProfileData = false;

  return (
    <>
      <div className="first-element mb-4 w-full" id="intro-tour-step-6">
        <div className="mb-2 flex w-full justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase">
              {t('strengthProfileTitle', locale)}
            </h2>
          </div>
        </div>

        {fetchingProfileData ? (
          <div role="status" className="w-full animate-pulse">
            <div className="h-6 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
          </div>
        ) : (
          <div className="relative flex h-6 w-full flex-row overflow-hidden rounded-lg">
            {topStrengths?.map((strength: StrengthPieChartItem) => (
              <div
                key={`strength-bar-chart-${strength[0]}`}
                className="flex h-full flex-col"
                style={{
                  width: `${strength[1]}%`,
                  backgroundColor: StrengthColorMap[strength[0]][300],
                }}
              />
            ))}
          </div>
        )}

        <div className="relative flex min-h-0 min-w-0 flex-row flex-wrap">
          {topStrengths?.userTopStrengths?.map(
            (strength: StrengthPieChartItem) => (
              <div
                key={`strength-bar-chart-legend-${strength[0]}`}
                className="relative mr-4 mt-2 flex min-h-0 min-w-0 flex-row items-center"
              >
                <div
                  className="h-4 w-4 rounded-full"
                  style={{
                    backgroundColor: StrengthColorMap[strength[0]][300],
                  }}
                />
                <span className="mb-[-3px] ml-4 overflow-auto whitespace-pre text-xs leading-6 text-gray-800">
                  {StrengthTranslationMap[strength[0]][locale]} {strength[1]}%
                </span>
              </div>
            ),
          )}
        </div>
      </div>

      <div id="intro-tour-step-5" className="mt-8 w-full">
        <div className="mb-2 flex w-full justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase">
              {t('yourStrengthsTitle', locale)}
            </h2>
          </div>
        </div>

        <div className="w-full space-y-4">
          {strengths.map((strengthData: any, idx: number) => (
            <StrengthCard
              key={`strength-card-${strengthData.strength}-${strengthData.count}`}
              {...(idx === 0 && {id: 'intro-tour-step-7'})}
              slug={strengthData.strength}
              initialCount={strengthData.count}
              isFetchingData={fetchingProfileData}
              target={target}
            />
          ))}
        </div>
      </div>
    </>
  );
};
