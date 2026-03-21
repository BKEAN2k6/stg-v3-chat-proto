import {type Request, type Response} from 'express';
import {type SignOptions} from 'jsonwebtoken';
import {type StrategyCreatedStatic} from 'passport';
import {generateToken, decodeToken} from './token';
import sendConfirmNewEmail from './emails/sendConfirmNewEmail';

type VerifyCallback = (
  payload: any,
  verifyCallback: (error?: Error | undefined, user?: any, info?: any) => void,
  request: Request,
) => void;

type Options = {
  secret: string;
  callbackUrl: string;
  confirmNewEmaiCallbacklUrl: string;
  jwtOptions?: SignOptions;
  sendMagicLink: (
    destination: string,
    href: string,
    verificationCode: string,
    request: Request,
  ) => Promise<void>;
  verify: VerifyCallback;

  /** @deprecated */
  confirmUrl?: string;
};

class MagicLoginStrategy {
  name = 'magiclogin';

  constructor(private readonly _options: Options) {}

  authenticate(
    this: StrategyCreatedStatic & MagicLoginStrategy,
    request: Request,
  ): void {
    // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
    const self = this;

    let payload = null;

    try {
      payload = decodeToken(
        self._options.secret,
        (request.query.token ?? request.body?.token) as string,
      );
    } catch (error) {
      const defaultMessage = 'No valid token provided';
      const message = error instanceof Error ? error.message : defaultMessage;

      self.fail(message);
      return;
    }

    const verifyCallback = function (
      error?: Error | undefined,
      user?: any,
      info?: any,
    ) {
      if (error) {
        self.error(error);
        return;
      }

      if (!user) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        self.fail(info);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      self.success(user, info);
    };

    self._options.verify(payload, verifyCallback, request);
  }

  sendConfirmNewEmail = async (
    firstName: string,
    userId: string,
    destination: string,
  ): Promise<string> => {
    const {confirmNewEmaiCallbacklUrl} = this._options;
    const code = String(Math.floor(Math.random() * 90_000) + 10_000);
    const jwt = generateToken(
      this._options.secret,
      {
        userId,
        destination,
        code,
      },
      this._options.jwtOptions,
    );
    const href = `${confirmNewEmaiCallbacklUrl}?token=${jwt}`;

    await sendConfirmNewEmail(firstName, destination, href);

    return code;
  };

  decodeToken = (token: string): any => {
    return decodeToken(this._options.secret, token);
  };

  send = (request: Request, response: Response): void => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const payload = request.method === 'GET' ? request.query : request.body;
    if (
      request.method !== 'POST' ||
      !request.headers['content-type']?.match('application/json')
    ) {
      response
        .status(400)
        .send(
          'Content-Type must be application/json and used with POST method.',
        );
      return;
    }

    if (!payload.destination) {
      response.status(400).send('Please specify the destination.');
      return;
    }

    const code = String(Math.floor(Math.random() * 90_000) + 10_000);
    const jwt = generateToken(
      this._options.secret,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      {
        ...payload,
        code,
      },
      this._options.jwtOptions,
    );

    this._options
      .sendMagicLink(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        payload.destination,
        `${this._options.callbackUrl}?token=${jwt}`,
        code,
        request,
      )
      .then(() => {
        response.json({success: true, code});
      })
      .catch((error: any) => {
        request.logger.log(error);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        response.json({success: false, error});
      });
  };
}

export default MagicLoginStrategy;
