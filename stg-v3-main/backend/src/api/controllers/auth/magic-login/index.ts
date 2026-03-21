import process from 'node:process';
import jwt from 'jsonwebtoken';
import type {StringValue} from 'ms';
import {type LanguageCode} from '../../../client/ApiTypes.js';
import sendConfirmNewEmailEmail from './emails/sendConfirmNewEmailEmail.js';
import sendResetPasswordEmail from './emails/sendResetPasswordEmail.js';
import sendSingleSignOnEmail from './emails/sendSingleSignOnEmail.js';
import sendWelcomeToCreatedUserEmail from './emails/sendWelcomeToCreatedUserEmail.js';
import sendWelcomeToNewUserEmail from './emails/sendWelcomeToNewUserEmail.js';

const secret = process.env.MAGIC_LINK_SECRET;
const callbackUrl = '/auth-callback';
const confirmNewEmaiCallbacklUrl = '/confirm-email';

type JwtPayload = {
  email: string;
  code: string;
  resetPassword?: boolean;
  userId?: string;
  firstName?: string;
  lastName?: string;
  language?: string;
  country?: string;
  organization?: string;
  organizationType?: string;
  organizationRole?: string;
};

export async function sendConfirmNewEmail({
  firstName,
  userId,
  email,
}: {
  firstName: string;
  userId: string;
  email: string;
}): Promise<string> {
  const code = String(Math.floor(Math.random() * 90_000) + 10_000);
  const jwtToken = generateToken(secret, {
    userId,
    email,
    code,
  });
  const href = `${confirmNewEmaiCallbacklUrl}?token=${jwtToken}`;

  await sendConfirmNewEmailEmail(firstName, email, href);

  return code;
}

export async function sendSingleSignOn({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}): Promise<string> {
  const code = String(Math.floor(Math.random() * 90_000) + 10_000);
  const jwtToken = generateToken(secret, {
    email,
    code,
  });

  const href = `${callbackUrl}?token=${jwtToken}`;

  await sendSingleSignOnEmail(firstName, email, href);

  return code;
}

export async function sendResetPassword({
  email,
  firstName,
}: {
  email: string;
  firstName: string;
}): Promise<string> {
  const code = String(Math.floor(Math.random() * 90_000) + 10_000);
  const jwtToken = generateToken(secret, {
    email,
    resetPassword: true,
    code,
  });

  const href = `${callbackUrl}?token=${jwtToken}`;

  await sendResetPasswordEmail(firstName, email, href);

  return code;
}

export async function sendWelcomeToCreatedUser({
  firstName,
  email,
  communityName,
}: {
  firstName: string;
  email: string;
  communityName: string;
}): Promise<string> {
  const code = String(Math.floor(Math.random() * 90_000) + 10_000);

  const jwtToken = generateToken(
    secret,
    {
      email,
      code,
      resetPassword: true,
    },
    '14 days',
  );

  const href = `${callbackUrl}?token=${jwtToken}`;

  await sendWelcomeToCreatedUserEmail(firstName, email, communityName, href);

  return code;
}

export async function sendWelcomeToNewUser({
  firstName,
  lastName,
  language,
  email,
  country,
  organization,
  organizationType,
  organizationRole,
}: {
  firstName: string;
  lastName: string;
  language: LanguageCode;
  email: string;
  country: string;
  organization: string;
  organizationType: string;
  organizationRole: string;
}): Promise<string> {
  const code = String(Math.floor(Math.random() * 90_000) + 10_000);
  const jwtToken = generateToken(
    secret,
    {
      email,
      code,
      firstName,
      lastName,
      language,
      country,
      organization,
      organizationType,
      organizationRole,
      resetPassword: true,
    },
    '14 days',
  );

  const href = `${callbackUrl}?token=${jwtToken}`;

  await sendWelcomeToNewUserEmail(firstName, email, href);

  return code;
}

export function decodeToken(token: string) {
  if (typeof token !== 'string') throw new Error('No token provided');

  return jwt.verify(token, secret);
}

export function generateToken(
  secret: string,
  payload: JwtPayload,
  expiresIn: StringValue = '60min',
) {
  return jwt.sign(payload, secret, {expiresIn});
}
