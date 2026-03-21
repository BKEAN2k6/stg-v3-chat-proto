import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {User, CommunityMembership} from '../../../models/index.js';
import {
  type GetUserCommunitiesParameters,
  type GetUserCommunitiesResponse,
} from '../../client/ApiTypes.js';

export async function getUserCommunities(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetUserCommunitiesParameters;

  const user = await User.findById(id);

  if (!user) {
    response.status(404).json({error: 'User not found'});
    return;
  }

  const communityMemberships = await CommunityMembership.find({
    user: user._id,
  }).populate([
    {
      path: 'community',
      select: '_id name avatar',
    },
  ]);

  const communities = communityMemberships.map(({role, community}) => {
    if (!isDocument(community)) {
      throw new Error('Community is not a document');
    }

    return {
      ...community.toJSON(),
      role,
    };
  });

  response.json(communities satisfies GetUserCommunitiesResponse);
}
