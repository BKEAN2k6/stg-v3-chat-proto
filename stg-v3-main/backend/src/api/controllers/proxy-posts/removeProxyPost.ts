import {type Request, type Response} from 'express';
import {Post, ProxyPost} from '../../../models/index.js';
import {type RemoveProxyPostParameters} from '../../client/ApiTypes.js';

export async function removeProxyPost(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as RemoveProxyPostParameters;

  const post = await Post.findById(id);
  if (!post) {
    response.status(404).json({error: 'Post not found'});
    return;
  }

  await post.delete();

  response.sendStatus(204);

  const proxyPosts = await ProxyPost.find({postReference: post._id});

  const batchSize = 10;

  for (let i = 0; i < proxyPosts.length; i += batchSize) {
    const batch = proxyPosts.slice(i, i + batchSize);

    // eslint-disable-next-line no-await-in-loop
    await Promise.all(batch.map(async (proxyPost) => proxyPost.delete()));
  }
}
