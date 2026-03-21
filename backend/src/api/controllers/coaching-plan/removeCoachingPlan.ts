import type {Request, Response} from 'express';
import {CoachingPlan} from '../../../models/index.js';

export async function removeCoachingPlan(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params;
  await CoachingPlan.findByIdAndDelete(id);
  response.sendStatus(204);
}
