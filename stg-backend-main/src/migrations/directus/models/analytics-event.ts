import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface analytics_eventAttributes {
  date_created?: Date;
  event?: string;
  id: string;
  metadata?: object;
  sessid?: string;
  user_created?: string;
}

export type analytics_eventPk = "id";
export type analytics_eventId = analytics_event[analytics_eventPk];
export type analytics_eventOptionalAttributes = "date_created" | "event" | "metadata" | "sessid" | "user_created";
export type analytics_eventCreationAttributes = Optional<analytics_eventAttributes, analytics_eventOptionalAttributes>;

export class analytics_event extends Model<analytics_eventAttributes, analytics_eventCreationAttributes> implements analytics_eventAttributes {
  date_created?: Date;
  event?: string;
  id!: string;
  metadata?: object;
  sessid?: string;
  user_created?: string;

  // analytics_event belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof analytics_event {
    return analytics_event.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    event: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sessid: {
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
    tableName: 'analytics_event',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "analytics_event_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
