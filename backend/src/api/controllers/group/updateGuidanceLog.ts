import {type Request, type Response} from 'express';
import {type UpdateGuidanceLogRequest} from '../../client/ApiTypes.js';
import {AiGuidanceLog} from '../../../models/index.js';

export async function updateGuidanceLog(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: groupId, logId} = request.params;
  const {action} = request.body as UpdateGuidanceLogRequest;

  // Build update object with only provided fields
  const update: Record<string, unknown> = {};
  if (action !== undefined) update.action = action;

  if (Object.keys(update).length === 0) {
    response.status(400).json({error: 'No update fields provided'});
    return;
  }

  const result = await AiGuidanceLog.findOneAndUpdate(
    {_id: logId, group: groupId},
    update,
    {new: true},
  );

  if (!result) {
    response.status(404).json({error: 'Log not found'});
    return;
  }

  response.sendStatus(204);
}
