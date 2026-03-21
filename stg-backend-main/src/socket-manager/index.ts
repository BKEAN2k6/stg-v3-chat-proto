import Ajv, {type ValidateFunction} from 'ajv';
import addFormats from 'ajv-formats';
import {Path} from 'path-parser';
import type RolesResolver from '../middleware/roles/index';
import type {EventConfig, EventType, UserRoles} from '../types/routeconfig';
import type {Logger} from '../types/logger';

const ajv = new Ajv({removeAdditional: 'all', discriminator: true});
addFormats(ajv);

type SocketManagerSocket = {
  on: (
    event: 'join' | 'leave' | 'disconnect',
    listener: (room: string) => void,
  ) => void;
  request: {
    user?: {id: string; roles: string[]};
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
    events: {
      [key in EventType]?: ValidateFunction;
    };
  }>;

  constructor(
    readonly logger: Logger,
    readonly rolesResolver: RolesResolver,
    readonly io: SocketManagerServer,
    eventConfigs: EventConfig[],
  ) {
    this.configs = eventConfigs.map((config) => {
      const events: {
        [key in EventType]?: ValidateFunction;
      } = {};
      for (const [event, schema] of Object.entries(config.events)) {
        if (schema) {
          events[event as EventType] = ajv.compile(schema);
        }
      }

      return {...config, path: new Path(config.path), events};
    });
  }

  async emit(room: string, event: EventType, data: any) {
    const eventConfig = this.configs.find((config) => config.path.test(room));
    const validator = eventConfig?.events[event];

    if (!validator) {
      throw new Error(
        `No room '${room}' and event '${event}' combination found`,
      );
    }

    // eslint-disable-next-line  @typescript-eslint/no-unsafe-assignment
    const dataCopy = JSON.parse(JSON.stringify(data));
    const valid = validator(dataCopy);

    if (!valid) {
      this.logger.log(validator.errors);
      throw new Error('Event data validation failed');
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
      this.logger.log('WS: User connected');

      socket.on('join', (room: string) => {
        void this.handleJoin(socket, room);
      });

      socket.on('leave', (room: string) => {
        this.logger.log('WS: User leaving room', room);
        void socket.leave(room);
      });

      socket.on('disconnect', () => {
        this.logger.log('WS: User disconnected');
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
        return true;
      }

      return false;
    });

    if (!eventConfig || !id) {
      this.logger.log('WS: User tried to join invalid room', room);
      return;
    }

    const roles = await this.rolesResolver.getRoles(user, id);
    if (eventConfig.access.some((item: string) => roles.includes(item))) {
      void socket.join(room);
      this.logger.log('WS: User joined room', room);
    } else {
      this.logger.log('WS: User tried to join unauthorized room', room);
    }
  }
}
