import Image from 'next/image';
import {format} from 'date-fns';
import {type LocaleCode} from '@/lib/locale';
import {
  StrengthAdjectivesMap,
  StrengthColorMap,
  StrengthTranslationMap,
  type StrengthSlug,
} from '@/lib/strength-data';
import {cn, equalDivision} from '@/lib/utils';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';
import {LargerThanIcon} from '@/components/atomic/atoms/LargerThanIcon';

export type PlayerStrengthItem = {
  slug: StrengthSlug;
  seenAsBonus: boolean;
  seenInSelf: boolean;
  count: number;
  from: Array<{name: string; id: string; self: boolean}>;
};

const texts = {
  strengthSession: {
    'en-US': 'Strength sprint',
    'fi-FI': 'Vahvuustuokio',
    'sv-SE': 'styrkesprint',
  },
  strengthsSeenInYou: {
    'en-US': 'These strengths were seen in you',
    'fi-FI': 'Näitä vahvuuksia sinussa nähtiin',
    'sv-SE': 'Dessa styrkor sågs hos dig',
  },
  from: {
    'en-US': 'from',
    'fi-FI': 'lähettäjät',
    'sv-SE': 'från',
  },
  self: {
    'en-US': 'Yourself',
    'fi-FI': 'Sinä itse',
    'sv-SE': 'Dig själv',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

type StrengthBarProps = {
  readonly locale: LocaleCode;
  readonly strengths?: PlayerStrengthItem[];
};

const StrengthBar = (props: StrengthBarProps) => {
  const {locale, strengths} = props;
  if (!strengths) return null;

  const counts = strengths.map((strength) => strength.count);
  const percentages = equalDivision(counts);

  return (
    <>
      <div className="relative mb-2 flex h-3 w-full flex-row overflow-hidden rounded-lg">
        {strengths.map((strength, index) => (
          <div
            key={`strength-bar-chart-${strength.slug}`}
            className="flex h-full flex-col"
            style={{
              width: `${percentages[index]}%`,
              backgroundColor: StrengthColorMap[strength.slug][300],
            }}
          />
        ))}
      </div>
      <div className="relative flex min-h-0 min-w-0 flex-row flex-wrap">
        {strengths.map((strength, index) => (
          <div
            key={`strength-bar-chart-legend-${strength.slug}`}
            className="relative mr-4 mt-2 flex min-h-0 min-w-0 flex-row items-center"
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{
                backgroundColor: StrengthColorMap[strength.slug][300],
              }}
            />
            <span className="mb-[-3px] ml-4 overflow-auto whitespace-pre text-xs leading-6 text-gray-800">
              {StrengthTranslationMap[strength.slug][locale]}{' '}
              {percentages[index]}%
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

type StrengthCardProps = {
  readonly locale: LocaleCode;
  readonly ordinal: number;
  readonly strength: PlayerStrengthItem;
  readonly onClick?: (event: any, strengthSlug: StrengthSlug) => void;
};

const StrengthCard = (props: StrengthCardProps) => {
  const {locale, ordinal, strength, onClick} = props;
  const fromString = strength.from
    .map((user) => (user.self ? t('self', locale) : user.name))
    .join(', ');
  return (
    <a
      key={strength.slug}
      href="#"
      className={cn(
        'flex w-full items-center justify-between rounded-lg bg-gray-200 p-4',
      )}
      style={{backgroundColor: StrengthColorMap[strength.slug][200]}}
      onClick={(event) => {
        onClick?.(event, strength.slug);
      }}
    >
      <div className="flex items-center">
        <div className="mr-4 w-[30px] min-w-[30px]">
          <div className="text-center">
            {
              {
                1: (
                  <Image
                    src="/images/misc/gold-medal.png"
                    alt="Gold medal"
                    width={70}
                    height={76}
                  />
                ),
                2: (
                  <Image
                    src="/images/misc/silver-medal.png"
                    alt="Silver medal"
                    width={70}
                    height={76}
                  />
                ),
                3: (
                  <Image
                    src="/images/misc/bronze-medal.png"
                    alt="Bronze medal"
                    width={70}
                    height={76}
                  />
                ),
              }[ordinal]
            }
            {ordinal > 3 && ordinal}
          </div>
        </div>
        <div className="mr-8 w-[60px] xs:w-[80px]">
          <div
            className={cn(
              'relative flex items-center justify-center rounded-full',
              'xs:max-h-[80px] xs:min-h-[80px] xs:min-w-[80px] xs:max-w-[80px]',
              'max-h-[70px] min-h-[70px] min-w-[70px] max-w-[70px]',
            )}
            style={{
              backgroundColor: StrengthColorMap[strength.slug][300],
            }}
          >
            <Image
              src={strengthImageBySlug(strength.slug)}
              alt={strength.slug}
              layout="fill"
              objectFit="cover"
            />
            {strength.count > 1 && (
              <div className="absolute bottom-0 right-0">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
                  <div className="text-xs font-bold">x{strength.count}</div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <p className="text-md font-bold">
            {StrengthTranslationMap[strength.slug][locale]}
          </p>
          <div className="text-xs">
            {StrengthAdjectivesMap[strength.slug][locale]}
          </div>
          <div className="flex">
            <div className="text-xs">
              {t('from', locale)}:{' '}
              <span className="font-bold text-gray-700">{fromString}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex cursor-pointer items-center space-x-2">
        <LargerThanIcon className="h-6 w-6" />
      </div>
    </a>
  );
};

type Props = {
  readonly strengths?: PlayerStrengthItem[];
  readonly date?: string | undefined;
  readonly playerName?: string | undefined;
  readonly playerColor?: string | undefined;
  readonly locale: LocaleCode;
  readonly onStrengthCardClick?: (
    event: any,
    strengthSlug: StrengthSlug,
  ) => void;
};

export const PlayerStats = (props: Props) => {
  const {
    strengths,
    date,
    playerName,
    playerColor,
    locale,
    onStrengthCardClick,
  } = props;

  return (
    <div className="w-full max-w-xl">
      {playerName && playerColor && (
        <div
          className="mb-4 inline rounded-md px-3 py-2 text-lg font-bold"
          style={{backgroundColor: playerColor}}
        >
          {playerName}
        </div>
      )}
      {date && (
        <div className="mt-4 text-xs">
          {t('strengthSession', locale)} • {format(new Date(date), 'd.M.yyyy')}
        </div>
      )}
      <div className="mb-8 mt-6">
        <StrengthBar locale={locale} strengths={strengths} />
      </div>
      <div className="flex flex-wrap space-y-4">
        {(strengths ?? [])
          .sort((a, b) => b.count - a.count)
          .map((strength, index) => (
            <StrengthCard
              key={strength.slug}
              locale={locale}
              strength={strength}
              ordinal={index + 1}
              onClick={onStrengthCardClick}
            />
          ))}
      </div>
    </div>
  );
};
