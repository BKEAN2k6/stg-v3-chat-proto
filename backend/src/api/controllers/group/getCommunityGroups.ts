import {type Request, type Response} from 'express';
import {isDocument} from '@typegoose/typegoose';
import {Community, Group} from '../../../models/index.js';
import {
  type GetCommunityGroupsParameters,
  type GetCommunityGroupsResponse,
} from '../../client/ApiTypes.js';

export async function getCommunityGroups(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetCommunityGroupsParameters;

  const community = await Community.findById(id);
  if (!community) {
    response.status(404).json({error: 'Community not found'});
    return;
  }

  const groups = await Group.find({community: id}).populate([
    {
      path: 'owner',
      select: '_id firstName lastName avatar',
    },
  ]);

  response.json(
    groups.map((group) => {
      if (!isDocument(group.owner)) {
        throw new Error('Owner is not populated');
      }

      return {
        ...group.toJSON(),
        owner: {
          ...group.owner.toJSON(),
        },
        articleProgress: group.articleProgress.map((p) => ({
          article: p.article._id.toString(),
          completionDate: p.completionDate.toJSON(),
        })),
      };
    }) satisfies GetCommunityGroupsResponse,
  );
}
