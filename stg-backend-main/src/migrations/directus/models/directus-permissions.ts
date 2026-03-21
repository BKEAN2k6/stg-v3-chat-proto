import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_roles, directus_rolesId } from './directus-roles';

export interface directus_permissionsAttributes {
  id: number;
  role?: string;
  collection: string;
  action: string;
  permissions?: object;
  validation?: object;
  presets?: object;
  fields?: string;
}

export type directus_permissionsPk = "id";
export type directus_permissionsId = directus_permissions[directus_permissionsPk];
export type directus_permissionsOptionalAttributes = "id" | "role" | "permissions" | "validation" | "presets" | "fields";
export type directus_permissionsCreationAttributes = Optional<directus_permissionsAttributes, directus_permissionsOptionalAttributes>;

export class directus_permissions extends Model<directus_permissionsAttributes, directus_permissionsCreationAttributes> implements directus_permissionsAttributes {
  id!: number;
  role?: string;
  collection!: string;
  action!: string;
  permissions?: object;
  validation?: object;
  presets?: object;
  fields?: string;

  // directus_permissions belongsTo directus_roles via role
  role_directus_role!: directus_roles;
  getRole_directus_role!: Sequelize.BelongsToGetAssociationMixin<directus_roles>;
  setRole_directus_role!: Sequelize.BelongsToSetAssociationMixin<directus_roles, directus_rolesId>;
  createRole_directus_role!: Sequelize.BelongsToCreateAssociationMixin<directus_roles>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_permissions {
    return directus_permissions.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    role: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_roles',
        key: 'id'
      }
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    action: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    validation: {
      type: DataTypes.JSON,
      allowNull: true
    },
    presets: {
      type: DataTypes.JSON,
      allowNull: true
    },
    fields: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_permissions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_permissions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
