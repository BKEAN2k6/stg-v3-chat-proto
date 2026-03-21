import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_folders, directus_foldersId } from './directus-folders';
import type { directus_settings, directus_settingsId } from './directus-settings';
import type { directus_users, directus_usersId } from './directus-users';
import type { group, groupId } from './group';
import type { organization, organizationId } from './organization';
import type { strengths_valley_map, strengths_valley_mapId } from './strengths-valley-map';
import type { strengths_valley_round, strengths_valley_roundId } from './strengths-valley-round';
import type { swl_moment_to_file, swl_moment_to_fileId } from './swl-moment-to-file';

export interface directus_filesAttributes {
  id: string;
  storage: string;
  filename_disk?: string;
  filename_download: string;
  title?: string;
  type?: string;
  folder?: string;
  uploaded_by?: string;
  uploaded_on: Date;
  modified_by?: string;
  modified_on: Date;
  charset?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string;
  metadata?: object;
  peek_access_token?: string;
  peek_accessed_at?: Date;
}

export type directus_filesPk = "id";
export type directus_filesId = directus_files[directus_filesPk];
export type directus_filesOptionalAttributes = "filename_disk" | "title" | "type" | "folder" | "uploaded_by" | "uploaded_on" | "modified_by" | "modified_on" | "charset" | "filesize" | "width" | "height" | "duration" | "embed" | "description" | "location" | "tags" | "metadata" | "peek_access_token" | "peek_accessed_at";
export type directus_filesCreationAttributes = Optional<directus_filesAttributes, directus_filesOptionalAttributes>;

export class directus_files extends Model<directus_filesAttributes, directus_filesCreationAttributes> implements directus_filesAttributes {
  id!: string;
  storage!: string;
  filename_disk?: string;
  filename_download!: string;
  title?: string;
  type?: string;
  folder?: string;
  uploaded_by?: string;
  uploaded_on!: Date;
  modified_by?: string;
  modified_on!: Date;
  charset?: string;
  filesize?: number;
  width?: number;
  height?: number;
  duration?: number;
  embed?: string;
  description?: string;
  location?: string;
  tags?: string;
  metadata?: object;
  peek_access_token?: string;
  peek_accessed_at?: Date;

  // directus_files hasMany directus_settings via project_logo
  directus_settings!: directus_settings[];
  getDirectus_settings!: Sequelize.HasManyGetAssociationsMixin<directus_settings>;
  setDirectus_settings!: Sequelize.HasManySetAssociationsMixin<directus_settings, directus_settingsId>;
  addDirectus_setting!: Sequelize.HasManyAddAssociationMixin<directus_settings, directus_settingsId>;
  addDirectus_settings!: Sequelize.HasManyAddAssociationsMixin<directus_settings, directus_settingsId>;
  createDirectus_setting!: Sequelize.HasManyCreateAssociationMixin<directus_settings>;
  removeDirectus_setting!: Sequelize.HasManyRemoveAssociationMixin<directus_settings, directus_settingsId>;
  removeDirectus_settings!: Sequelize.HasManyRemoveAssociationsMixin<directus_settings, directus_settingsId>;
  hasDirectus_setting!: Sequelize.HasManyHasAssociationMixin<directus_settings, directus_settingsId>;
  hasDirectus_settings!: Sequelize.HasManyHasAssociationsMixin<directus_settings, directus_settingsId>;
  countDirectus_settings!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany directus_settings via public_background
  public_background_directus_settings!: directus_settings[];
  getPublic_background_directus_settings!: Sequelize.HasManyGetAssociationsMixin<directus_settings>;
  setPublic_background_directus_settings!: Sequelize.HasManySetAssociationsMixin<directus_settings, directus_settingsId>;
  addPublic_background_directus_setting!: Sequelize.HasManyAddAssociationMixin<directus_settings, directus_settingsId>;
  addPublic_background_directus_settings!: Sequelize.HasManyAddAssociationsMixin<directus_settings, directus_settingsId>;
  createPublic_background_directus_setting!: Sequelize.HasManyCreateAssociationMixin<directus_settings>;
  removePublic_background_directus_setting!: Sequelize.HasManyRemoveAssociationMixin<directus_settings, directus_settingsId>;
  removePublic_background_directus_settings!: Sequelize.HasManyRemoveAssociationsMixin<directus_settings, directus_settingsId>;
  hasPublic_background_directus_setting!: Sequelize.HasManyHasAssociationMixin<directus_settings, directus_settingsId>;
  hasPublic_background_directus_settings!: Sequelize.HasManyHasAssociationsMixin<directus_settings, directus_settingsId>;
  countPublic_background_directus_settings!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany directus_settings via public_foreground
  public_foreground_directus_settings!: directus_settings[];
  getPublic_foreground_directus_settings!: Sequelize.HasManyGetAssociationsMixin<directus_settings>;
  setPublic_foreground_directus_settings!: Sequelize.HasManySetAssociationsMixin<directus_settings, directus_settingsId>;
  addPublic_foreground_directus_setting!: Sequelize.HasManyAddAssociationMixin<directus_settings, directus_settingsId>;
  addPublic_foreground_directus_settings!: Sequelize.HasManyAddAssociationsMixin<directus_settings, directus_settingsId>;
  createPublic_foreground_directus_setting!: Sequelize.HasManyCreateAssociationMixin<directus_settings>;
  removePublic_foreground_directus_setting!: Sequelize.HasManyRemoveAssociationMixin<directus_settings, directus_settingsId>;
  removePublic_foreground_directus_settings!: Sequelize.HasManyRemoveAssociationsMixin<directus_settings, directus_settingsId>;
  hasPublic_foreground_directus_setting!: Sequelize.HasManyHasAssociationMixin<directus_settings, directus_settingsId>;
  hasPublic_foreground_directus_settings!: Sequelize.HasManyHasAssociationsMixin<directus_settings, directus_settingsId>;
  countPublic_foreground_directus_settings!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany group via avatar
  groups!: group[];
  getGroups!: Sequelize.HasManyGetAssociationsMixin<group>;
  setGroups!: Sequelize.HasManySetAssociationsMixin<group, groupId>;
  addGroup!: Sequelize.HasManyAddAssociationMixin<group, groupId>;
  addGroups!: Sequelize.HasManyAddAssociationsMixin<group, groupId>;
  createGroup!: Sequelize.HasManyCreateAssociationMixin<group>;
  removeGroup!: Sequelize.HasManyRemoveAssociationMixin<group, groupId>;
  removeGroups!: Sequelize.HasManyRemoveAssociationsMixin<group, groupId>;
  hasGroup!: Sequelize.HasManyHasAssociationMixin<group, groupId>;
  hasGroups!: Sequelize.HasManyHasAssociationsMixin<group, groupId>;
  countGroups!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany organization via avatar
  organizations!: organization[];
  getOrganizations!: Sequelize.HasManyGetAssociationsMixin<organization>;
  setOrganizations!: Sequelize.HasManySetAssociationsMixin<organization, organizationId>;
  addOrganization!: Sequelize.HasManyAddAssociationMixin<organization, organizationId>;
  addOrganizations!: Sequelize.HasManyAddAssociationsMixin<organization, organizationId>;
  createOrganization!: Sequelize.HasManyCreateAssociationMixin<organization>;
  removeOrganization!: Sequelize.HasManyRemoveAssociationMixin<organization, organizationId>;
  removeOrganizations!: Sequelize.HasManyRemoveAssociationsMixin<organization, organizationId>;
  hasOrganization!: Sequelize.HasManyHasAssociationMixin<organization, organizationId>;
  hasOrganizations!: Sequelize.HasManyHasAssociationsMixin<organization, organizationId>;
  countOrganizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany strengths_valley_map via map
  strengths_valley_maps!: strengths_valley_map[];
  getStrengths_valley_maps!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_map>;
  setStrengths_valley_maps!: Sequelize.HasManySetAssociationsMixin<strengths_valley_map, strengths_valley_mapId>;
  addStrengths_valley_map!: Sequelize.HasManyAddAssociationMixin<strengths_valley_map, strengths_valley_mapId>;
  addStrengths_valley_maps!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_map, strengths_valley_mapId>;
  createStrengths_valley_map!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_map>;
  removeStrengths_valley_map!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_map, strengths_valley_mapId>;
  removeStrengths_valley_maps!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_map, strengths_valley_mapId>;
  hasStrengths_valley_map!: Sequelize.HasManyHasAssociationMixin<strengths_valley_map, strengths_valley_mapId>;
  hasStrengths_valley_maps!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_map, strengths_valley_mapId>;
  countStrengths_valley_maps!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files hasMany strengths_valley_round via background
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
  // directus_files hasMany swl_moment_to_file via directus_files
  swl_moment_to_files!: swl_moment_to_file[];
  getSwl_moment_to_files!: Sequelize.HasManyGetAssociationsMixin<swl_moment_to_file>;
  setSwl_moment_to_files!: Sequelize.HasManySetAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  addSwl_moment_to_file!: Sequelize.HasManyAddAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  addSwl_moment_to_files!: Sequelize.HasManyAddAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  createSwl_moment_to_file!: Sequelize.HasManyCreateAssociationMixin<swl_moment_to_file>;
  removeSwl_moment_to_file!: Sequelize.HasManyRemoveAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  removeSwl_moment_to_files!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  hasSwl_moment_to_file!: Sequelize.HasManyHasAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  hasSwl_moment_to_files!: Sequelize.HasManyHasAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  countSwl_moment_to_files!: Sequelize.HasManyCountAssociationsMixin;
  // directus_files belongsTo directus_folders via folder
  folder_directus_folder!: directus_folders;
  getFolder_directus_folder!: Sequelize.BelongsToGetAssociationMixin<directus_folders>;
  setFolder_directus_folder!: Sequelize.BelongsToSetAssociationMixin<directus_folders, directus_foldersId>;
  createFolder_directus_folder!: Sequelize.BelongsToCreateAssociationMixin<directus_folders>;
  // directus_files belongsTo directus_users via modified_by
  modified_by_directus_user!: directus_users;
  getModified_by_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setModified_by_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createModified_by_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // directus_files belongsTo directus_users via uploaded_by
  uploaded_by_directus_user!: directus_users;
  getUploaded_by_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUploaded_by_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUploaded_by_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_files {
    return directus_files.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    storage: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    filename_disk: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    filename_download: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    folder: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_folders',
        key: 'id'
      }
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    uploaded_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    modified_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    modified_on: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    charset: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    filesize: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    embed: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    location: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true
    },
    peek_access_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "directus_files_peek_access_token_unique"
    },
    peek_accessed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_files',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_files_peek_access_token_unique",
        unique: true,
        fields: [
          { name: "peek_access_token" },
        ]
      },
      {
        name: "directus_files_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
