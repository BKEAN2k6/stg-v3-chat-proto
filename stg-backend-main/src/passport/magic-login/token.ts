import jwt, {type SignOptions} from 'jsonwebtoken';

type JwtPayload = {
  [key: string]: any;
  destination: string;
  code: string;
};

export const decodeToken = (secret: string, token?: string) => {
  if (typeof token !== 'string') throw new Error('No token provided');

  return jwt.verify(token, secret);
};

export const generateToken = (
  secret: string,
  payload: JwtPayload,
  // eslint-disable-next-line unicorn/no-object-as-default-parameter
  options: SignOptions = {expiresIn: '60min'},
) => jwt.sign(payload, secret, options);
