import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models/index.js';
import {
  type GetPlayerMemoryGameParameters,
  type GetPlayerMemoryGameResponse,
} from '../../client/ApiTypes.js';

export async function getPlayerMemoryGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPlayerMemoryGameParameters;

  if (!request.session.groupGames?.[id]) {
    response.status(404).json({error: 'Memory game not found from session'});
    return;
  }

  const memeoryGamePlayerId = request.session.groupGames[id].playerId;
  const userObjectId = new mongoose.Types.ObjectId(memeoryGamePlayerId);

  const memoryGame = await MemoryGame.findById(id);

  if (!memoryGame) {
    response.status(404).json({error: 'MemoryGame not found'});
    return;
  }

  const playerIndex = memoryGame.players.findIndex((player) =>
    player._id.equals(userObjectId),
  );
  const player = memoryGame.players[playerIndex];

  if (!player) {
    delete request.session.groupGames[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    response.status(404).json({error: 'Player not found'});
    return;
  }

  const {
    _id,
    isEnded,
    cards,
    currentPlayer,
    foundPairs,
    currentlyRevealedCards,
    players,
  } = memoryGame;

  response.json({
    id: _id.toJSON(),
    player: {
      id: player._id.toJSON(),
      nickname: player.nickname,
      color: player.color,
      avatar: player.avatar,
    },
    cards: cards.map(({_id, strength}) => ({
      id: _id.toJSON(),
      strength,
    })),
    currentlyRevealedCards: currentlyRevealedCards.map((card) => card.toJSON()),
    foundPairs: foundPairs.map((pair) => ({
      player: pair.player.toJSON(),
      card1: pair.card1.toJSON(),
      card2: pair.card2.toJSON(),
    })),
    players: players.map(({_id, nickname, color, avatar}) => ({
      id: _id.toJSON(),
      nickname,
      color,
      avatar,
    })),
    currentPlayer: currentPlayer?.toJSON() ?? players[0]?._id.toJSON(),
    isEnded,
    updatedAt: memoryGame.updatedAt!.toJSON(),
  } satisfies GetPlayerMemoryGameResponse);
}
