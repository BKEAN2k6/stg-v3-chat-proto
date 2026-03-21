import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { directus_settings, directus_settingsId } from './directus-settings';
import type { directus_users, directus_usersId } from './directus-users';
import type { swl_wall, swl_wallId } from './swl-wall';

export interface directus_foldersAttributes {
  id: string;
  name: string;
  parent?: string;
}

export type directus_foldersPk = "id";
export type directus_foldersId = directus_folders[directus_foldersPk];
export type directus_foldersOptionalAttributes = "parent";
export type directus_foldersCreationAttributes = Optional<directus_foldersAttributes, directus_foldersOptionalAttributes>;

export class directus_folders extends Model<directus_foldersAttributes, directus_foldersCreationAttributes> implements directus_foldersAttributes {
  id!: string;
  name!: string;
  parent?: string;

  // directus_folders hasMany directus_files via folder
  directus_files!: directus_files[];
  getDirectus_files!: Sequelize.HasManyGetAssociationsMixin<directus_files>;
  setDirectus_files!: Sequelize.HasManySetAssociationsMixin<directus_files, directus_filesId>;
  addDirectus_file!: Sequelize.HasManyAddAssociationMixin<directus_files, directus_filesId>;
  addDirectus_files!: Sequelize.HasManyAddAssociationsMixin<directus_files, directus_filesId>;
  createDirectus_file!: Sequelize.HasManyCreateAssociationMixin<directus_files>;
  removeDirectus_file!: Sequelize.HasManyRemoveAssociationMixin<directus_files, directus_filesId>;
  removeDirectus_files!: Sequelize.HasManyRemoveAssociationsMixin<directus_files, directus_filesId>;
  hasDirectus_file!: Sequelize.HasManyHasAssociationMixin<directus_files, directus_filesId>;
  hasDirectus_files!: Sequelize.HasManyHasAssociationsMixin<directus_files, directus_filesId>;
  countDirectus_files!: Sequelize.HasManyCountAssociationsMixin;
  // directus_folders belongsTo directus_folders via parent
  parent_directus_folder!: directus_folders;
  getParent_directus_folder!: Sequelize.BelongsToGetAssociationMixin<directus_folders>;
  setParent_directus_folder!: Sequelize.BelongsToSetAssociationMixin<directus_folders, directus_foldersId>;
  createParent_directus_folder!: Sequelize.BelongsToCreateAssociationMixin<directus_folders>;
  // directus_folders hasMany directus_settings via storage_default_folder
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
  // directus_folders hasMany directus_users via temporary_write_access_folder
  directus_users!: directus_users[];
  getDirectus_users!: Sequelize.HasManyGetAssociationsMixin<directus_users>;
  setDirectus_users!: Sequelize.HasManySetAssociationsMixin<directus_users, directus_usersId>;
  addDirectus_user!: Sequelize.HasManyAddAssociationMixin<directus_users, directus_usersId>;
  addDirectus_users!: Sequelize.HasManyAddAssociationsMixin<directus_users, directus_usersId>;
  createDirectus_user!: Sequelize.HasManyCreateAssociationMixin<directus_users>;
  removeDirectus_user!: Sequelize.HasManyRemoveAssociationMixin<directus_users, directus_usersId>;
  removeDirectus_users!: Sequelize.HasManyRemoveAssociationsMixin<directus_users, directus_usersId>;
  hasDirectus_user!: Sequelize.HasManyHasAssociationMixin<directus_users, directus_usersId>;
  hasDirectus_users!: Sequelize.HasManyHasAssociationsMixin<directus_users, directus_usersId>;
  countDirectus_users!: Sequelize.HasManyCountAssociationsMixin;
  // directus_folders hasMany swl_wall via media_folder
  swl_walls!: swl_wall[];
  getSwl_walls!: Sequelize.HasManyGetAssociationsMixin<swl_wall>;
  setSwl_walls!: Sequelize.HasManySetAssociationsMixin<swl_wall, swl_wallId>;
  addSwl_wall!: Sequelize.HasManyAddAssociationMixin<swl_wall, swl_wallId>;
  addSwl_walls!: Sequelize.HasManyAddAssociationsMixin<swl_wall, swl_wallId>;
  createSwl_wall!: Sequelize.HasManyCreateAssociationMixin<swl_wall>;
  removeSwl_wall!: Sequelize.HasManyRemoveAssociationMixin<swl_wall, swl_wallId>;
  removeSwl_walls!: Sequelize.HasManyRemoveAssociationsMixin<swl_wall, swl_wallId>;
  hasSwl_wall!: Sequelize.HasManyHasAssociationMixin<swl_wall, swl_wallId>;
  hasSwl_walls!: Sequelize.HasManyHasAssociationsMixin<swl_wall, swl_wallId>;
  countSwl_walls!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_folders {
    return directus_folders.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    parent: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_folders',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'directus_folders',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_folders_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
