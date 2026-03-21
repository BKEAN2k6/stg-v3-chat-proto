import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { directus_users, directus_usersId } from './directus-users';
import type { organization, organizationId } from './organization';
import type { strength_session, strength_sessionId } from './strength-session';
import type { swl_wall, swl_wallId } from './swl-wall';
import type { user_to_group, user_to_groupId } from './user-to-group';

export interface groupAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  join_short_code?: string;
  join_short_code_expires_at?: Date;
  name: string;
  sort?: number;
  status: string;
  user_created?: string;
  user_updated?: string;
  avatar?: string;
  color?: string;
  organization?: string;
  slug?: string;
  swl_wall?: string;
}

export type groupPk = "id";
export type groupId = group[groupPk];
export type groupOptionalAttributes = "date_created" | "date_updated" | "join_short_code" | "join_short_code_expires_at" | "name" | "sort" | "status" | "user_created" | "user_updated" | "avatar" | "color" | "organization" | "slug" | "swl_wall";
export type groupCreationAttributes = Optional<groupAttributes, groupOptionalAttributes>;

export class group extends Model<groupAttributes, groupCreationAttributes> implements groupAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  join_short_code?: string;
  join_short_code_expires_at?: Date;
  name!: string;
  sort?: number;
  status!: string;
  user_created?: string;
  user_updated?: string;
  avatar?: string;
  color?: string;
  organization?: string;
  slug?: string;
  swl_wall?: string;

  // group belongsTo directus_files via avatar
  avatar_directus_file!: directus_files;
  getAvatar_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setAvatar_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createAvatar_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // group belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // group belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // group hasMany directus_users via active_group
  directus_users!: directus_users[];
  declare getDirectus_users: Sequelize.HasManyGetAssociationsMixin<directus_users>;
  setDirectus_users!: Sequelize.HasManySetAssociationsMixin<directus_users, directus_usersId>;
  addDirectus_user!: Sequelize.HasManyAddAssociationMixin<directus_users, directus_usersId>;
  addDirectus_users!: Sequelize.HasManyAddAssociationsMixin<directus_users, directus_usersId>;
  createDirectus_user!: Sequelize.HasManyCreateAssociationMixin<directus_users>;
  removeDirectus_user!: Sequelize.HasManyRemoveAssociationMixin<directus_users, directus_usersId>;
  removeDirectus_users!: Sequelize.HasManyRemoveAssociationsMixin<directus_users, directus_usersId>;
  hasDirectus_user!: Sequelize.HasManyHasAssociationMixin<directus_users, directus_usersId>;
  hasDirectus_users!: Sequelize.HasManyHasAssociationsMixin<directus_users, directus_usersId>;
  countDirectus_users!: Sequelize.HasManyCountAssociationsMixin;
  // group hasMany strength_session via group
  strength_sessions!: strength_session[];
  getStrength_sessions!: Sequelize.HasManyGetAssociationsMixin<strength_session>;
  setStrength_sessions!: Sequelize.HasManySetAssociationsMixin<strength_session, strength_sessionId>;
  addStrength_session!: Sequelize.HasManyAddAssociationMixin<strength_session, strength_sessionId>;
  addStrength_sessions!: Sequelize.HasManyAddAssociationsMixin<strength_session, strength_sessionId>;
  createStrength_session!: Sequelize.HasManyCreateAssociationMixin<strength_session>;
  removeStrength_session!: Sequelize.HasManyRemoveAssociationMixin<strength_session, strength_sessionId>;
  removeStrength_sessions!: Sequelize.HasManyRemoveAssociationsMixin<strength_session, strength_sessionId>;
  hasStrength_session!: Sequelize.HasManyHasAssociationMixin<strength_session, strength_sessionId>;
  hasStrength_sessions!: Sequelize.HasManyHasAssociationsMixin<strength_session, strength_sessionId>;
  countStrength_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // group hasMany user_to_group via group
  user_to_groups!: user_to_group[];
  getUser_to_groups!: Sequelize.HasManyGetAssociationsMixin<user_to_group>;
  setUser_to_groups!: Sequelize.HasManySetAssociationsMixin<user_to_group, user_to_groupId>;
  addUser_to_group!: Sequelize.HasManyAddAssociationMixin<user_to_group, user_to_groupId>;
  addUser_to_groups!: Sequelize.HasManyAddAssociationsMixin<user_to_group, user_to_groupId>;
  createUser_to_group!: Sequelize.HasManyCreateAssociationMixin<user_to_group>;
  removeUser_to_group!: Sequelize.HasManyRemoveAssociationMixin<user_to_group, user_to_groupId>;
  removeUser_to_groups!: Sequelize.HasManyRemoveAssociationsMixin<user_to_group, user_to_groupId>;
  hasUser_to_group!: Sequelize.HasManyHasAssociationMixin<user_to_group, user_to_groupId>;
  hasUser_to_groups!: Sequelize.HasManyHasAssociationsMixin<user_to_group, user_to_groupId>;
  countUser_to_groups!: Sequelize.HasManyCountAssociationsMixin;
  // group belongsTo organization via organization
  organization_organization!: organization;
  getOrganization_organization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization_organization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization_organization!: Sequelize.BelongsToCreateAssociationMixin<organization>;
  // group belongsTo swl_wall via swl_wall
  swl_wall_swl_wall!: swl_wall;
  getSwl_wall_swl_wall!: Sequelize.BelongsToGetAssociationMixin<swl_wall>;
  setSwl_wall_swl_wall!: Sequelize.BelongsToSetAssociationMixin<swl_wall, swl_wallId>;
  createSwl_wall_swl_wall!: Sequelize.BelongsToCreateAssociationMixin<swl_wall>;

  static initModel(sequelize: Sequelize.Sequelize): typeof group {
    return group.init({
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
    join_short_code: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL",
      unique: "group_join_short_code_unique"
    },
    join_short_code_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "draft"
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
    },
    avatar: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    organization: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "group_slug_unique"
    },
    swl_wall: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'swl_wall',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'group',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "group_join_short_code_unique",
        unique: true,
        fields: [
          { name: "join_short_code" },
        ]
      },
      {
        name: "group_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "group_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
