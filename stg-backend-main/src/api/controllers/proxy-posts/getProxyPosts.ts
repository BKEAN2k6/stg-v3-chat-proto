import {type Request, type Response} from 'express';
import {Post} from '../../../models';
import {type GetProxyPostsResponse} from '../../client/ApiTypes';

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
    .sort({createdAt: -1});

  response.json(
    posts.map((post) => post.toJSON()) satisfies GetProxyPostsResponse,
  );
}
