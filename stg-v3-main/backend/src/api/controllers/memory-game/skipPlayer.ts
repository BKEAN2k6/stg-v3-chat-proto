import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models/index.js';
import {
  type SkipPlayerParameters,
  type PatchMemoryGameEvent,
} from '../../client/ApiTypes.js';

export async function skipPlayer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as SkipPlayerParameters;

  const memoryGame = await MemoryGame.findById(id);
  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame not found'});
    return;
  }

  const playerIndex = memoryGame.players.findIndex((player) =>
    player._id.equals(memoryGame.currentPlayer),
  );

  memoryGame.currentPlayer =
    memoryGame.players[(playerIndex + 1) % memoryGame.players.length]._id;
  memoryGame.currentlyRevealedCards = [];

  await memoryGame.save();

  await request.events.emit(`/memory-games/${id}`, 'patch', {
    currentPlayer: memoryGame.currentPlayer?.toJSON(),
    currentlyRevealedCards: [],
    isEnded: memoryGame.isEnded,
    updatedAt: memoryGame.updatedAt!.toJSON(),
    foundPairs: memoryGame.foundPairs.map(({player, card1, card2}) => ({
      player: player.toJSON(),
      card1: card1.toJSON(),
      card2: card2.toJSON(),
    })),
    players: memoryGame.players.map(({_id, color, nickname, avatar}) => ({
      id: _id.toJSON(),
      color,
      nickname,
      avatar,
    })),
  } satisfies PatchMemoryGameEvent);

  response.sendStatus(204);
}
