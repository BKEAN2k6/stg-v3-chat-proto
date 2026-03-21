import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface websocket_eventAttributes {
  date_created?: Date;
  id: string;
  listener_value?: string;
  lookup_value?: string;
  type?: string;
  user_created?: string;
}

export type websocket_eventPk = "id";
export type websocket_eventId = websocket_event[websocket_eventPk];
export type websocket_eventOptionalAttributes = "date_created" | "listener_value" | "lookup_value" | "type" | "user_created";
export type websocket_eventCreationAttributes = Optional<websocket_eventAttributes, websocket_eventOptionalAttributes>;

export class websocket_event extends Model<websocket_eventAttributes, websocket_eventCreationAttributes> implements websocket_eventAttributes {
  date_created?: Date;
  id!: string;
  listener_value?: string;
  lookup_value?: string;
  type?: string;
  user_created?: string;

  // websocket_event belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof websocket_event {
    return websocket_event.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    listener_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    lookup_value: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    user_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'websocket_event',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "websocket_event_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
