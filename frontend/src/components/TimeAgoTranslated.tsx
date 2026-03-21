import TimeAgo from 'react-timeago';
import fiStrings from 'react-timeago/lib/language-strings/fi';
import svStrings from 'react-timeago/lib/language-strings/sv';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {useLingui} from '@lingui/react';

type Properties = {
  readonly date: string;
};

export function TimeAgoTranslated(properties: Properties) {
  const {i18n} = useLingui();
  const {date} = properties;
  let formatterProperties = {};
  if (i18n.locale === 'fi')
    formatterProperties = {formatter: buildFormatter(fiStrings)};
  if (i18n.locale === 'sv')
    formatterProperties = {formatter: buildFormatter(svStrings)};

  return <TimeAgo date={date} {...formatterProperties} />;
}
