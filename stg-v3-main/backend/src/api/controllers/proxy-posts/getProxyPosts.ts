import {type Request, type Response} from 'express';
import {isDocumentArray} from '@typegoose/typegoose';
import {Post} from '../../../models/index.js';
import {type GetProxyPostsResponse} from '../../client/ApiTypes.js';

export async function getProxyPosts(
  request: Request,
  response: Response,
): Promise<void> {
  const posts = await Post.find({
    community: null,
  })
    .populate([
      {
        path: 'images',
        select:
          '_id originalImageUrl resizedImageUrl thumbnailImageUrl aspectRatio',
      },
      {
        path: 'createdBy',
        select: '_id firstName lastName avatar',
      },
    ])
    .sort({showDate: -1});

  response.json(
    posts.map((post) => {
      if (Post.isChallenge(post)) {
        return {
          ...post.toJSON(),
          createdAt: post.createdAt!.toJSON(),
          updatedAt: post.updatedAt!.toJSON(),
          showDate: post.showDate.toJSON(),
          postType: 'challenge',
        };
      }

      if (Post.isCoachPost(post)) {
        if (!isDocumentArray(post.images)) {
          throw new Error('comment.images is not a Document array');
        }

        return {
          ...post.toJSON(),
          createdAt: post.createdAt!.toJSON(),
          updatedAt: post.updatedAt!.toJSON(),
          showDate: post.showDate.toJSON(),
          images: post.images.map((image) => image.toJSON()),
          postType: 'coach-post',
        };
      }

      throw new Error('Unexpected post type');
    }) satisfies GetProxyPostsResponse,
  );
}
