import {isDocument} from '@typegoose/typegoose';
import {type Request, type Response} from 'express';
import {type GetAiGuidanceLogsQuery} from '../../client/ApiTypes.js';
import {AiGuidanceLog} from '../../../models/index.js';

export async function getAiGuidanceLogs(
  request: Request,
  response: Response,
): Promise<void> {
  const {
    communityId,
    groupId,
    skip = '0',
    limit = '50',
  } = request.query as GetAiGuidanceLogsQuery;

  const queryFilter: Record<string, unknown> = {};
  if (communityId && communityId !== 'undefined') {
    queryFilter.community = communityId;
  }

  if (groupId && groupId !== 'undefined') {
    queryFilter.group = groupId;
  }

  const skipNumber = Number.parseInt(skip, 10) || 0;
  const limitNumber = Math.min(Number.parseInt(limit, 10) || 50, 100);

  const [logs, total] = await Promise.all([
    AiGuidanceLog.find({...queryFilter})
      .sort({createdAt: -1})
      .skip(skipNumber)
      .limit(limitNumber)
      .populate('user', 'firstName lastName')
      .populate('group', 'name')
      .populate('community', 'name')
      .exec(),
    AiGuidanceLog.countDocuments({...queryFilter}).exec(),
  ]);

  const items = logs.map((log) => {
    if (!isDocument(log.user)) {
      throw new Error('User not populated');
    }

    if (!isDocument(log.group)) {
      throw new Error('Group not populated');
    }

    if (!isDocument(log.community)) {
      throw new Error('Community not populated');
    }

    return {
      id: log._id.toJSON(),
      title: log.title,
      suggestionText: log.suggestionText,
      createdAt: log.createdAt!.toISOString(),
      action: log.action,
      ageGroup: log.ageGroup,
      language: log.language,
      promptTokens: log.promptTokens,
      completionTokens: log.completionTokens,
      totalTokens: log.totalTokens,
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
    };
  });

  response.json({items, total, skip: skipNumber, limit: limitNumber});
}
