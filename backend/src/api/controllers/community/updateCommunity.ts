import {type Request, type Response} from 'express';
import {Community, ProxyPost, Post} from '../../../models/index.js';
import {
  type UpdateCommunityRequest,
  type UpdateCommunityParameters,
  type UpdateCommunityResponse,
} from '../../client/ApiTypes.js';
import convertToTimeZone from '../convertToTimeZone.js';
import {serializeCommunity} from './serializeCommunity.js';

export async function updateCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateCommunityParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const {name, description, language, timezone, avatar} =
    request.body as UpdateCommunityRequest;

  if (name) {
    community.name = name;
  }

  if (description) {
    community.description = description;
  }

  if (language) {
    community.language = language;
  }

  if (timezone && community.timezone !== timezone) {
    community.timezone = timezone;

    const beginningOfTomorrow = new Date();
    beginningOfTomorrow.setDate(beginningOfTomorrow.getDate() + 1);
    beginningOfTomorrow.setHours(0, 0, 0, 0);
    const timedPosts = await Post.find({
      $or: [{postType: 'coach-post'}, {postType: 'challenge'}],
      showDate: {$gte: beginningOfTomorrow},
      community: null,
    });

    const proxyPosts = timedPosts.map(async (post) => {
      // For some reason this check fails in github
      if (!Post.isChallenge(post) && !Post.isCoachPost(post)) {
        return;
      }

      return ProxyPost.updateOne(
        {
          community: community._id,
          postReference: post._id,
        },
        {
          createdAt: convertToTimeZone(post.showDate, community.timezone),
        },
        {
          timestamps: false,
          strict: false,
        },
      );
    });

    await Promise.all(proxyPosts);
  }

  if (avatar === '' || avatar) {
    community.avatar = avatar;
  }

  await community.save();

  response.json(
    serializeCommunity(community) satisfies UpdateCommunityResponse,
  );
}
