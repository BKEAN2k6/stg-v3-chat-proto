import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { strengths_valley_level_t9n, strengths_valley_level_t9nId } from './strengths-valley-level-t-9-n';
import type { strengths_valley_round, strengths_valley_roundId } from './strengths-valley-round';
import type { strengths_valley_slide, strengths_valley_slideId } from './strengths-valley-slide';

export interface strengths_valley_levelAttributes {
  coordinates?: object;
  id: string;
  slug: string;
  sort?: number;
  strengths_valley_round?: string;
}

export type strengths_valley_levelPk = "id";
export type strengths_valley_levelId = strengths_valley_level[strengths_valley_levelPk];
export type strengths_valley_levelOptionalAttributes = "coordinates" | "slug" | "sort" | "strengths_valley_round";
export type strengths_valley_levelCreationAttributes = Optional<strengths_valley_levelAttributes, strengths_valley_levelOptionalAttributes>;

export class strengths_valley_level extends Model<strengths_valley_levelAttributes, strengths_valley_levelCreationAttributes> implements strengths_valley_levelAttributes {
  coordinates?: object;
  id!: string;
  slug!: string;
  sort?: number;
  strengths_valley_round?: string;

  // strengths_valley_level hasMany strengths_valley_level_t9n via strengths_valley_level
  strengths_valley_level_t9ns!: strengths_valley_level_t9n[];
  getStrengths_valley_level_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_level_t9n>;
  setStrengths_valley_level_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  addStrengths_valley_level_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  addStrengths_valley_level_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  createStrengths_valley_level_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_level_t9n>;
  removeStrengths_valley_level_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  removeStrengths_valley_level_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  hasStrengths_valley_level_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  hasStrengths_valley_level_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  countStrengths_valley_level_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_level hasMany strengths_valley_slide via strengths_valley_level
  strengths_valley_slides!: strengths_valley_slide[];
  getStrengths_valley_slides!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide>;
  setStrengths_valley_slides!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_slide!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_slides!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  createStrengths_valley_slide!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide>;
  removeStrengths_valley_slide!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  removeStrengths_valley_slides!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_slide!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_slides!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  countStrengths_valley_slides!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_level belongsTo strengths_valley_round via strengths_valley_round
  strengths_valley_round_strengths_valley_round!: strengths_valley_round;
  getStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_round>;
  setStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  createStrengths_valley_round_strengths_valley_round!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_round>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_level {
    return strengths_valley_level.init({
    coordinates: {
      type: DataTypes.JSON,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      unique: "strengths_valley_level_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    strengths_valley_round: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_round',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_level',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_level_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strengths_valley_level_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
