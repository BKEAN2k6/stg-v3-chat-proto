import {type Request, type Response} from 'express';
import {Quiz} from '../../../models/index.js';
import {
  type GetQuizWithCodeParameters,
  type GetQuizWithCodeResponse,
} from '../../client/ApiTypes.js';

export async function getQuizWithCode(
  request: Request,
  response: Response,
): Promise<void> {
  const {code} = request.params as GetQuizWithCodeParameters;

  const quiz = await Quiz.findOne({code});

  if (!quiz) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  const quizId = quiz._id.toJSON();
  const memoryGames = request.session.groupGames;

  if (
    memoryGames?.[quizId] &&
    !quiz.players.some((player) =>
      player._id.equals(memoryGames[quizId]?.playerId),
    )
  ) {
    delete memoryGames[quizId]; // eslint-disable-line @typescript-eslint/no-dynamic-delete
  }

  const isRegistered = Boolean(request.session.groupGames?.[quizId]);

  response.json({
    id: quizId,
    isRegistered,
  } satisfies GetQuizWithCodeResponse);
}
