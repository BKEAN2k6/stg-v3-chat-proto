import {Challenge, ChallengeData} from '../models';

export default async function challengeTheme() {
  await Challenge.updateMany({}, {theme: 'default'});
  await ChallengeData.updateMany({}, {theme: 'default'});
}
