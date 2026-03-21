import {Ajv, type ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';
import {Path} from 'path-parser';
import {AggregateAjvError} from '@segment/ajv-human-errors';
import type RolesResolver from '../middleware/roles/index.js';
import type {EventConfig, EventType, UserRoles} from '../types/routeconfig.js';
import type {Logger} from '../types/logger.js';

const ajv = new Ajv({removeAdditional: 'all', discriminator: true});
addFormats.default(ajv);

type SocketManagerSocket = {
  on: (
    event: 'join' | 'leave' | 'disconnect',
    listener: (room: string) => void,
  ) => void;
  request: {
    user?: {id: string; roles: string[]};
    headers: Record<string, string>;
    connection?: {remoteAddress?: string};
    originalUrl?: string;
    url?: string;
  };
  join: (room: string) => Promise<void>;
  leave: (room: string) => Promise<void>;
};

type SocketManagerServer = {
  on: (
    event: 'connection' | 'error',
    listener: (socket: SocketManagerSocket) => void,
  ) => void;
  to: (room: string) => {emit: (eventName: string, data: any) => void};
};

export class SocketManager {
  private readonly configs: Array<{
    access: UserRoles;
    name: string;
    path: Path;
    events: Partial<Record<EventType, ValidateFunction>>;
  }>;

  constructor(
    readonly logger: Logger,
    readonly rolesResolver: RolesResolver,
    readonly io: SocketManagerServer,
    eventConfigs: EventConfig[],
  ) {
    this.configs = eventConfigs.map((config) => {
      const events: Partial<Record<EventType, ValidateFunction>> = {};
      for (const [event, schema] of Object.entries(config.events)) {
        if (schema) {
          events[event as EventType] = ajv.compile(schema);
        }
      }

      return {...config, path: new Path(config.path), events};
    });
  }

  logSocketEvent({
    socket,
    event,
    room,
    status,
    error,
  }: {
    socket: SocketManagerSocket;
    event: string;
    room: string;
    status: 'OK' | 'ERROR' | 'UNAUTHORIZED';
    error?: string;
  }): void {
    this.logger.log(
      JSON.stringify({
        ip: socket.request.connection?.remoteAddress ?? '-',
        user: socket.request.user?.id ?? '-',
        method: 'WS',
        uri: room,
        status,

        event,
        userAgent: socket.request.headers['user-agent'] ?? '-',
        error,
      }),
    );
  }

  async emit(room: string, event: EventType, data: any) {
    const eventConfig = this.configs.find((config) => config.path.test(room));
    const validator = eventConfig?.events[event];

    if (!validator) {
      throw new Error(
        `No room '${room}' and event '${event}' combination found`,
      );
    }

    // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment, unicorn/prefer-structured-clone
    const dataCopy = JSON.parse(JSON.stringify(data));
    const valid = validator(dataCopy);

    if (!valid) {
      const errors = new AggregateAjvError(validator.errors!);
      throw new Error(`Event data validation failed: ${errors.message}`);
    }

    this.io
      .to(room)
      .emit(
        `${event.charAt(0).toUpperCase() + event.slice(1)}${
          eventConfig.name
        }Event`,
        dataCopy,
      );
  }

  handleConnections(): void {
    this.io.on('connection', (socket) => {
      socket.on('join', (room: string) => {
        void this.handleJoin(socket, room);
      });

      socket.on('leave', (room: string) => {
        void socket.leave(room);
        this.logSocketEvent({socket, event: 'leave', room, status: 'OK'});
      });
    });

    this.io.on('error', (error) => {
      this.logger.log('WS: error', error);
    });
  }

  private async handleJoin(socket: SocketManagerSocket, room: string) {
    const user = socket.request.user as {id: string; roles: string[]};

    let id: string | undefined;
    const eventConfig = this.configs.find((config) => {
      const match = config.path.test(room);
      if (match?.id) {
        id = String(match.id);
      }

      return Boolean(match);
    });

    if (!eventConfig) {
      this.logSocketEvent({
        socket,
        event: 'join',
        room,
        status: 'ERROR',
        error: 'Room not found',
      });
      return;
    }

    const roles = await this.rolesResolver.getRoles(user, id);

    if (eventConfig.access.some((item: string) => roles.includes(item))) {
      void socket.join(room);
      this.logSocketEvent({socket, event: 'join', room, status: 'OK'});
    } else {
      this.logSocketEvent({
        socket,
        event: 'join',
        room,
        status: 'UNAUTHORIZED',
      });
    }
  }
}
