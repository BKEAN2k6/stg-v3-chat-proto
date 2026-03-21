import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { strengths_valley_map, strengths_valley_mapId } from './strengths-valley-map';
import type { strengths_valley_round, strengths_valley_roundId } from './strengths-valley-round';
import type { strengths_valley_story_t9n, strengths_valley_story_t9nId } from './strengths-valley-story-t-9-n';

export interface strengths_valley_storyAttributes {
  coordinates?: object;
  id: string;
  slug: string;
  sort?: number;
  strengths_valley_map: string;
}

export type strengths_valley_storyPk = "id";
export type strengths_valley_storyId = strengths_valley_story[strengths_valley_storyPk];
export type strengths_valley_storyOptionalAttributes = "coordinates" | "slug" | "sort";
export type strengths_valley_storyCreationAttributes = Optional<strengths_valley_storyAttributes, strengths_valley_storyOptionalAttributes>;

export class strengths_valley_story extends Model<strengths_valley_storyAttributes, strengths_valley_storyCreationAttributes> implements strengths_valley_storyAttributes {
  coordinates?: object;
  id!: string;
  slug!: string;
  sort?: number;
  strengths_valley_map!: string;

  // strengths_valley_story belongsTo strengths_valley_map via strengths_valley_map
  strengths_valley_map_strengths_valley_map!: strengths_valley_map;
  getStrengths_valley_map_strengths_valley_map!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_map>;
  setStrengths_valley_map_strengths_valley_map!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_map, strengths_valley_mapId>;
  createStrengths_valley_map_strengths_valley_map!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_map>;
  // strengths_valley_story hasMany strengths_valley_round via strengths_valley_story
  strengths_valley_rounds!: strengths_valley_round[];
  getStrengths_valley_rounds!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_round>;
  setStrengths_valley_rounds!: Sequelize.HasManySetAssociationsMixin<strengths_valley_round, strengths_valley_roundId>;
  addStrengths_valley_round!: Sequelize.HasManyAddAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  addStrengths_valley_rounds!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_round, strengths_valley_roundId>;
  createStrengths_valley_round!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_round>;
  removeStrengths_valley_round!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  removeStrengths_valley_rounds!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_round, strengths_valley_roundId>;
  hasStrengths_valley_round!: Sequelize.HasManyHasAssociationMixin<strengths_valley_round, strengths_valley_roundId>;
  hasStrengths_valley_rounds!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_round, strengths_valley_roundId>;
  countStrengths_valley_rounds!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_story hasMany strengths_valley_story_t9n via strengths_valley_story
  strengths_valley_story_t9ns!: strengths_valley_story_t9n[];
  getStrengths_valley_story_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_story_t9n>;
  setStrengths_valley_story_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  addStrengths_valley_story_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  addStrengths_valley_story_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  createStrengths_valley_story_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_story_t9n>;
  removeStrengths_valley_story_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  removeStrengths_valley_story_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  hasStrengths_valley_story_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  hasStrengths_valley_story_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  countStrengths_valley_story_t9ns!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_story {
    return strengths_valley_story.init({
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
      unique: "strengths_valley_story_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    strengths_valley_map: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'strengths_valley_map',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_story',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_story_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strengths_valley_story_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
