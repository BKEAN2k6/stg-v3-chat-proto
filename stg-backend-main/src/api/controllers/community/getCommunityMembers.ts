import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Community, CommunityMembership} from '../../../models';
import {
  type GetCommunityMembersParameters,
  type GetCommunityMembersResponse,
} from '../../client/ApiTypes';

export async function getCommunityMembers(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityMembersParameters;

  const community = await Community.findById(id);

  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const communityMemberships = await CommunityMembership.find({
    community: community._id,
  }).populate([
    {
      path: 'user',
      select: '_id firstName lastName email language avatar role',
    },
  ]);

  const members = communityMemberships.map(({role, user}) => {
    if (!isDocument(user)) {
      throw new Error('User is not a document');
    }

    const {_id, firstName, lastName, email, language, avatar} = user;
    return {
      _id: _id.toHexString(),
      firstName,
      lastName,
      avatar,
      email,
      language,
      role,
    };
  });

  response.json(members satisfies GetCommunityMembersResponse);
}
