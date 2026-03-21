import {isDocument} from '@typegoose/typegoose';
import {type Request, type Response} from 'express';
import {AiGuidanceLog} from '../../../models/index.js';

export async function getAiGuidanceLogById(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;

  const log = await AiGuidanceLog.findById(id)
    .populate('user', 'firstName lastName')
    .populate('group', 'name')
    .populate('community', 'name')
    .exec();

  if (!log) {
    response.status(404).json({error: 'Log not found'});
    return;
  }

  if (!isDocument(log.user)) {
    throw new Error('User not populated');
  }

  if (!isDocument(log.group)) {
    throw new Error('Group not populated');
  }

  if (!isDocument(log.community)) {
    throw new Error('Community not populated');
  }

  response.json({
    id: log._id.toJSON(),
    title: log.title,
    suggestionText: log.suggestionText,
    createdAt: log.createdAt!.toISOString(),
    prompt: log.prompt,
    response: log.response,
    user: {
      id: log.user._id.toJSON(),
      firstName: log.user.firstName,
      lastName: log.user.lastName,
    },
    group: {
      id: log.group._id.toJSON(),
      name: log.group.name,
    },
    community: {
      id: log.community._id.toJSON(),
      name: log.community.name,
    },
  });
}
