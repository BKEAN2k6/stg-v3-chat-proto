import {type Request, type Response} from 'express';
import {isDocumentArray} from '@typegoose/typegoose';
import {CoachPost, ProxyPost, Community} from '../../../models/index.js';
import {
  type CreateCoachPostRequest,
  type CreateCoachPostResponse,
} from '../../client/ApiTypes.js';
import convertToTimeZone from '../convertToTimeZone.js';

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
    isProcessing: true,
  });

  await coachPost.populate([
    {
      path: 'images',
      select:
        '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
    },
  ]);

  if (!isDocumentArray(coachPost.images)) {
    throw new Error('Images are not populated');
  }

  response.json({
    ...coachPost.toJSON(),
    images: coachPost.images.map((image) => image.toJSON()),
    createdAt: coachPost.createdAt!.toJSON(),
    updatedAt: coachPost.updatedAt!.toJSON(),
    showDate: coachPost.showDate.toJSON(),
    postType: 'coach-post',
  } satisfies CreateCoachPostResponse);

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
            postReference: coachPost._id,
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

  coachPost.isProcessing = false;
  await coachPost.save();
}
