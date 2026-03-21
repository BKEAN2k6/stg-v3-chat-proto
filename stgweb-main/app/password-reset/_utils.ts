export async function checkLoginToken(directus: any, token: string) {
  let loginTokenQuery;
  try {
    loginTokenQuery = await directus.items('login_token').readByQuery({
      fields: ['id', 'expires_at', 'user.id', 'user.email'],
      filter: {
        token,
        scope: 'password-reset',
      },
    });
  } catch {
    throw new Error('failed-to-fetch-login-token');
  }

  if (!loginTokenQuery.data?.length || loginTokenQuery.data?.length > 1) {
    throw new Error('token-not-found');
  }

  const now = new Date();
  const loginToken = loginTokenQuery.data[0];

  const loginTokenExpiration = new Date(loginToken.expires_at);
  if (!loginToken.expires_at || now > loginTokenExpiration) {
    throw new Error('token-expired');
  }

  return loginToken;
}
