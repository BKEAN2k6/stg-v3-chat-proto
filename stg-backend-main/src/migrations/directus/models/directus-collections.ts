import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_shares, directus_sharesId } from './directus-shares';

export interface directus_collectionsAttributes {
  collection: string;
  icon?: string;
  note?: string;
  display_template?: string;
  isHidden: boolean;
  singleton: boolean;
  translations?: object;
  archive_field?: string;
  archive_app_filter: boolean;
  archive_value?: string;
  unarchive_value?: string;
  sort_field?: string;
  accountability?: string;
  color?: string;
  item_duplication_fields?: object;
  sort?: number;
  group?: string;
  collapse: string;
  preview_url?: string;
}

export type directus_collectionsPk = "collection";
export type directus_collectionsId = directus_collections[directus_collectionsPk];
export type directus_collectionsOptionalAttributes = "icon" | "note" | "display_template" | "translations" | "archive_field" | "archive_app_filter" | "archive_value" | "unarchive_value" | "sort_field" | "accountability" | "color" | "item_duplication_fields" | "sort" | "group" | "collapse" | "preview_url";
export type directus_collectionsCreationAttributes = Optional<directus_collectionsAttributes, directus_collectionsOptionalAttributes>;

export class directus_collections extends Model<directus_collectionsAttributes, directus_collectionsCreationAttributes> implements directus_collectionsAttributes {
  collection!: string;
  icon?: string;
  note?: string;
  display_template?: string;
  isHidden!: boolean;
  singleton!: boolean;
  translations?: object;
  archive_field?: string;
  archive_app_filter!: boolean;
  archive_value?: string;
  unarchive_value?: string;
  sort_field?: string;
  accountability?: string;
  color?: string;
  item_duplication_fields?: object;
  sort?: number;
  group?: string;
  collapse!: string;
  preview_url?: string;

  // directus_collections belongsTo directus_collections via group
  group_directus_collection!: directus_collections;
  getGroup_directus_collection!: Sequelize.BelongsToGetAssociationMixin<directus_collections>;
  setGroup_directus_collection!: Sequelize.BelongsToSetAssociationMixin<directus_collections, directus_collectionsId>;
  createGroup_directus_collection!: Sequelize.BelongsToCreateAssociationMixin<directus_collections>;
  // directus_collections hasMany directus_shares via collection
  directus_shares!: directus_shares[];
  getDirectus_shares!: Sequelize.HasManyGetAssociationsMixin<directus_shares>;
  setDirectus_shares!: Sequelize.HasManySetAssociationsMixin<directus_shares, directus_sharesId>;
  addDirectus_share!: Sequelize.HasManyAddAssociationMixin<directus_shares, directus_sharesId>;
  addDirectus_shares!: Sequelize.HasManyAddAssociationsMixin<directus_shares, directus_sharesId>;
  createDirectus_share!: Sequelize.HasManyCreateAssociationMixin<directus_shares>;
  removeDirectus_share!: Sequelize.HasManyRemoveAssociationMixin<directus_shares, directus_sharesId>;
  removeDirectus_shares!: Sequelize.HasManyRemoveAssociationsMixin<directus_shares, directus_sharesId>;
  hasDirectus_share!: Sequelize.HasManyHasAssociationMixin<directus_shares, directus_sharesId>;
  hasDirectus_shares!: Sequelize.HasManyHasAssociationsMixin<directus_shares, directus_sharesId>;
  countDirectus_shares!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_collections {
    return directus_collections.init({
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false,
      primaryKey: true
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    display_template: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    singleton: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    translations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    archive_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    archive_app_filter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    archive_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    unarchive_value: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sort_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    accountability: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "all"
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    item_duplication_fields: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    group: {
      type: DataTypes.STRING(64),
      allowNull: true,
      references: {
        model: 'directus_collections',
        key: 'collection'
      }
    },
    collapse: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "open"
    },
    preview_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_collections',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_collections_pkey",
        unique: true,
        fields: [
          { name: "collection" },
        ]
      },
    ]
  });
  }
}
