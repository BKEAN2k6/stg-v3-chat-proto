import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {CoachPost, ProxyPost, Community} from '../../../models';
import {
  type UpdateCoachPostRequest,
  type UpdateCoachPostResponse,
  type StrengthSlug,
} from '../../client/ApiTypes';
import convertToTimeZone from '../convertToTimeZone';

export async function updateCoachPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  const {translations, images, strengths, showDate} =
    request.body as UpdateCoachPostRequest;

  const coachPost = await CoachPost.findById(id);

  if (!coachPost) {
    response.status(404).json({error: 'CoachPost not found'});
    return;
  }

  if (translations) {
    coachPost.translations = translations;
  }

  if (images) {
    coachPost.images = images.map(
      (image) => new mongoose.Types.ObjectId(image),
    );
  }

  if (strengths) {
    coachPost.strengths = strengths as mongoose.Types.Array<StrengthSlug>;
  }

  if (showDate) {
    const showDateDate = new Date(showDate);

    if (showDateDate.getTime() !== coachPost.showDate.getTime()) {
      const communites = await Community.find({});
      const proxyPosts = communites.map(async (community) => {
        return ProxyPost.updateOne(
          {
            community: community._id,
            postReference: coachPost._id,
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

    coachPost.showDate = showDateDate;
  }

  await coachPost.save();
  await coachPost.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
  ]);

  response.json(coachPost.toJSON() satisfies UpdateCoachPostResponse);
}
