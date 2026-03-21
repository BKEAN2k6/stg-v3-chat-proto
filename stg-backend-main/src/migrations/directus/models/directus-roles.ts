import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_permissions, directus_permissionsId } from './directus-permissions';
import type { directus_presets, directus_presetsId } from './directus-presets';
import type { directus_shares, directus_sharesId } from './directus-shares';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_rolesAttributes {
  id: string;
  name: string;
  icon: string;
  description?: string;
  ip_access?: string;
  enforce_tfa: boolean;
  admin_access: boolean;
  app_access: boolean;
  persistent: boolean;
}

export type directus_rolesPk = "id";
export type directus_rolesId = directus_roles[directus_rolesPk];
export type directus_rolesOptionalAttributes = "icon" | "description" | "ip_access" | "app_access";
export type directus_rolesCreationAttributes = Optional<directus_rolesAttributes, directus_rolesOptionalAttributes>;

export class directus_roles extends Model<directus_rolesAttributes, directus_rolesCreationAttributes> implements directus_rolesAttributes {
  id!: string;
  name!: string;
  icon!: string;
  description?: string;
  ip_access?: string;
  enforce_tfa!: boolean;
  admin_access!: boolean;
  app_access!: boolean;
  persistent!: boolean;

  // directus_roles hasMany directus_permissions via role
  directus_permissions!: directus_permissions[];
  getDirectus_permissions!: Sequelize.HasManyGetAssociationsMixin<directus_permissions>;
  setDirectus_permissions!: Sequelize.HasManySetAssociationsMixin<directus_permissions, directus_permissionsId>;
  addDirectus_permission!: Sequelize.HasManyAddAssociationMixin<directus_permissions, directus_permissionsId>;
  addDirectus_permissions!: Sequelize.HasManyAddAssociationsMixin<directus_permissions, directus_permissionsId>;
  createDirectus_permission!: Sequelize.HasManyCreateAssociationMixin<directus_permissions>;
  removeDirectus_permission!: Sequelize.HasManyRemoveAssociationMixin<directus_permissions, directus_permissionsId>;
  removeDirectus_permissions!: Sequelize.HasManyRemoveAssociationsMixin<directus_permissions, directus_permissionsId>;
  hasDirectus_permission!: Sequelize.HasManyHasAssociationMixin<directus_permissions, directus_permissionsId>;
  hasDirectus_permissions!: Sequelize.HasManyHasAssociationsMixin<directus_permissions, directus_permissionsId>;
  countDirectus_permissions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_roles hasMany directus_presets via role
  directus_presets!: directus_presets[];
  getDirectus_presets!: Sequelize.HasManyGetAssociationsMixin<directus_presets>;
  setDirectus_presets!: Sequelize.HasManySetAssociationsMixin<directus_presets, directus_presetsId>;
  addDirectus_preset!: Sequelize.HasManyAddAssociationMixin<directus_presets, directus_presetsId>;
  addDirectus_presets!: Sequelize.HasManyAddAssociationsMixin<directus_presets, directus_presetsId>;
  createDirectus_preset!: Sequelize.HasManyCreateAssociationMixin<directus_presets>;
  removeDirectus_preset!: Sequelize.HasManyRemoveAssociationMixin<directus_presets, directus_presetsId>;
  removeDirectus_presets!: Sequelize.HasManyRemoveAssociationsMixin<directus_presets, directus_presetsId>;
  hasDirectus_preset!: Sequelize.HasManyHasAssociationMixin<directus_presets, directus_presetsId>;
  hasDirectus_presets!: Sequelize.HasManyHasAssociationsMixin<directus_presets, directus_presetsId>;
  countDirectus_presets!: Sequelize.HasManyCountAssociationsMixin;
  // directus_roles hasMany directus_shares via role
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
  // directus_roles hasMany directus_users via role
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

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_roles {
    return directus_roles.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "supervised_user_circle"
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    ip_access: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    enforce_tfa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    admin_access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    app_access: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'directus_roles',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_roles_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
