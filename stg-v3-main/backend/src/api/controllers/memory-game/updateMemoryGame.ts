import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models/index.js';
import {
  type UpdateMemoryGameRequest,
  type UpdateMemoryGameParameters,
  type UpdateMemoryGameResponse,
  type PatchMemoryGameEvent,
} from '../../client/ApiTypes.js';

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

  const {isEnded} = request.body as UpdateMemoryGameRequest;

  memoryGame.isEnded = isEnded ? true : memoryGame.isEnded;

  await memoryGame.save();

  await request.events.emit(`/memory-games/${id}`, 'patch', {
    isEnded: memoryGame.isEnded,
    currentPlayer:
      memoryGame.currentPlayer?.toJSON() ?? memoryGame.players[0]?._id.toJSON(),
    updatedAt: memoryGame.updatedAt!.toJSON(),
    currentlyRevealedCards: memoryGame.currentlyRevealedCards.map((card) =>
      card.toJSON(),
    ),
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

  response.json({
    ...memoryGame.toJSON(),
    cards: memoryGame.cards.map((card) => ({
      id: card._id.toJSON(),
      strength: card.strength,
    })),
    currentlyRevealedCards: memoryGame.currentlyRevealedCards.map((card) =>
      card.toJSON(),
    ),
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
    currentPlayer:
      memoryGame.currentPlayer?.toJSON() ?? memoryGame.players[0]?._id.toJSON(),
    isEnded: memoryGame.isEnded,
    updatedAt: memoryGame.updatedAt!.toJSON(),
  } satisfies UpdateMemoryGameResponse);
}
