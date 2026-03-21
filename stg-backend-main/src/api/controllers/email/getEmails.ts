import {type Request, type Response} from 'express';
import {User} from '../../../models';
import {type GetEmailsResponse} from '../../client/ApiTypes';

export async function getEmails(
  request: Request,
  response: Response,
): Promise<void> {
  const users = await User.find({}).select('email language');
  const emailsByLanguage: Record<'en' | 'fi' | 'sv', string[]> = {
    en: [],
    fi: [],
    sv: [],
  };

  for (const user of users) {
    emailsByLanguage[user.language].push(user.email);
  }

  response.json(emailsByLanguage satisfies GetEmailsResponse);
}
