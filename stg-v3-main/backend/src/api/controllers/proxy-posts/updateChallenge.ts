import {type Request, type Response} from 'express';
import {Challenge, ProxyPost, Community} from '../../../models/index.js';
import {type UpdateChallengeRequest} from '../../client/ApiTypes.js';
import convertToTimeZone from '../convertToTimeZone.js';

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

  if (challenge.isProcessing) {
    response.status(400).json({error: 'Cannot update unprocessed challenge'});
    return;
  }

  challenge.isProcessing = true;

  if (translations) {
    challenge.translations = translations;
  }

  if (theme) {
    challenge.theme = theme;
  }

  if (strength) {
    challenge.strength = strength;
  }

  await challenge.save();

  response.sendStatus(201);

  if (showDate) {
    const showDateDate = new Date(showDate);
    if (showDateDate.getTime() !== challenge.showDate.getTime()) {
      const communities = await Community.find({});

      const batchSize = 10;

      for (let i = 0; i < communities.length; i += batchSize) {
        const batch = communities.slice(i, i + batchSize);

        // eslint-disable-next-line no-await-in-loop
        await Promise.all(
          batch.map((community) =>
            ProxyPost.updateOne(
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
            ),
          ),
        );
      }
    }

    challenge.showDate = showDateDate;
  }

  challenge.isProcessing = false;
  await challenge.save();
}
