import {type Request, type Response} from 'express';
import {Challenge, ProxyPost, Community} from '../../../models';
import {
  type CreateChallengeRequest,
  type CreateChallengeResponse,
} from '../../client/ApiTypes';
import convertToTimeZone from '../convertToTimeZone';

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
  });

  const communites = await Community.find({});

  const proxyPosts = communites.map(async (community) => {
    const post = new ProxyPost(
      {
        community: community._id,
        postReference: challenge._id,
        createdAt: convertToTimeZone(new Date(showDate), community.timezone),
      },
      {
        timestamps: false,
        strict: false,
      },
    );

    return post.save();
  });

  await Promise.all(proxyPosts);

  response.json(challenge.toJSON() satisfies CreateChallengeResponse);
}
