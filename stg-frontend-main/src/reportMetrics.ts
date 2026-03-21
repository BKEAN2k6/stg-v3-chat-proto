import api from './api/ApiClient';

const checkEvent = (event: Trackables) => {
  if (!event.app) {
    throw new Error('Missing app');
  }

  if (!event.page) {
    throw new Error('Missing page');
  }

  if (!event.path) {
    throw new Error('Missing url');
  }

  if (event.action === 'page-view') {
    if (!event.language) {
      throw new Error('Missing language');
    }
  } else if (event.action === 'click') {
    if (!event.element) {
      throw new Error('Missing name');
    }
  } else {
    throw new Error('Invalid action');
  }
};

type FunctionType<T> = (arg: T) => void;

class ViewLimiter<T extends Record<string, unknown>> {
  private readonly cache: Map<string, number>;
  private readonly timeout: number;

  constructor() {
    this.cache = new Map<string, number>();
    this.timeout = 1000 * 60 * 5;
  }

  call(fn: FunctionType<T>, object: T): void {
    const now = Date.now();
    const key = JSON.stringify(object);

    if (this.cache.has(key) && now - this.cache.get(key)! < this.timeout) {
      return;
    }

    this.cache.set(key, now);
    fn(object);
  }
}

const metricLimiter = new ViewLimiter<PageView>();
const metricsFuntion = function (data: Trackables) {
  try {
    switch (data.action) {
      case 'click': {
        void api.createClick(data);
        break;
      }

      case 'page-view': {
        void api.createPageView(data);
        break;
      }

      default: {
        break;
      }
    }
  } catch (error) {
    console.error(error);
    console.error(data);
  }
};

const reportMetrics = (data: Trackables) => {
  if (!data.community) {
    return;
  }

  try {
    checkEvent(data);
  } catch (error) {
    console.error(error);
    console.error(data);
    return;
  }

  if (data.action === 'page-view') {
    metricLimiter.call(metricsFuntion, data);
    return;
  }

  metricsFuntion(data);
};

export default reportMetrics;
