import {Buffer} from 'node:buffer';
import process from 'node:process';

type CachedAnalyticsScript = {
  body: Uint8Array;
  contentType?: string;
};

let cachedAnalyticsScript: CachedAnalyticsScript | undefined;
let analyticsScriptPromise: Promise<CachedAnalyticsScript> | undefined;

export const fetchAnalyticsScript = async () => {
  if (cachedAnalyticsScript) {
    return cachedAnalyticsScript;
  }

  if (analyticsScriptPromise) {
    return analyticsScriptPromise;
  }

  analyticsScriptPromise = (async () => {
    try {
      if (!process.env.UMAMI_HOST) {
        throw new Error('UMAMI_HOST env variable is not set');
      }

      const scriptUrl = new URL('script.js', process.env.UMAMI_HOST);
      const analyticsResponse = await fetch(scriptUrl);

      if (!analyticsResponse.ok) {
        throw new Error(
          `Failed to fetch analytics script (${analyticsResponse.status} ${analyticsResponse.statusText})`,
        );
      }

      const body = Buffer.from(await analyticsResponse.arrayBuffer());
      const contentType =
        analyticsResponse.headers.get('content-type') ?? undefined;

      const script = {body, contentType};
      cachedAnalyticsScript = script;

      return script;
    } finally {
      analyticsScriptPromise = undefined;
    }
  })();

  return analyticsScriptPromise;
};
