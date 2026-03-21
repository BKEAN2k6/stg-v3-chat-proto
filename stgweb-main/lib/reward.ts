import {refreshAuthIfExpired} from './directus';

export const grantRewardCredits = async (rewardSlug: string) => {
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
  } catch (error) {
    const message = (error as Error).message;
    console.error(message);
    return false;
  }

  return true;
};
