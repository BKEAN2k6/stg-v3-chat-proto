'use client';

import {toast} from 'react-hot-toast';
import {refreshAuthIfExpired} from '@/lib/directus';
import useLegacyEffect from '@/hooks/use-legacy-effect';

export const DevPage = () => {
  const handleReward = async (rewardSlug: string) => {
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch('/utils/reward', {
        method: 'POST',
        body: JSON.stringify({
          rewardSlug,
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }

      toast('ok');
    } catch (error) {
      const message = (error as Error).message;
      console.log('message', message);
      // catch specific errors or fall down to this one
      toast.error('unknown err');
    }
  };

  const handleCancelQueuedEmail = async () => {
    try {
      await refreshAuthIfExpired({force: true});
      const call = await fetch('/utils/cancel-queued-email', {
        method: 'POST',
        body: JSON.stringify({
          templateNameStart: 'Strength received',
        }),
      });
      if (!call.ok) {
        const body = await call.json();
        throw new Error(body.message || 'unknown');
      }

      const body = await call.json();
      console.log(body);
      toast('ok');
    } catch (error) {
      const message = (error as Error).message;
      console.log('message', message);
      // catch specific errors or fall down to this one
      toast.error('unknown err');
    }
  };

  useLegacyEffect(() => {
    const run = async () => {
      console.log('whatsup');
    };

    run();
  }, []);

  return (
    <div className="min-safe-h-screen flex w-full items-center justify-center">
      <div className="text-center">
        <p>Hello!</p>
        <button
          type="button"
          className="mt-4 underline"
          onClick={async () => handleReward('daily-see-the-good-flow')}
        >
          Give points from daily-flow
        </button>
        <br />
        <button
          type="button"
          className="mt-4 underline"
          onClick={async () => handleReward('onboarding')}
        >
          Give points from onboarding
        </button>
        <br />
        <button
          type="button"
          className="mt-4 underline"
          onClick={handleCancelQueuedEmail}
        >
          Cancel pending delivery item
        </button>
      </div>
    </div>
  );
};
