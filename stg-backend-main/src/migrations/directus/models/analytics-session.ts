import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface analytics_sessionAttributes {
  browser?: object;
  date_created?: Date;
  id: string;
  sessid?: string;
  user_created?: string;
}

export type analytics_sessionPk = "id";
export type analytics_sessionId = analytics_session[analytics_sessionPk];
export type analytics_sessionOptionalAttributes = "browser" | "date_created" | "sessid" | "user_created";
export type analytics_sessionCreationAttributes = Optional<analytics_sessionAttributes, analytics_sessionOptionalAttributes>;

export class analytics_session extends Model<analytics_sessionAttributes, analytics_sessionCreationAttributes> implements analytics_sessionAttributes {
  browser?: object;
  date_created?: Date;
  id!: string;
  sessid?: string;
  user_created?: string;

  // analytics_session belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof analytics_session {
    return analytics_session.init({
    browser: {
      type: DataTypes.JSON,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    sessid: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "analytics_session_sessid_unique"
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
    tableName: 'analytics_session',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "analytics_session_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "analytics_session_sessid_unique",
        unique: true,
        fields: [
          { name: "sessid" },
        ]
      },
    ]
  });
  }
}
