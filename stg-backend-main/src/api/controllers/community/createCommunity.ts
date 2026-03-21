import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Community, ProxyPost, Post} from '../../../models';
import {
  type CreateCommunityRequest,
  type CreateCommunityResponse,
} from '../../client/ApiTypes';
import convertToTimeZone from '../convertToTimeZone';

export async function createCommunity(
  request: Request,
  response: Response,
): Promise<void> {
  const {name, description, language, timezone} =
    request.body as CreateCommunityRequest;

  const community = await Community.create({
    name,
    description,
    language,
    timezone,
  });

  await community.upsertMemberAndSave(
    new mongoose.Types.ObjectId(request.user.id),
    'admin',
  );

  const begiginingOfToday = new Date();
  begiginingOfToday.setHours(0, 0, 0, 0);
  const timedPosts = await Post.find({
    $or: [{postType: 'coach-post'}, {postType: 'challenge'}],
    showDate: {$gte: begiginingOfToday},
  });

  const proxyPosts = timedPosts.map(async (post) => {
    if (!Post.isChallenge(post) && !Post.isCoachPost(post)) {
      return;
    }

    const proxyPost = new ProxyPost(
      {
        community: community._id,
        postReference: post._id,
        createdAt: convertToTimeZone(
          new Date(post.showDate),
          community.timezone,
        ),
      },
      {
        timestamps: false,
        strict: false,
      },
    );

    return proxyPost.save();
  });

  await Promise.all(proxyPosts);

  response
    .status(201)
    .json(community.toJSON() satisfies CreateCommunityResponse);
}
