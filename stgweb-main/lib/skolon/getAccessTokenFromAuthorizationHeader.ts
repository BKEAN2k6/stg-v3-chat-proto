export const getAccessTokenFromAuthorizationHeader = (
  authorizationHeader: string | undefined,
) => {
  if (!authorizationHeader) {
    return null;
  }

  const [type, token] = authorizationHeader.split(' ');

  if (type !== 'Bearer') {
    return null;
  }

  return token;
};
