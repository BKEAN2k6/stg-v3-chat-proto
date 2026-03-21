'use client';

import {formatDistanceToNow} from 'date-fns';
import {type LocaleCode, mapLocaleCodeToDateFNSLocale} from '@/lib/locale';

type Props = {
  readonly createdAtDate: Date;
  readonly locale: LocaleCode;
};

export const CreatedAt = (props: Props) => {
  const {createdAtDate, locale} = props;

  const createdAtString = createdAtDate.toLocaleString(locale);
  const createdAtWords = formatDistanceToNow(createdAtDate, {
    addSuffix: true,
    locale: mapLocaleCodeToDateFNSLocale[locale],
  });

  return (
    <span className="text-gray-600" title={createdAtString}>
      {createdAtWords}
    </span>
  );
};
