import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame} from '../../../models';
import {
  type CreateMemoryGamePickParameters,
  type CreateMemoryGamePickRequest,
  type PatchMemoryGameEvent,
} from '../../client/ApiTypes';

export async function createMemoryGamePick(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateMemoryGamePickParameters;
  const {cardId} = request.body as CreateMemoryGamePickRequest;

  if (!request.session.memoryGames?.[id]) {
    response.status(404).json({error: 'MemoryGame not found from session'});
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

  if (!memoryGame.currentPlayer?.equals(player._id)) {
    response.status(400).json({error: 'Not your turn'});
    return;
  }

  if (memoryGame.currentlyRevealedCards.length >= 2) {
    response.status(400).json({error: 'Cannot pick more than 2 cards'});
    return;
  }

  if (
    memoryGame.currentlyRevealedCards.length === 1 &&
    memoryGame.currentlyRevealedCards[0].equals(
      new mongoose.Types.ObjectId(cardId),
    )
  ) {
    response.status(400).json({error: 'Cannot pick the same card twice'});
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

  await memoryGame.save();

  response.sendStatus(204);

  try {
    await request.events.emit(`/memory-games/${id}`, 'patch', {
      currentPlayer: memoryGame.currentPlayer?.toHexString(),
      currentlyRevealedCards: memoryGame.currentlyRevealedCards.map((card) =>
        card.toHexString(),
      ),
      foundPairs: memoryGame.foundPairs.map((pair) => ({
        player: pair.player.toHexString(),
        card1: pair.card1.toHexString(),
        card2: pair.card2.toHexString(),
      })),
    } satisfies PatchMemoryGameEvent);

    if (memoryGame.currentlyRevealedCards.length === 2) {
      setTimeout(
        async () => {
          try {
            memoryGame.currentlyRevealedCards = [];
            await memoryGame.save();

            await request.events.emit(`/memory-games/${id}`, 'patch', {
              currentlyRevealedCards: [],
              isEnded: memoryGame.isEnded,
            } satisfies PatchMemoryGameEvent);
          } catch (error) {
            request.logger.log(error);
          }
        },
        foundPair && !memoryGame.isEnded ? 0 : 3000,
      );
    }
  } catch (error) {
    request.logger.log(error);
  }
}
