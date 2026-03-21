import {type Request, type Response} from 'express';
import {Challenge, ProxyPost, Community} from '../../../models/index.js';
import {
  type CreateChallengeRequest,
  type CreateChallengeResponse,
} from '../../client/ApiTypes.js';
import convertToTimeZone from '../convertToTimeZone.js';

export async function createChallenge(
  request: Request,
  response: Response,
): Promise<void> {
  const {translations, strength, showDate, theme} =
    request.body as CreateChallengeRequest;

  const challenge = await Challenge.create({
    translations,
    theme,
    strength,
    showDate: new Date(showDate),
    isProcessing: true,
  });

  response.json({
    ...challenge.toJSON(),
    createdAt: challenge.createdAt!.toJSON(),
    updatedAt: challenge.updatedAt!.toJSON(),
    showDate: challenge.showDate.toJSON(),
    postType: 'challenge',
  } satisfies CreateChallengeResponse);

  const communities = await Community.find({});

  const batchSize = 10;

  for (let i = 0; i < communities.length; i += batchSize) {
    const batch = communities.slice(i, i + batchSize);

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(
      batch.map(async (community) => {
        const post = new ProxyPost(
          {
            community: community._id,
            postReference: challenge._id,
            createdAt: convertToTimeZone(
              new Date(showDate),
              community.timezone,
            ),
          },
          {
            timestamps: false,
            strict: false,
          },
        );

        return post.save();
      }),
    );
  }

  challenge.isProcessing = false;
  await challenge.save();
}
