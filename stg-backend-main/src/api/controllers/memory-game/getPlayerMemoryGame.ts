import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models';
import {type GetPlayerMemoryGameParameters} from '../../client/ApiTypes';

export async function getPlayerMemoryGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as GetPlayerMemoryGameParameters;

  if (!request.session.memoryGames?.[id]) {
    response.status(404).json({error: 'Memory game not found from session'});
    return;
  }

  const memeoryGamePlayerId =
    request.session.memoryGames[id].memoryGamePlayerId;
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
    delete request.session.memoryGames[id]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
    response.status(404).json({error: 'Player not found'});
    return;
  }

  const {
    _id,
    isStarted,
    isEnded,
    cards,
    currentPlayer,
    foundPairs,
    currentlyRevealedCards,
  } = memoryGame;

  const players = memoryGame.players.map((player) => {
    return {
      _id: player._id.toHexString(),
      nickname: player.nickname,
      color: player.color,
    };
  });

  response.json({
    _id: _id.toHexString(),
    player: {
      _id: player._id.toHexString(),
      nickname: player.nickname,
      color: player.color,
    },
    players,
    cards,
    currentlyRevealedCards,
    foundPairs,
    currentPlayer: currentPlayer?.toHexString(),
    isStarted,
    isEnded,
  });
}
