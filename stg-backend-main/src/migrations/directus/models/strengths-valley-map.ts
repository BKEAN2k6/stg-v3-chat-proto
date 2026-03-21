import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { strengths_valley_map_t9n, strengths_valley_map_t9nId } from './strengths-valley-map-t-9-n';
import type { strengths_valley_story, strengths_valley_storyId } from './strengths-valley-story';

export interface strengths_valley_mapAttributes {
  id: string;
  map?: string;
  slug: string;
}

export type strengths_valley_mapPk = "id";
export type strengths_valley_mapId = strengths_valley_map[strengths_valley_mapPk];
export type strengths_valley_mapOptionalAttributes = "map" | "slug";
export type strengths_valley_mapCreationAttributes = Optional<strengths_valley_mapAttributes, strengths_valley_mapOptionalAttributes>;

export class strengths_valley_map extends Model<strengths_valley_mapAttributes, strengths_valley_mapCreationAttributes> implements strengths_valley_mapAttributes {
  id!: string;
  map?: string;
  slug!: string;

  // strengths_valley_map belongsTo directus_files via map
  map_directus_file!: directus_files;
  getMap_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setMap_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createMap_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // strengths_valley_map hasMany strengths_valley_map_t9n via strengths_valley_map
  strengths_valley_map_t9ns!: strengths_valley_map_t9n[];
  getStrengths_valley_map_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_map_t9n>;
  setStrengths_valley_map_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  addStrengths_valley_map_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  addStrengths_valley_map_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  createStrengths_valley_map_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_map_t9n>;
  removeStrengths_valley_map_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  removeStrengths_valley_map_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  hasStrengths_valley_map_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  hasStrengths_valley_map_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  countStrengths_valley_map_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // strengths_valley_map hasMany strengths_valley_story via strengths_valley_map
  strengths_valley_stories!: strengths_valley_story[];
  getStrengths_valley_stories!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_story>;
  setStrengths_valley_stories!: Sequelize.HasManySetAssociationsMixin<strengths_valley_story, strengths_valley_storyId>;
  addStrengths_valley_story!: Sequelize.HasManyAddAssociationMixin<strengths_valley_story, strengths_valley_storyId>;
  addStrengths_valley_stories!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_story, strengths_valley_storyId>;
  createStrengths_valley_story!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_story>;
  removeStrengths_valley_story!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_story, strengths_valley_storyId>;
  removeStrengths_valley_stories!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_story, strengths_valley_storyId>;
  hasStrengths_valley_story!: Sequelize.HasManyHasAssociationMixin<strengths_valley_story, strengths_valley_storyId>;
  hasStrengths_valley_stories!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_story, strengths_valley_storyId>;
  countStrengths_valley_stories!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_map {
    return strengths_valley_map.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    map: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      unique: "strengths_valley_map_slug_unique"
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_map',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_map_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "strengths_valley_map_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
