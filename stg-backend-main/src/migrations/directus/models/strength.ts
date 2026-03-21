import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { strength_session_strength, strength_session_strengthId } from './strength-session-strength';
import type { strength_t9n, strength_t9nId } from './strength-t-9-n';
import type { swl_moment_to_strength, swl_moment_to_strengthId } from './swl-moment-to-strength';

export interface strengthAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  slug?: string;
  sort?: number;
  user_created?: string;
  user_updated?: string;
}

export type strengthPk = "id";
export type strengthId = strength[strengthPk];
export type strengthOptionalAttributes = "date_created" | "date_updated" | "slug" | "sort" | "user_created" | "user_updated";
export type strengthCreationAttributes = Optional<strengthAttributes, strengthOptionalAttributes>;

export class strength extends Model<strengthAttributes, strengthCreationAttributes> implements strengthAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  slug?: string;
  sort?: number;
  user_created?: string;
  user_updated?: string;

  // strength belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength hasMany strength_session_strength via strength
  strength_session_strengths!: strength_session_strength[];
  getStrength_session_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_strength>;
  setStrength_session_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  createStrength_session_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_strength>;
  removeStrength_session_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_strength, strength_session_strengthId>;
  removeStrength_session_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  countStrength_session_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // strength hasMany strength_t9n via strength
  strength_t9ns!: strength_t9n[];
  getStrength_t9ns!: Sequelize.HasManyGetAssociationsMixin<strength_t9n>;
  setStrength_t9ns!: Sequelize.HasManySetAssociationsMixin<strength_t9n, strength_t9nId>;
  addStrength_t9n!: Sequelize.HasManyAddAssociationMixin<strength_t9n, strength_t9nId>;
  addStrength_t9ns!: Sequelize.HasManyAddAssociationsMixin<strength_t9n, strength_t9nId>;
  createStrength_t9n!: Sequelize.HasManyCreateAssociationMixin<strength_t9n>;
  removeStrength_t9n!: Sequelize.HasManyRemoveAssociationMixin<strength_t9n, strength_t9nId>;
  removeStrength_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strength_t9n, strength_t9nId>;
  hasStrength_t9n!: Sequelize.HasManyHasAssociationMixin<strength_t9n, strength_t9nId>;
  hasStrength_t9ns!: Sequelize.HasManyHasAssociationsMixin<strength_t9n, strength_t9nId>;
  countStrength_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // strength hasMany swl_moment_to_strength via strength
  swl_moment_to_strengths!: swl_moment_to_strength[];
  getSwl_moment_to_strengths!: Sequelize.HasManyGetAssociationsMixin<swl_moment_to_strength>;
  setSwl_moment_to_strengths!: Sequelize.HasManySetAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  addSwl_moment_to_strength!: Sequelize.HasManyAddAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  addSwl_moment_to_strengths!: Sequelize.HasManyAddAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  createSwl_moment_to_strength!: Sequelize.HasManyCreateAssociationMixin<swl_moment_to_strength>;
  removeSwl_moment_to_strength!: Sequelize.HasManyRemoveAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  removeSwl_moment_to_strengths!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  hasSwl_moment_to_strength!: Sequelize.HasManyHasAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  hasSwl_moment_to_strengths!: Sequelize.HasManyHasAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  countSwl_moment_to_strengths!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength {
    return strength.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "strength_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    user_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    user_updated: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strength',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strength_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
