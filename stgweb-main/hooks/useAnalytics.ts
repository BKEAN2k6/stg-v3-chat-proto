import {useCookies} from 'next-client-cookies';
import useAuth from './use-auth';
import {refreshAuthIfExpired} from '@/lib/directus';
import {recordEvent} from '@/lib/utils';

const DEBUG = process.env.NODE_ENV === 'development';

const useAnalytics = () => {
  const cookies = useCookies();
  const {getLoggedInUserId} = useAuth();
  const uid = getLoggedInUserId();

  const doRecordEvent = async (
    event: string,
    metadata?: Record<string, any>,
  ) => {
    if (!uid) {
      if (DEBUG) {
        console.log('EventRecorder: not enough data to record event');
      } // prettier-ignore

      return;
    }

    try {
      let browser;
      if (typeof window !== 'undefined' && !cookies.get('sessid')) {
        browser = {
          language: navigator?.language,
          colorDepth: screen?.colorDepth,
          screenHeight: screen?.height,
          screenWidth: screen?.width,
          timeZoneOffset: -new Date().getTimezoneOffset(),
          userAgent: navigator?.userAgent,
        };
      }

      await refreshAuthIfExpired();
      await recordEvent({uid, event, metadata, browser});
      if (DEBUG) {
        console.log(`EventRecorder: recorded ${event}`);
      } // prettier-ignore
    } catch {
      if (DEBUG) {
        console.log(`EventRecorder: failed to record ${event}`);
      } // prettier-ignore
    }
  };

  return {
    recordEvent: doRecordEvent,
  };
};

export default useAnalytics;
