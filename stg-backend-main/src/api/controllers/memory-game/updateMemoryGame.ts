import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models';
import {
  type UpdateMemoryGameRequest,
  type UpdateMemoryGameParameters,
  type UpdateMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '../../client/ApiTypes';

export async function updateMemoryGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as UpdateMemoryGameParameters;

  const memoryGame = await MemoryGame.findById(id);
  if (!memoryGame) {
    response.status(404).json({error: 'Sprint not found'});
    return;
  }

  const {isStarted, isEnded} = request.body as UpdateMemoryGameRequest;

  if (isStarted && !memoryGame.isStarted) {
    memoryGame.currentPlayer = memoryGame.players[0]._id;
  }

  memoryGame.isStarted = isStarted ? true : memoryGame.isStarted;
  memoryGame.isEnded = isEnded ? true : memoryGame.isEnded;

  await memoryGame.save();

  response.json(
    memoryGame.toJSON({virtuals: true}) satisfies UpdateMemoryGameResponse,
  );

  try {
    await request.events.emit(`/memory-games/${id}`, 'patch', {
      isStarted: memoryGame.isStarted,
      isEnded: memoryGame.isEnded,
      currentPlayer: memoryGame.currentPlayer?.toHexString(),
      cards: memoryGame.cards.map((card) => ({
        _id: card._id.toHexString(),
        strength: card.strength,
      })),
    } satisfies PatchMemoryGameEvent);
  } catch (error) {
    request.logger.log(error);
  }
}
