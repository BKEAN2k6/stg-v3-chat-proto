import {type Request, type Response} from 'express';
import {MemoryGame} from '../../../models/index.js';
import {
  type GetHostMemoryGameParameters,
  type GetHostMemoryGameResponse,
} from '../../client/ApiTypes.js';

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

  response.json({
    ...memoryGame.toJSON(),
    isCodeActive: memoryGame.codeActiveUntil > new Date(),
    cards: memoryGame.cards.map(({_id, strength}) => ({
      id: _id.toJSON(),
      strength,
    })),
    currentlyRevealedCards: memoryGame.currentlyRevealedCards.map((card) =>
      card.toJSON(),
    ),
    foundPairs: memoryGame.foundPairs.map((pair) => ({
      player: pair.player.toJSON(),
      card1: pair.card1.toJSON(),
      card2: pair.card2.toJSON(),
    })),
    players: memoryGame.players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    currentPlayer:
      memoryGame.currentPlayer?.toJSON() ?? memoryGame.players[0]?._id.toJSON(),
    updatedAt: memoryGame.updatedAt!.toJSON(),
  } satisfies GetHostMemoryGameResponse);
}
