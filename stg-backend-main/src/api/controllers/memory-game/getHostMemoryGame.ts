import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models';
import {
  type GetHostMemoryGameParameters,
  type GetHostMemoryGameResponse,
} from '../../client/ApiTypes';

export async function getHostMemoryGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetHostMemoryGameParameters;

  const memoryGame = await MemoryGame.findById(id);
  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame not found'});
    return;
  }

  response.json(
    memoryGame.toJSON({virtuals: true}) satisfies GetHostMemoryGameResponse,
  );
}
