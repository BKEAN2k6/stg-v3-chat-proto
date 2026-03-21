import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models';
import {
  type GetMemoryGameWithCodeParameters,
  type GetMemoryGameWithCodeResponse,
} from '../../client/ApiTypes';

export async function getMemoryGameWithCode(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.params as GetMemoryGameWithCodeParameters;

  const memoryGame = await MemoryGame.findOne({code});

  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame not found'});
    return;
  }

  const memoryGameId = memoryGame._id.toHexString();
  const memoryGames = request.session.memoryGames;

  if (
    memoryGames?.[memoryGameId] &&
    !memoryGame.players.some((player) =>
      player._id.equals(memoryGames[memoryGameId]?.memoryGamePlayerId),
    )
  ) {
    delete memoryGames[memoryGameId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  const isRegistered = Boolean(request.session.memoryGames?.[memoryGameId]);

  response.json({
    _id: memoryGameId,
    isRegistered,
  } satisfies GetMemoryGameWithCodeResponse);
}
