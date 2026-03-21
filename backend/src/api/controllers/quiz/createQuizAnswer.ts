import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {Quiz} from '../../../models/index.js';
import {
  type CreateQuizAnswerParameters,
  type CreateQuizAnswerRequest,
  type PatchHostQuizEvent,
} from '../../client/ApiTypes.js';

export async function createQuizAnswer(
  request: Request,
  response: Response,
): Promise<void> {
  const {id} = request.params as CreateQuizAnswerParameters;
  const {question, choices} = request.body as CreateQuizAnswerRequest;

  if (!request.session.groupGames?.[id]) {
    response.status(404).json({error: 'Quiz not found from session'});
    return;
  }

  const {playerId} = request.session.groupGames[id];
  let userObjectId: mongoose.Types.ObjectId;
  let questionId: mongoose.Types.ObjectId;
  try {
    userObjectId = new mongoose.Types.ObjectId(playerId);
    questionId = new mongoose.Types.ObjectId(question);
  } catch {
    response.status(400).json({error: 'Invalid player or question id'});
    return;
  }

  const choiceIds: mongoose.Types.ObjectId[] = Array.isArray(choices)
    ? choices.map((c) => new mongoose.Types.ObjectId(c))
    : [];

  const quiz = await Quiz.findById(id);
  if (!quiz) {
    response.status(404).json({error: 'Quiz not found'});
    return;
  }

  const playerIndex = quiz.players.findIndex((p) => p._id.equals(userObjectId));
  if (playerIndex === -1) {
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete request.session.groupGames[id];
    response.status(404).json({error: 'Player not found'});
    return;
  }

  await Quiz.updateOne({_id: quiz._id}, [
    {
      $set: {
        answers: {
          $filter: {
            input: '$answers',
            as: 'a',
            cond: {
              $not: {
                $and: [
                  {$eq: ['$$a.player', userObjectId]},
                  {$eq: ['$$a.question', questionId]},
                ],
              },
            },
          },
        },
      },
    },
    {
      $set: {
        answers: {
          $concatArrays: [
            '$answers',
            [
              {
                question: questionId,
                player: userObjectId,
                choices: choiceIds,
              },
            ],
          ],
        },
      },
    },
  ]);

  const exact = await Quiz.findById(quiz._id, {
    answers: {$elemMatch: {player: userObjectId, question: questionId}},
  });

  const answer = exact?.answers?.[0];
  if (!answer) {
    response.status(500).json({error: 'Answer not persisted'});
    return;
  }

  response.status(201).json({
    id: answer._id.toJSON(),
    question: answer.question.toJSON(),
    choices: Array.isArray(answer.choices)
      ? answer.choices.map((c) => c.toJSON())
      : [],
  });

  try {
    const fresh = await Quiz.findById(quiz._id).select(
      'answers players updatedAt',
    );
    if (fresh) {
      await request.events.emit(`/quizzes/${quiz._id.toJSON()}/host`, 'patch', {
        answers: (fresh.answers ?? []).map(({question, choices, player}) => ({
          question: question.toJSON(),
          choices: choices.map((c) => c.toJSON()),
          player: player.toJSON(),
        })),
        players: fresh.players.map((player) => ({
          id: player._id.toJSON(),
          nickname: player.nickname,
          color: player.color,
          avatar: player.avatar,
        })),
        updatedAt: fresh.updatedAt!.toJSON(),
      } satisfies PatchHostQuizEvent);
    }
  } catch (emitError) {
    request.error = emitError;
  }
}
