import {type Request, type Response, type NextFunction} from 'express';

type UserRole =
  | 'authenticated'
  | 'post-owner'
  | 'comment-owner'
  | 'reaction-owner'
  | 'community-member'
  | 'community-admin'
  | 'community-owner'
  | 'invited-user'
  | 'public'
  | 'super-admin';

type UserRoles = UserRole[];

type Method = 'get' | 'post' | 'put' | 'delete' | 'patch';

type Schema = {
  $ref?: string;
  definitions?: Record<string, Schema>;
  allOf?: readonly Schema[];
  oneOf?: readonly Schema[];
  anyOf?: readonly Schema[];
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
  minLength?: number;
  maxLength?: number;
  patternProperties?: Record<string, Schema>;
};

type AsyncRequestHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;

type StoreOperation =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'list'
  | 'bulkDelete'
  | 'updateSubresource';

type RouteConfig = {
  controller: AsyncRequestHandler;
  store?: {
    storeName: string;
    operation: StoreOperation;
    subresource?: string;
    entityTypeNameBase: string;
  };
  hookConfig?: {
    resourceName: string;
    queryType?: 'list' | 'detail';
    subResourceName?: string;
    keyParamName?: string;
    invalidateOnly?: boolean;
  };
  noAuthRedirect?: boolean;
  query?: Schema;
  access: UserRoles;
  request?: Schema;
  response?: Schema;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
};

type MethodConfig = Partial<Record<Method, RouteConfig>>;

type EventType = 'create' | 'update' | 'patch' | 'delete';

type EventConfig = {
  access: UserRoles;
  path: string;
  name: string;
  events: Partial<Record<EventType, Schema>>;
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
