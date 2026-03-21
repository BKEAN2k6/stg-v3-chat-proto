import {isObject} from '@/types/runtime';

/**
 * Fetches an access token from Skolon that can be used to call their API.
 * Expects the following environment variables to be set:
 * - SKOLON_CLIENT_ID
 * - SKOLON_SECRET
 * @returns an access token
 * @throws an error if the environment variables are not set
 * @throws an error if the response from Skolon is not valid
 */
export const fetchAccessToken = async (): Promise<AccessToken> => {
  const {SKOLON_CLIENT_ID: clientId, SKOLON_SECRET: secret} = process.env;

  if (!clientId || !secret) {
    throw new Error('Missing SKOLON_CLIENT_ID or SKOLON_SECRET');
  }

  const credentialsB64 = Buffer.from(`${clientId}:${secret}`).toString(
    'base64',
  );

  const basicAuthorization = `Basic ${credentialsB64}`;

  const response = await fetch('https://idp.skolon.com/oauth/access_token/', {
    method: 'POST',
    headers: {
      Authorization: basicAuthorization,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  const tokenResp = await response.json();

  if (!isAccessTokenResponse(tokenResp)) {
    throw new Error('Invalid response from Skolon');
  }

  return {
    token: tokenResp.access_token,
    expiresAt: new Date(Date.now() + tokenResp.expires_in * 1000).getTime(),
  };
};

export type AccessToken = {
  token: string;
  expiresAt: number;
};

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
};

const isAccessTokenResponse = (
  response: unknown,
): response is AccessTokenResponse =>
  isObject(response) &&
  typeof response.access_token === 'string' &&
  typeof response.expires_in === 'number';
