import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface login_tokenAttributes {
  date_created?: Date;
  expires_at?: Date;
  id: string;
  scope: string;
  token?: string;
  user?: string;
  user_created?: string;
}

export type login_tokenPk = "id";
export type login_tokenId = login_token[login_tokenPk];
export type login_tokenOptionalAttributes = "date_created" | "expires_at" | "scope" | "token" | "user" | "user_created";
export type login_tokenCreationAttributes = Optional<login_tokenAttributes, login_tokenOptionalAttributes>;

export class login_token extends Model<login_tokenAttributes, login_tokenCreationAttributes> implements login_tokenAttributes {
  date_created?: Date;
  expires_at?: Date;
  id!: string;
  scope!: string;
  token?: string;
  user?: string;
  user_created?: string;

  // login_token belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // login_token belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof login_token {
    return login_token.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    scope: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "login_token_token_unique"
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
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
    tableName: 'login_token',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "login_token_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "login_token_token_unique",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}
