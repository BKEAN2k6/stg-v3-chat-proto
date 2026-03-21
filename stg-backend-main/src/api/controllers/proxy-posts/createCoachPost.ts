import {type Request, type Response} from 'express';
import {CoachPost, ProxyPost, Community} from '../../../models';
import {
  type CreateCoachPostRequest,
  type CreateCoachPostResponse,
} from '../../client/ApiTypes';
import convertToTimeZone from '../convertToTimeZone';

export async function createCoachPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {translations, images, strengths, showDate} =
    request.body as CreateCoachPostRequest;

  const coachPost = await CoachPost.create({
    translations,
    images,
    strengths,
    showDate: new Date(showDate),
  });

  const communites = await Community.find({});

  const proxyPosts = communites.map(async (community) => {
    const post = new ProxyPost(
      {
        community: community._id,
        postReference: coachPost._id,
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

  await coachPost.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
  ]);

  response.json(coachPost.toJSON() satisfies CreateCoachPostResponse);
}
