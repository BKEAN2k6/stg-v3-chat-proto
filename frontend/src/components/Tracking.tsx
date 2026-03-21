import {useEffect} from 'react';
import constants from '@/constants.js';
import {track} from '@/helpers/analytics.js';

type Properties = {
  readonly children: React.ReactNode;
};

const parametersToRemove = ['c', 'lang'];

export default function Tracking(properties: Properties): React.ReactNode {
  useEffect(() => {
    let url = globalThis.location.pathname;

    const urlObject = new URL(globalThis.location.href);
    for (const parameter of parametersToRemove) {
      urlObject.searchParams.delete(parameter);
    }

    const trackPageView = () => {
      track({
        hostname: globalThis.location.hostname,
        language: navigator.language,
        referrer: document.referrer,
        screen: `${window.screen.width}x${window.screen.height}`,
        title: document.title,
        url: urlObject.pathname + urlObject.search,
        website: constants.ANALYTICS_ID,
      });
    };

    trackPageView();

    const handlePathChange = () => {
      requestAnimationFrame(() => {
        if (url !== globalThis.location.pathname) {
          url = globalThis.location.pathname;
          trackPageView();
        }
      });
    };

    document.body.addEventListener('click', handlePathChange, true);

    return () => {
      document.body.removeEventListener('click', handlePathChange, true);
    };
  }, []);

  return properties.children;
}
