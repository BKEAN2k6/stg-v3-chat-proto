import {type Request, type Response} from 'express';
import {Challenge, ProxyPost, Community} from '../../../models';
import {
  type UpdateChallengeRequest,
  type UpdateChallengeResponse,
} from '../../client/ApiTypes';
import convertToTimeZone from '../convertToTimeZone';

export async function updateChallenge(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const {translations, strength, showDate, theme} =
    request.body as UpdateChallengeRequest;

  const challenge = await Challenge.findById(id);

  if (!challenge) {
    response.status(404).json({error: 'Challenge not found'});
    return;
  }

  if (translations) {
    challenge.translations = translations;
  }

  if (theme) {
    challenge.theme = theme;
  }

  if (strength) {
    challenge.strength = strength;
  }

  if (showDate) {
    const showDateDate = new Date(showDate);
    if (showDateDate.getTime() !== challenge.showDate.getTime()) {
      const communites = await Community.find({});
      const proxyPosts = communites.map(async (community) => {
        return ProxyPost.updateOne(
          {
            community: community._id,
            postReference: challenge._id,
          },
          {
            createdAt: convertToTimeZone(showDateDate, community.timezone),
          },
          {
            timestamps: false,
            strict: false,
          },
        );
      });

      await Promise.all(proxyPosts);
    }

    challenge.showDate = showDateDate;
  }

  await challenge.save();

  response.json(challenge.toJSON() satisfies UpdateChallengeResponse);
}
