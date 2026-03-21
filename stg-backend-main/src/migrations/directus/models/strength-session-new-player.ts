import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { strength_session, strength_sessionId } from './strength-session';

export interface strength_session_new_playerAttributes {
  date_created?: Date;
  id: string;
  strength_session?: string;
  user?: string;
}

export type strength_session_new_playerPk = "id";
export type strength_session_new_playerId = strength_session_new_player[strength_session_new_playerPk];
export type strength_session_new_playerOptionalAttributes = "date_created" | "strength_session" | "user";
export type strength_session_new_playerCreationAttributes = Optional<strength_session_new_playerAttributes, strength_session_new_playerOptionalAttributes>;

export class strength_session_new_player extends Model<strength_session_new_playerAttributes, strength_session_new_playerCreationAttributes> implements strength_session_new_playerAttributes {
  date_created?: Date;
  id!: string;
  strength_session?: string;
  user?: string;

  // strength_session_new_player belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength_session_new_player belongsTo strength_session via strength_session
  strength_session_strength_session!: strength_session;
  getStrength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setStrength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createStrength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_session_new_player {
    return strength_session_new_player.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    strength_session: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session',
        key: 'id'
      }
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strength_session_new_player',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_session_new_player_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
