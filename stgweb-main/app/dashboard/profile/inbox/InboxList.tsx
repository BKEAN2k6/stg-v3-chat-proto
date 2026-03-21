'use client';

import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {formatDistanceToNow} from 'date-fns';
import {useDebounce} from 'react-use';
import {fetchInboxMoments} from '../../modal/profile/inbox/_utils';
import {PATHS} from '@/constants.mjs';
import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';
import {type LocaleCode, mapLocaleCodeToDateFNSLocale} from '@/lib/locale';
import {
  StrengthColorMap,
  type StrengthSlug,
  StrengthSlugMap,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {cn} from '@/lib/utils';
import useGlobal from '@/hooks/useGlobal';
import {LargerThanIcon} from '@/components/atomic/atoms/LargerThanIcon';
import {strengthImageBySlug} from '@/components/atomic/atoms/StrengthImage';

const texts = {
  youGotStrength: {
    'en-US': 'You got',
    'sv-SE': 'Du fick',
    'fi-FI': 'Sinussa huomattiin: ',
  },
  open: {
    'en-US': 'Open',
    'sv-SE': 'Öppna',
    'fi-FI': 'Avaa',
  },
};

function t(key: string, locale: string) {
  return (texts as any)?.[key]?.[locale] || 'translation-not-found';
}

export type InboxMoment = {
  id: string;
  strength: StrengthSlug;
  createdAt: string;
};

type Props = {
  readonly moments: InboxMoment[];
  readonly locale: LocaleCode;
};

export const InboxList = (props: Props) => {
  const {locale} = props;
  const [moments, setMoments] = useState(props.moments);
  const {cachedRender} = useGlobal();

  useDebounce(() => {
    const run = async () => {
      if (cachedRender) {
        const directus = createClientSideDirectusClient();
        try {
          await refreshAuthIfExpired({force: true});
          const updatedInboxMoments = await fetchInboxMoments(directus);
          setMoments(updatedInboxMoments);
        } catch {
          console.error('failed to update inbox');
        }
      }
    };

    run();
  });

  return (
    <section className="flex w-full flex-col space-y-4">
      {moments.map((moment) => {
        const strengthSlug = StrengthSlugMap[moment.strength];
        const createdAtDate = new Date(moment.createdAt);
        const createdAtString = createdAtDate.toLocaleString();
        const createdAtWords = formatDistanceToNow(createdAtDate, {
          addSuffix: true,
          locale: mapLocaleCodeToDateFNSLocale[locale],
        });
        return (
          <Link
            key={`inbox-item-${moment.id}`}
            href={`${PATHS.inboxMomentDetails.replace(
              '[momentId]',
              moment.id,
            )}`}
            className={cn(
              'flex w-full items-center justify-between rounded-lg bg-gray-200 p-4',
            )}
            style={{backgroundColor: StrengthColorMap[strengthSlug][200]}}
          >
            <div className="flex items-center">
              <div
                className="mr-8 w-[44px] rounded-full"
                style={{
                  backgroundColor: StrengthColorMap[strengthSlug][300],
                }}
              >
                <Image
                  src={strengthImageBySlug(strengthSlug)}
                  alt={strengthSlug}
                />
              </div>
              <div className="flex flex-col">
                <div className="font-bold">
                  {t('youGotStrength', locale)}{' '}
                  {StrengthTranslationMap[strengthSlug][locale]}
                </div>
                <span title={createdAtString}>{createdAtWords}</span>
              </div>
            </div>
            <div className="flex cursor-pointer items-center space-x-2">
              <p className="hidden text-sm xs:block">{t('open', locale)}</p>
              <LargerThanIcon className="h-6 w-6" />
            </div>
          </Link>
        );
      })}
    </section>
  );
};
