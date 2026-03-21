import TimeAgo from 'react-timeago';
// @ts-expect-error not typed
import fiStrings from 'react-timeago/lib/language-strings/fi';
// @ts-expect-error not typed
import svStrings from 'react-timeago/lib/language-strings/sv';
// @ts-expect-error not typed
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';
import {useLingui} from '@lingui/react';

type Props = {
  readonly date: string;
};

export function TimeAgoTranslated(props: Props) {
  const {i18n} = useLingui();
  const {date} = props;
  let formatterProps = {};
  if (i18n.locale === 'fi')
    formatterProps = {formatter: buildFormatter(fiStrings)}; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  if (i18n.locale === 'sv')
    formatterProps = {formatter: buildFormatter(svStrings)}; // eslint-disable-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call

  return <TimeAgo date={date} {...formatterProps} />;
}
