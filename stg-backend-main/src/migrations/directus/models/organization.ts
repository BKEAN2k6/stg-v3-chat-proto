import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { directus_users, directus_usersId } from './directus-users';
import type { group, groupId } from './group';
import type { language, languageId } from './language';
import type { organization_t9n, organization_t9nId } from './organization-t-9-n';
import type { organization_timeseries_data, organization_timeseries_dataId } from './organization-timeseries-data';
import type { parent_organization, parent_organizationId } from './parent-organization';
import type { swl_wall, swl_wallId } from './swl-wall';
import type { user_to_organization, user_to_organizationId } from './user-to-organization';

export interface organizationAttributes {
  avatar?: string;
  avatar_slug?: string;
  color?: string;
  created_from_admin_tools?: boolean;
  date_created?: Date;
  date_updated?: Date;
  default_language?: string;
  id: string;
  join_short_code?: string;
  join_short_code_expires_at?: Date;
  parent_organization?: string;
  persistent?: boolean;
  skolon_uuid?: string;
  slug?: string;
  sort?: number;
  status?: string;
  swl_wall?: string;
  type?: string;
  user_created?: string;
  user_updated?: string;
  stg_v1_id?: string;
  has_access_to_v1_learn?: boolean;
  use_nov23_structure_update?: boolean;
}

export type organizationPk = "id";
export type organizationId = organization[organizationPk];
export type organizationOptionalAttributes = "avatar" | "avatar_slug" | "color" | "created_from_admin_tools" | "date_created" | "date_updated" | "default_language" | "join_short_code" | "join_short_code_expires_at" | "parent_organization" | "persistent" | "skolon_uuid" | "slug" | "sort" | "status" | "swl_wall" | "type" | "user_created" | "user_updated" | "stg_v1_id" | "has_access_to_v1_learn" | "use_nov23_structure_update";
export type organizationCreationAttributes = Optional<organizationAttributes, organizationOptionalAttributes>;

export class organization extends Model<organizationAttributes, organizationCreationAttributes> implements organizationAttributes {
  avatar?: string;
  avatar_slug?: string;
  color?: string;
  created_from_admin_tools?: boolean;
  date_created?: Date;
  date_updated?: Date;
  default_language?: string;
  id!: string;
  join_short_code?: string;
  join_short_code_expires_at?: Date;
  parent_organization?: string;
  persistent?: boolean;
  skolon_uuid?: string;
  slug?: string;
  sort?: number;
  status?: string;
  swl_wall?: string;
  type?: string;
  user_created?: string;
  user_updated?: string;
  stg_v1_id?: string;
  has_access_to_v1_learn?: boolean;
  use_nov23_structure_update?: boolean;

  // organization belongsTo directus_files via avatar
  avatar_directus_file!: directus_files;
  getAvatar_directus_file!: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setAvatar_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createAvatar_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // organization belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // organization belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // organization belongsTo language via default_language
  default_language_language!: language;
  getDefault_language_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setDefault_language_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createDefault_language_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // organization hasMany directus_users via active_organization
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
  // organization hasMany group via organization
  groups!: group[];
  declare getGroups: Sequelize.HasManyGetAssociationsMixin<group>;
  setGroups!: Sequelize.HasManySetAssociationsMixin<group, groupId>;
  addGroup!: Sequelize.HasManyAddAssociationMixin<group, groupId>;
  addGroups!: Sequelize.HasManyAddAssociationsMixin<group, groupId>;
  createGroup!: Sequelize.HasManyCreateAssociationMixin<group>;
  removeGroup!: Sequelize.HasManyRemoveAssociationMixin<group, groupId>;
  removeGroups!: Sequelize.HasManyRemoveAssociationsMixin<group, groupId>;
  hasGroup!: Sequelize.HasManyHasAssociationMixin<group, groupId>;
  hasGroups!: Sequelize.HasManyHasAssociationsMixin<group, groupId>;
  countGroups!: Sequelize.HasManyCountAssociationsMixin;
  // organization hasMany organization_t9n via organization
  organization_t9ns!: organization_t9n[];
  declare getOrganization_t9ns: Sequelize.HasManyGetAssociationsMixin<organization_t9n>;
  setOrganization_t9ns!: Sequelize.HasManySetAssociationsMixin<organization_t9n, organization_t9nId>;
  addOrganization_t9n!: Sequelize.HasManyAddAssociationMixin<organization_t9n, organization_t9nId>;
  addOrganization_t9ns!: Sequelize.HasManyAddAssociationsMixin<organization_t9n, organization_t9nId>;
  createOrganization_t9n!: Sequelize.HasManyCreateAssociationMixin<organization_t9n>;
  removeOrganization_t9n!: Sequelize.HasManyRemoveAssociationMixin<organization_t9n, organization_t9nId>;
  removeOrganization_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<organization_t9n, organization_t9nId>;
  hasOrganization_t9n!: Sequelize.HasManyHasAssociationMixin<organization_t9n, organization_t9nId>;
  hasOrganization_t9ns!: Sequelize.HasManyHasAssociationsMixin<organization_t9n, organization_t9nId>;
  countOrganization_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // organization hasMany organization_timeseries_data via organization
  organization_timeseries_data!: organization_timeseries_data[];
  getOrganization_timeseries_data!: Sequelize.HasManyGetAssociationsMixin<organization_timeseries_data>;
  setOrganization_timeseries_data!: Sequelize.HasManySetAssociationsMixin<organization_timeseries_data, organization_timeseries_dataId>;
  addOrganization_timeseries_datum!: Sequelize.HasManyAddAssociationMixin<organization_timeseries_data, organization_timeseries_dataId>;
  addOrganization_timeseries_data!: Sequelize.HasManyAddAssociationsMixin<organization_timeseries_data, organization_timeseries_dataId>;
  createOrganization_timeseries_datum!: Sequelize.HasManyCreateAssociationMixin<organization_timeseries_data>;
  removeOrganization_timeseries_datum!: Sequelize.HasManyRemoveAssociationMixin<organization_timeseries_data, organization_timeseries_dataId>;
  removeOrganization_timeseries_data!: Sequelize.HasManyRemoveAssociationsMixin<organization_timeseries_data, organization_timeseries_dataId>;
  hasOrganization_timeseries_datum!: Sequelize.HasManyHasAssociationMixin<organization_timeseries_data, organization_timeseries_dataId>;
  hasOrganization_timeseries_data!: Sequelize.HasManyHasAssociationsMixin<organization_timeseries_data, organization_timeseries_dataId>;
  countOrganization_timeseries_data!: Sequelize.HasManyCountAssociationsMixin;
  // organization hasMany user_to_organization via organization
  user_to_organizations!: user_to_organization[];
  getUser_to_organizations!: Sequelize.HasManyGetAssociationsMixin<user_to_organization>;
  setUser_to_organizations!: Sequelize.HasManySetAssociationsMixin<user_to_organization, user_to_organizationId>;
  addUser_to_organization!: Sequelize.HasManyAddAssociationMixin<user_to_organization, user_to_organizationId>;
  addUser_to_organizations!: Sequelize.HasManyAddAssociationsMixin<user_to_organization, user_to_organizationId>;
  createUser_to_organization!: Sequelize.HasManyCreateAssociationMixin<user_to_organization>;
  removeUser_to_organization!: Sequelize.HasManyRemoveAssociationMixin<user_to_organization, user_to_organizationId>;
  removeUser_to_organizations!: Sequelize.HasManyRemoveAssociationsMixin<user_to_organization, user_to_organizationId>;
  hasUser_to_organization!: Sequelize.HasManyHasAssociationMixin<user_to_organization, user_to_organizationId>;
  hasUser_to_organizations!: Sequelize.HasManyHasAssociationsMixin<user_to_organization, user_to_organizationId>;
  countUser_to_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // organization belongsTo parent_organization via parent_organization
  parent_organization_parent_organization!: parent_organization;
  getParent_organization_parent_organization!: Sequelize.BelongsToGetAssociationMixin<parent_organization>;
  setParent_organization_parent_organization!: Sequelize.BelongsToSetAssociationMixin<parent_organization, parent_organizationId>;
  createParent_organization_parent_organization!: Sequelize.BelongsToCreateAssociationMixin<parent_organization>;
  // organization belongsTo swl_wall via swl_wall
  swl_wall_swl_wall!: swl_wall;
  getSwl_wall_swl_wall!: Sequelize.BelongsToGetAssociationMixin<swl_wall>;
  setSwl_wall_swl_wall!: Sequelize.BelongsToSetAssociationMixin<swl_wall, swl_wallId>;
  createSwl_wall_swl_wall!: Sequelize.BelongsToCreateAssociationMixin<swl_wall>;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization {
    return organization.init({
    avatar: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    avatar_slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    created_from_admin_tools: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    default_language: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      references: {
        model: 'language',
        key: 'code'
      }
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
      unique: "organization_join_short_code_unique"
    },
    join_short_code_expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    parent_organization: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'parent_organization',
        key: 'id'
      }
    },
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    skolon_uuid: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: "organization_skolon_uuid_unique"
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "organization_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "published"
    },
    swl_wall: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'swl_wall',
        key: 'id'
      },
      unique: "organization_swl_wall_unique"
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
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
    stg_v1_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "organization_stg_v1_id_unique"
    },
    has_access_to_v1_learn: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    use_nov23_structure_update: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'organization',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organization_join_short_code_unique",
        unique: true,
        fields: [
          { name: "join_short_code" },
        ]
      },
      {
        name: "organization_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "organization_skolon_uuid_unique",
        unique: true,
        fields: [
          { name: "skolon_uuid" },
        ]
      },
      {
        name: "organization_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
      {
        name: "organization_stg_v1_id_unique",
        unique: true,
        fields: [
          { name: "stg_v1_id" },
        ]
      },
      {
        name: "organization_swl_wall_unique",
        unique: true,
        fields: [
          { name: "swl_wall" },
        ]
      },
    ]
  });
  }
}
