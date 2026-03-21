import {type Request, type Response} from 'express';
import {isDocumentArray} from '@typegoose/typegoose';
import {Community} from '../../../models';
import {
  type GetCommunityGroupsParameters,
  type GetCommunityGroupsResponse,
} from '../../client/ApiTypes';

export async function getCommunityGroups(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityGroupsParameters;

  const community = await Community.findById(id).populate([
    {
      path: 'groups',
      select: '_id name description',
    },
  ]);
  if (community && isDocumentArray(community.groups)) {
    response.json(
      community.groups.map((group) =>
        group.toJSON(),
      ) satisfies GetCommunityGroupsResponse,
    );
  } else {
    response.status(404).json({error: 'Community not found'});
  }
}
