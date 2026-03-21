import {type Request, type Response} from 'express';
import {Post, ProxyPost} from '../../../models';
import {type RemoveProxyPostParameters} from '../../client/ApiTypes';

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

  const proxyPosts = await ProxyPost.find({postReference: post._id});
  await Promise.all(proxyPosts.map(async (proxyPost) => proxyPost.delete()));

  response.sendStatus(204);
}
