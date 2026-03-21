import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { strengths_valley_level, strengths_valley_levelId } from './strengths-valley-level';
import type { strengths_valley_round_t9n, strengths_valley_round_t9nId } from './strengths-valley-round-t-9-n';
import type { strengths_valley_slide, strengths_valley_slideId } from './strengths-valley-slide';
import type { strengths_valley_story, strengths_valley_storyId } from './strengths-valley-story';

export interface strengths_valley_roundAttributes {
  background?: string;
  id: string;
  slug: string;
  sort?: number;
  strengths_valley_story?: string;
}

export type strengths_valley_roundPk = "id";
export type strengths_valley_roundId = strengths_valley_round[strengths_valley_roundPk];
export type strengths_valley_roundOptionalAttributes = "background" | "slug" | "sort" | "strengths_valley_story";
export type strengths_valley_roundCreationAttributes = Optional<strengths_valley_roundAttributes, strengths_valley_roundOptionalAttributes>;

export class strengths_valley_round extends Model<strengths_valley_roundAttributes, strengths_valley_roundCreationAttributes> implements strengths_valley_roundAttributes {
  background?: string;
  id!: string;
  slug!: string;
  sort?: number;
  strengths_valley_story?: string;

  // strengths_valley_round belongsTo directus_files via background
  background_directus_file!: directus_files;
  getBackground_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setBackground_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createBackground_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // strengths_valley_round hasMany strengths_valley_level via strengths_valley_round
  strengths_valley_levels!: strengths_valley_level[];
  getStrengths_valley_levels!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_level>;
  setStrengths_valley_levels!: Sequelize.HasManySetAssociationsMixin<strengths_valley_level, strengths_valley_levelId>;
  addStrengths_valley_level!: Sequelize.HasManyAddAssociationMixin<strengths_valley_level, strengths_valley_levelId>;
  addStrengths_valley_levels!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_level, strengths_valley_levelId>;
  createStrengths_valley_level!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_level>;
  removeStrengths_valley_level!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_level, strengths_valley_levelId>;
  removeStrengths_valley_levels!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_level, strengths_valley_levelId>;
  hasStrengths_valley_level!: Sequelize.HasManyHasAssociationMixin<strengths_valley_level, strengths_valley_levelId>;
  hasStrengths_valley_levels!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_level, strengths_valley_levelId>;
  countStrengths_valley_levels!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_round hasMany strengths_valley_round_t9n via strengths_valley_round
  strengths_valley_round_t9ns!: strengths_valley_round_t9n[];
  getStrengths_valley_round_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_round_t9n>;
  setStrengths_valley_round_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  addStrengths_valley_round_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  addStrengths_valley_round_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  createStrengths_valley_round_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_round_t9n>;
  removeStrengths_valley_round_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  removeStrengths_valley_round_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  hasStrengths_valley_round_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  hasStrengths_valley_round_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  countStrengths_valley_round_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_round hasMany strengths_valley_slide via strengths_valley_round_end
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
  // strengths_valley_round hasMany strengths_valley_slide via strengths_valley_round
  strengths_valley_round_strengths_valley_slides!: strengths_valley_slide[];
  getStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide>;
  setStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_round_strengths_valley_slide!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  createStrengths_valley_round_strengths_valley_slide!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide>;
  removeStrengths_valley_round_strengths_valley_slide!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  removeStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_round_strengths_valley_slide!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  countStrengths_valley_round_strengths_valley_slides!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_round hasMany strengths_valley_slide via strengths_valley_round_start
  strengths_valley_round_start_strengths_valley_slides!: strengths_valley_slide[];
  getStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide>;
  setStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_round_start_strengths_valley_slide!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  createStrengths_valley_round_start_strengths_valley_slide!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide>;
  removeStrengths_valley_round_start_strengths_valley_slide!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  removeStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_round_start_strengths_valley_slide!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  countStrengths_valley_round_start_strengths_valley_slides!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_round belongsTo strengths_valley_story via strengths_valley_story
  strengths_valley_story_strengths_valley_story!: strengths_valley_story;
  getStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_story>;
  setStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_story, strengths_valley_storyId>;
  createStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_story>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_round {
    return strengths_valley_round.init({
    background: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
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
      unique: "strengths_valley_round_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    strengths_valley_story: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_story',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_round',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_round_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strengths_valley_round_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
