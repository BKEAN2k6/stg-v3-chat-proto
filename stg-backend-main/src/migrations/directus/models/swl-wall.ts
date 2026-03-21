import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_folders, directus_foldersId } from './directus-folders';
import type { directus_users, directus_usersCreationAttributes, directus_usersId } from './directus-users';
import type { group, groupId } from './group';
import type { organization, organizationCreationAttributes, organizationId } from './organization';
import type { swl_item_to_swl_wall, swl_item_to_swl_wallId } from './swl-item-to-swl-wall';

export interface swl_wallAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  media_folder?: string;
  user_created?: string;
  user_updated?: string;
}

export type swl_wallPk = "id";
export type swl_wallId = swl_wall[swl_wallPk];
export type swl_wallOptionalAttributes = "date_created" | "date_updated" | "media_folder" | "user_created" | "user_updated";
export type swl_wallCreationAttributes = Optional<swl_wallAttributes, swl_wallOptionalAttributes>;

export class swl_wall extends Model<swl_wallAttributes, swl_wallCreationAttributes> implements swl_wallAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  media_folder?: string;
  user_created?: string;
  user_updated?: string;

  // swl_wall belongsTo directus_folders via media_folder
  media_folder_directus_folder!: directus_folders;
  getMedia_folder_directus_folder!: Sequelize.BelongsToGetAssociationMixin<directus_folders>;
  setMedia_folder_directus_folder!: Sequelize.BelongsToSetAssociationMixin<directus_folders, directus_foldersId>;
  createMedia_folder_directus_folder!: Sequelize.BelongsToCreateAssociationMixin<directus_folders>;
  // swl_wall belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_wall belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_wall hasOne directus_users via swl_wall
  directus_user!: directus_users;
  getDirectus_user!: Sequelize.HasOneGetAssociationMixin<directus_users>;
  setDirectus_user!: Sequelize.HasOneSetAssociationMixin<directus_users, directus_usersId>;
  createDirectus_user!: Sequelize.HasOneCreateAssociationMixin<directus_users>;
  // swl_wall hasMany group via swl_wall
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
  // swl_wall hasOne organization via swl_wall
  organization!: organization;
  getOrganization!: Sequelize.HasOneGetAssociationMixin<organization>;
  setOrganization!: Sequelize.HasOneSetAssociationMixin<organization, organizationId>;
  createOrganization!: Sequelize.HasOneCreateAssociationMixin<organization>;
  // swl_wall hasMany swl_item_to_swl_wall via swl_wall
  swl_item_to_swl_walls!: swl_item_to_swl_wall[];
  getSwl_item_to_swl_walls!: Sequelize.HasManyGetAssociationsMixin<swl_item_to_swl_wall>;
  setSwl_item_to_swl_walls!: Sequelize.HasManySetAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  addSwl_item_to_swl_wall!: Sequelize.HasManyAddAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  addSwl_item_to_swl_walls!: Sequelize.HasManyAddAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  createSwl_item_to_swl_wall!: Sequelize.HasManyCreateAssociationMixin<swl_item_to_swl_wall>;
  removeSwl_item_to_swl_wall!: Sequelize.HasManyRemoveAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  removeSwl_item_to_swl_walls!: Sequelize.HasManyRemoveAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  hasSwl_item_to_swl_wall!: Sequelize.HasManyHasAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  hasSwl_item_to_swl_walls!: Sequelize.HasManyHasAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  countSwl_item_to_swl_walls!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_wall {
    return swl_wall.init({
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
    media_folder: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_folders',
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
    tableName: 'swl_wall',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_wall_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
