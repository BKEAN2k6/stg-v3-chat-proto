import {type Request, type Response} from 'express';
import {Parser} from '@json2csv/plainjs';
import {isDocument} from '@typegoose/typegoose';
import {User} from '../../../models/index.js';

const parser = new Parser({
  fields: [
    'firstName',
    'lastName',
    'email',
    'language',
    'country',
    'registrationType',
    'organization',
    'organizationType',
    'organizationRole',
    'createdAt',
    'community',
  ],
});

export async function getUsersListCsv(
  request: Request,
  response: Response,
): Promise<void> {
  const users = await User.find().sort({createdAt: -1}).populate({
    path: 'selectedCommunity',
    select: 'name',
  });

  const jsonUsers = users.map((user) => {
    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      language: user.language,
      country: user.country,
      registrationType: user.registrationType,
      organization: user.organization,
      organizationType: user.organizationType,
      organizationRole: user.organizationRole,
      createdAt: user.createdAt!.toISOString(),
      community:
        isDocument(user.selectedCommunity) && user.selectedCommunity.name
          ? user.selectedCommunity.name
          : 'Unknown',
    };
  });

  response.setHeader('Content-Type', 'text/csv');
  response.setHeader(
    'Content-Disposition',
    `attachment; filename="${new Date().toISOString()}_stg-v3-users.csv"`,
  );

  response.send(parser.parse(jsonUsers));
}
