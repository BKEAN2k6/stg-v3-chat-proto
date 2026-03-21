import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { strength, strengthId } from './strength';
import type { strength_session, strength_sessionId } from './strength-session';
import type { strength_session_new_strength, strength_session_new_strengthId } from './strength-session-new-strength';

export interface strength_session_strengthAttributes {
  date_created?: Date;
  id: string;
  is_bonus?: boolean;
  is_for_group?: boolean;
  is_for_self?: boolean;
  strength?: string;
  strength_session?: string;
  user?: string;
  user_created?: string;
}

export type strength_session_strengthPk = "id";
export type strength_session_strengthId = strength_session_strength[strength_session_strengthPk];
export type strength_session_strengthOptionalAttributes = "date_created" | "is_bonus" | "is_for_group" | "is_for_self" | "strength" | "strength_session" | "user" | "user_created";
export type strength_session_strengthCreationAttributes = Optional<strength_session_strengthAttributes, strength_session_strengthOptionalAttributes>;

export class strength_session_strength extends Model<strength_session_strengthAttributes, strength_session_strengthCreationAttributes> implements strength_session_strengthAttributes {
  date_created?: Date;
  id!: string;
  is_bonus?: boolean;
  is_for_group?: boolean;
  is_for_self?: boolean;
  strength?: string;
  strength_session?: string;
  user?: string;
  user_created?: string;

  // strength_session_strength belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength_session_strength belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength_session_strength belongsTo strength via strength
  strength_strength!: strength;
  getStrength_strength!: Sequelize.BelongsToGetAssociationMixin<strength>;
  setStrength_strength!: Sequelize.BelongsToSetAssociationMixin<strength, strengthId>;
  createStrength_strength!: Sequelize.BelongsToCreateAssociationMixin<strength>;
  // strength_session_strength belongsTo strength_session via strength_session
  strength_session_strength_session!: strength_session;
  getStrength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setStrength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createStrength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;
  // strength_session_strength hasMany strength_session_new_strength via strength_session_strength
  strength_session_new_strengths!: strength_session_new_strength[];
  getStrength_session_new_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_new_strength>;
  setStrength_session_new_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  addStrength_session_new_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  addStrength_session_new_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  createStrength_session_new_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_new_strength>;
  removeStrength_session_new_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  removeStrength_session_new_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  hasStrength_session_new_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  hasStrength_session_new_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  countStrength_session_new_strengths!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_session_strength {
    return strength_session_strength.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    is_bonus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_for_group: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    is_for_self: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    strength: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength',
        key: 'id'
      }
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
    tableName: 'strength_session_strength',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_session_strength_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
