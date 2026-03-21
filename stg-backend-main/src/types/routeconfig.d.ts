import {type Request, type Response, type NextFunction} from 'express';

type UserRole =
  | 'authenticated'
  | 'post-owner'
  | 'comment-owner'
  | 'reaction-owner'
  | 'community-member'
  | 'community-admin'
  | 'public'
  | 'super-admin';

type UserRoles = UserRole[];

type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

type Schema = {
  $ref?: string;
  definitions?: Record<string, Schema>;
  allOf?: readonly Schema[];
  oneOf?: readonly Schema[];
  type?: readonly string;
  format?: readonly string;
  properties?: readonly Record<string, Schema>;
  required?: readonly string[];
  items?: readonly Schema | Schema[];
  enum?: readonly string[] | number[];
  discriminator?: {
    propertyName: string;
  };
  const?: string | number;
  additionalProperties?: boolean;
  maxItems?: number;
  maxLength?: number;
};

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

type RouteConfig = {
  controller: AsyncRequestHandler;
  noAuthRedirect?: boolean;
  query?: Schema;
  access: UserRoles;
  request?: Schema;
  response?: Schema;
};

type MethodConfig = {
  [key in Method]?: RouteConfig;
};

type EventType = 'create' | 'update' | 'patch' | 'delete';

type EventConfig = {
  access: UserRoles;
  path: string;
  name: string;
  events: {
    [key in EventType]?: Schema;
  };
};

type RouteConfigs = Record<string, MethodConfig>;

export type {
  UserRoles,
  Schema,
  Method,
  RouteConfig,
  RouteConfigs,
  MethodConfig,
  EventType,
  EventConfig,
};
