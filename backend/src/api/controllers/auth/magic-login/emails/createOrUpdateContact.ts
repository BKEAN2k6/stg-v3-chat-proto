import process from 'node:process';
import configureSidemail from 'sidemail';
import {type LanguageCode} from '../../../../client/ApiTypes.js';

const apiKey = process.env.SIDEMAIL_API_KEY;

export default async function createOrUpdateContact({
  id,
  firstName,
  lastName,
  email,
  language,
  createdAt,
}: {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
  language: LanguageCode;
  createdAt: Date;
}) {
  const sidemail = configureSidemail({apiKey});

  if (process.env.NODE_ENV === 'development') {
    return;
  }

  await sidemail.contacts.createOrUpdate({
    emailAddress: email,
    identifier: id,
    customProps: {
      firstName,
      lastName,
      language,
      createdAt: createdAt.toISOString(),
    },
  });
}
