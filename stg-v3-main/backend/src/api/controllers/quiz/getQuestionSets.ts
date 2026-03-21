import {type Request, type Response} from 'express';
import {type GetQuestionSetsResponse} from '../../client/ApiTypes.js';
import {QuizQuestionSet} from '../../../models/index.js';

export async function getQuestionSets(
  request: Request,
  response: Response,
): Promise<void> {
  const questionSets = await QuizQuestionSet.find().select('_id title');

  response.status(200).json(
    questionSets.map(({title, _id}) => {
      const englishTitle = title.find((title) => title.language === 'en');

      return {
        id: _id.toJSON(),
        title: englishTitle?.text ?? '',
      };
    }) satisfies GetQuestionSetsResponse,
  );
}
