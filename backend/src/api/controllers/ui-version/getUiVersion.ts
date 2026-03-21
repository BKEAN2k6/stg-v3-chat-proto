import {type Request, type Response} from 'express';
import uiVersion from '../../../uiVersion.js';
import {type GetUiVersionResponse} from '../../client/ApiTypes.js';

export async function getUiVersion(
  request: Request,
  response: Response,
): Promise<void> {
  response.json(uiVersion satisfies GetUiVersionResponse);
}
