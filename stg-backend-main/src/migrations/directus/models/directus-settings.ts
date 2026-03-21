import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { directus_folders, directus_foldersId } from './directus-folders';

export interface directus_settingsAttributes {
  id: number;
  project_name: string;
  project_url?: string;
  project_color?: string;
  project_logo?: string;
  public_foreground?: string;
  public_background?: string;
  public_note?: string;
  auth_login_attempts?: number;
  auth_password_policy?: string;
  storage_asset_transform?: string;
  storage_asset_presets?: object;
  custom_css?: string;
  storage_default_folder?: string;
  basemaps?: object;
  mapbox_key?: string;
  module_bar?: object;
  project_descriptor?: string;
  default_language: string;
  custom_aspect_ratios?: object;
}

export type directus_settingsPk = "id";
export type directus_settingsId = directus_settings[directus_settingsPk];
export type directus_settingsOptionalAttributes = "id" | "project_name" | "project_url" | "project_color" | "project_logo" | "public_foreground" | "public_background" | "public_note" | "auth_login_attempts" | "auth_password_policy" | "storage_asset_transform" | "storage_asset_presets" | "custom_css" | "storage_default_folder" | "basemaps" | "mapbox_key" | "module_bar" | "project_descriptor" | "default_language" | "custom_aspect_ratios";
export type directus_settingsCreationAttributes = Optional<directus_settingsAttributes, directus_settingsOptionalAttributes>;

export class directus_settings extends Model<directus_settingsAttributes, directus_settingsCreationAttributes> implements directus_settingsAttributes {
  id!: number;
  project_name!: string;
  project_url?: string;
  project_color?: string;
  project_logo?: string;
  public_foreground?: string;
  public_background?: string;
  public_note?: string;
  auth_login_attempts?: number;
  auth_password_policy?: string;
  storage_asset_transform?: string;
  storage_asset_presets?: object;
  custom_css?: string;
  storage_default_folder?: string;
  basemaps?: object;
  mapbox_key?: string;
  module_bar?: object;
  project_descriptor?: string;
  default_language!: string;
  custom_aspect_ratios?: object;

  // directus_settings belongsTo directus_files via project_logo
  project_logo_directus_file!: directus_files;
  getProject_logo_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setProject_logo_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createProject_logo_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // directus_settings belongsTo directus_files via public_background
  public_background_directus_file!: directus_files;
  getPublic_background_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setPublic_background_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createPublic_background_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // directus_settings belongsTo directus_files via public_foreground
  public_foreground_directus_file!: directus_files;
  getPublic_foreground_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setPublic_foreground_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createPublic_foreground_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // directus_settings belongsTo directus_folders via storage_default_folder
  storage_default_folder_directus_folder!: directus_folders;
  getStorage_default_folder_directus_folder!: Sequelize.BelongsToGetAssociationMixin<directus_folders>;
  setStorage_default_folder_directus_folder!: Sequelize.BelongsToSetAssociationMixin<directus_folders, directus_foldersId>;
  createStorage_default_folder_directus_folder!: Sequelize.BelongsToCreateAssociationMixin<directus_folders>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_settings {
    return directus_settings.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    project_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "Directus"
    },
    project_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    project_color: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    project_logo: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    public_foreground: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    public_background: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    public_note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    auth_login_attempts: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 25
    },
    auth_password_policy: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    storage_asset_transform: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: "all"
    },
    storage_asset_presets: {
      type: DataTypes.JSON,
      allowNull: true
    },
    custom_css: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    storage_default_folder: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_folders',
        key: 'id'
      }
    },
    basemaps: {
      type: DataTypes.JSON,
      allowNull: true
    },
    mapbox_key: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    module_bar: {
      type: DataTypes.JSON,
      allowNull: true
    },
    project_descriptor: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    default_language: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "en-US"
    },
    custom_aspect_ratios: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_settings',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_settings_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
