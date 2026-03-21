import mongoose from 'mongoose';
import {type Request, type Response} from 'express';
import {CoachPost, ProxyPost, Community} from '../../../models/index.js';
import {
  type UpdateCoachPostRequest,
  type StrengthSlug,
} from '../../client/ApiTypes.js';
import convertToTimeZone from '../convertToTimeZone.js';

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

  if (coachPost.isProcessing) {
    response.status(400).json({error: 'Cannot update unprocessed challenge'});
    return;
  }

  coachPost.isProcessing = true;

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

  await coachPost.save();
  await coachPost.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
  ]);

  response.sendStatus(201);

  if (showDate) {
    const showDateDate = new Date(showDate);

    if (showDateDate.getTime() !== coachPost.showDate.getTime()) {
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
                postReference: coachPost._id,
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

    coachPost.showDate = showDateDate;
  }

  coachPost.isProcessing = false;
  await coachPost.save();
}
