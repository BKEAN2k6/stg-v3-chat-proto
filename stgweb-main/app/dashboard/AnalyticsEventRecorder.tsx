'use client';

import useLegacyEffect from '@/hooks/use-legacy-effect';
import useAnalytics from '@/hooks/useAnalytics';

type Props = {
  readonly event: string;
};

export const AnalyticsEventRecorder = (props: Props) => {
  const {event} = props;
  const {recordEvent} = useAnalytics();

  useLegacyEffect(() => {
    setTimeout(() => {
      recordEvent(event);
    }, 100);
  }, []);

  return null;
};
