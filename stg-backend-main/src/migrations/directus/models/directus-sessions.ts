import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_shares, directus_sharesId } from './directus-shares';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_sessionsAttributes {
  token: string;
  user?: string;
  expires: Date;
  ip?: string;
  user_agent?: string;
  share?: string;
  origin?: string;
}

export type directus_sessionsPk = "token";
export type directus_sessionsId = directus_sessions[directus_sessionsPk];
export type directus_sessionsOptionalAttributes = "user" | "ip" | "user_agent" | "share" | "origin";
export type directus_sessionsCreationAttributes = Optional<directus_sessionsAttributes, directus_sessionsOptionalAttributes>;

export class directus_sessions extends Model<directus_sessionsAttributes, directus_sessionsCreationAttributes> implements directus_sessionsAttributes {
  token!: string;
  user?: string;
  expires!: Date;
  ip?: string;
  user_agent?: string;
  share?: string;
  origin?: string;

  // directus_sessions belongsTo directus_shares via share
  share_directus_share!: directus_shares;
  getShare_directus_share!: Sequelize.BelongsToGetAssociationMixin<directus_shares>;
  setShare_directus_share!: Sequelize.BelongsToSetAssociationMixin<directus_shares, directus_sharesId>;
  createShare_directus_share!: Sequelize.BelongsToCreateAssociationMixin<directus_shares>;
  // directus_sessions belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_sessions {
    return directus_sessions.init({
    token: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    share: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_shares',
        key: 'id'
      }
    },
    origin: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_sessions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_sessions_pkey",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}
