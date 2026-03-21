import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { strengths_valley_level, strengths_valley_levelId } from './strengths-valley-level';
import type { strengths_valley_round, strengths_valley_roundId } from './strengths-valley-round';
import type { strengths_valley_slide_t9n, strengths_valley_slide_t9nId } from './strengths-valley-slide-t-9-n';

export interface strengths_valley_slideAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  layout?: string;
  slug: string;
  sort?: number;
  strengths_valley_level?: string;
  strengths_valley_round?: string;
  strengths_valley_round_end?: string;
  strengths_valley_round_start?: string;
  user_created?: string;
  user_updated?: string;
}

export type strengths_valley_slidePk = "id";
export type strengths_valley_slideId = strengths_valley_slide[strengths_valley_slidePk];
export type strengths_valley_slideOptionalAttributes = "date_created" | "date_updated" | "layout" | "slug" | "sort" | "strengths_valley_level" | "strengths_valley_round" | "strengths_valley_round_end" | "strengths_valley_round_start" | "user_created" | "user_updated";
export type strengths_valley_slideCreationAttributes = Optional<strengths_valley_slideAttributes, strengths_valley_slideOptionalAttributes>;

export class strengths_valley_slide extends Model<strengths_valley_slideAttributes, strengths_valley_slideCreationAttributes> implements strengths_valley_slideAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  layout?: string;
  slug!: string;
  sort?: number;
  strengths_valley_level?: string;
  strengths_valley_round?: string;
  strengths_valley_round_end?: string;
  strengths_valley_round_start?: string;
  user_created?: string;
  user_updated?: string;

  // strengths_valley_slide belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strengths_valley_slide belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strengths_valley_slide belongsTo strengths_valley_level via strengths_valley_level
  strengths_valley_level_strengths_valley_level!: strengths_valley_level;
  getStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_level>;
  setStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_level, strengths_valley_levelId>;
  createStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_level>;
  // strengths_valley_slide belongsTo strengths_valley_round via strengths_valley_round_end
  strengths_valley_round_end_strengths_valley_round!: strengths_valley_round;
  getStrengths_valley_round_end_strengths_valley_round!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_round>;
  setStrengths_valley_round_end_strengths_valley_round!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  createStrengths_valley_round_end_strengths_valley_round!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_round>;
  // strengths_valley_slide belongsTo strengths_valley_round via strengths_valley_round
  strengths_valley_round_strengths_valley_round!: strengths_valley_round;
  getStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_round>;
  setStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  createStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_round>;
  // strengths_valley_slide belongsTo strengths_valley_round via strengths_valley_round_start
  strengths_valley_round_start_strengths_valley_round!: strengths_valley_round;
  getStrengths_valley_round_start_strengths_valley_round!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_round>;
  setStrengths_valley_round_start_strengths_valley_round!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  createStrengths_valley_round_start_strengths_valley_round!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_round>;
  // strengths_valley_slide hasMany strengths_valley_slide_t9n via strengths_valley_slide
  strengths_valley_slide_t9ns!: strengths_valley_slide_t9n[];
  getStrengths_valley_slide_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide_t9n>;
  setStrengths_valley_slide_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  addStrengths_valley_slide_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  addStrengths_valley_slide_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  createStrengths_valley_slide_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide_t9n>;
  removeStrengths_valley_slide_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  removeStrengths_valley_slide_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  hasStrengths_valley_slide_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  hasStrengths_valley_slide_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  countStrengths_valley_slide_t9ns!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_slide {
    return strengths_valley_slide.init({
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
    layout: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      unique: "strengths_valley_slide_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    strengths_valley_level: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_level',
        key: 'id'
      }
    },
    strengths_valley_round: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_round',
        key: 'id'
      }
    },
    strengths_valley_round_end: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_round',
        key: 'id'
      }
    },
    strengths_valley_round_start: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_round',
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
    tableName: 'strengths_valley_slide',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_slide_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strengths_valley_slide_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
