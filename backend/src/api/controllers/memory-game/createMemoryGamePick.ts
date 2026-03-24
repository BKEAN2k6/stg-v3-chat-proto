import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models/index.js';
import {
  type CreateMemoryGamePickParameters,
  type CreateMemoryGamePickRequest,
  type PatchMemoryGameEvent,
} from '../../client/ApiTypes.js';

/**
 * Validate game exists in session
 */
function validateGameInSession(
  groupGamesId: string | undefined,
  response: Response,
): boolean {
  if (!groupGamesId) {
    response.status(404).json({error: 'MemoryGame not found from session'});
    return false;
  }

  return true;
}

/**
 * Validate player exists in game
 */
function validatePlayerExists(
  player: unknown,
  id: string,
  request: Request,
  response: Response,
): boolean {
  if (!player) {
    delete request.session.groupGames?.[id];
    response.status(404).json({error: 'Player not found'});
    return false;
  }

  return true;
}

/**
 * Validate it's player's turn
 */
function validatePlayerTurn(
  currentPlayer: any,
  player: any,
  response: Response,
): boolean {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (!currentPlayer?.equals?.(player?._id)) {
    response.status(400).json({error: 'Not your turn'});
    return false;
  }

  return true;
}

/**
 * Validate card pick is valid
 */
function validateCardPick(
  revealedCount: number,
  revealedCards: mongoose.Types.ObjectId[],
  cardId: string,
  response: Response,
): boolean {
  if (revealedCount >= 2) {
    response.status(400).json({error: 'Cannot pick more than 2 cards'});
    return false;
  }

  if (
    revealedCount === 1 &&
    revealedCards[0].equals(new mongoose.Types.ObjectId(cardId))
  ) {
    response.status(400).json({error: 'Cannot pick the same card twice'});
    return false;
  }

  return true;
}

export async function createMemoryGamePick(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateMemoryGamePickParameters;
  const {cardId} = request.body as CreateMemoryGamePickRequest;

  if (!validateGameInSession(request.session.groupGames?.[id], response)) {
    return;
  }

  const memeoryGamePlayerId = request.session.groupGames![id].playerId;
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

  if (!validatePlayerExists(player, id, request, response)) {
    return;
  }

  // If there is no current player, set it to the first player
  memoryGame.currentPlayer ??= memoryGame.players[0]._id;

  if (!validatePlayerTurn(memoryGame.currentPlayer, player, response)) {
    return;
  }

  if (
    !validateCardPick(
      memoryGame.currentlyRevealedCards.length,
      memoryGame.currentlyRevealedCards,
      cardId,
      response,
    )
  ) {
    return;
  }

  memoryGame.currentlyRevealedCards.push(new mongoose.Types.ObjectId(cardId));

  let foundPair = false;

  if (memoryGame.currentlyRevealedCards.length === 2) {
    const [firstCardId, secondCardId] = memoryGame.currentlyRevealedCards;
    const firstCard = memoryGame.cards.find((card) =>
      card._id.equals(firstCardId),
    );
    const secondCard = memoryGame.cards.find((card) =>
      card._id.equals(secondCardId),
    );

    foundPair = firstCard?.strength === secondCard?.strength;

    if (foundPair) {
      memoryGame.foundPairs.push({
        player: player._id,
        card1: firstCardId,
        card2: secondCardId,
      });
    } else {
      memoryGame.currentPlayer =
        memoryGame.players[(playerIndex + 1) % memoryGame.players.length]._id;
    }
  }

  memoryGame.isEnded =
    memoryGame.foundPairs.length === memoryGame.cards.length / 2;

  const currentlyRevealedCards = memoryGame.currentlyRevealedCards.map((card) =>
    card.toJSON(),
  );

  if (currentlyRevealedCards.length === 2) {
    memoryGame.currentlyRevealedCards = [];
  }

  await memoryGame.save();

  response.sendStatus(204);

  try {
    await request.events.emit(`/memory-games/${id}`, 'patch', {
      currentlyRevealedCards,
      foundPairs: memoryGame.foundPairs.map((pair) => ({
        player: pair.player.toJSON(),
        card1: pair.card1.toJSON(),
        card2: pair.card2.toJSON(),
      })),
      currentPlayer: memoryGame.currentPlayer?.toJSON(),
      isEnded: memoryGame.isEnded,
      updatedAt: memoryGame.updatedAt!.toJSON(),
      players: memoryGame.players.map(({_id, nickname, color, avatar}) => ({
        id: _id.toJSON(),
        nickname,
        color,
        avatar,
      })),
    } satisfies PatchMemoryGameEvent);

    if (currentlyRevealedCards.length === 2) {
      setTimeout(
        async () => {
          try {
            await request.events.emit(`/memory-games/${id}`, 'patch', {
              currentPlayer:
                memoryGame.currentPlayer?.toJSON() ??
                memoryGame.players[0]._id.toJSON(),
              currentlyRevealedCards: [],
              isEnded: memoryGame.isEnded,
              updatedAt: memoryGame.updatedAt!.toJSON(),
              players: memoryGame.players.map(
                ({_id, nickname, color, avatar}) => ({
                  id: _id.toJSON(),
                  nickname,
                  color,
                  avatar,
                }),
              ),
              foundPairs: memoryGame.foundPairs.map((pair) => ({
                player: pair.player.toJSON(),
                card1: pair.card1.toJSON(),
                card2: pair.card2.toJSON(),
              })),
            } satisfies PatchMemoryGameEvent);
          } catch (error) {
            request.error = error;
          }
        },
        foundPair && !memoryGame.isEnded ? 0 : 3000,
      );
    }
  } catch (error) {
    request.error = error;
  }
}
