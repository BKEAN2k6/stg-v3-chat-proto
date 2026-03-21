import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_roles, directus_rolesId } from './directus-roles';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_presetsAttributes {
  id: number;
  bookmark?: string;
  user?: string;
  role?: string;
  collection?: string;
  search?: string;
  layout?: string;
  layout_query?: object;
  layout_options?: object;
  refresh_interval?: number;
  filter?: object;
  icon?: string;
  color?: string;
}

export type directus_presetsPk = "id";
export type directus_presetsId = directus_presets[directus_presetsPk];
export type directus_presetsOptionalAttributes = "id" | "bookmark" | "user" | "role" | "collection" | "search" | "layout" | "layout_query" | "layout_options" | "refresh_interval" | "filter" | "icon" | "color";
export type directus_presetsCreationAttributes = Optional<directus_presetsAttributes, directus_presetsOptionalAttributes>;

export class directus_presets extends Model<directus_presetsAttributes, directus_presetsCreationAttributes> implements directus_presetsAttributes {
  id!: number;
  bookmark?: string;
  user?: string;
  role?: string;
  collection?: string;
  search?: string;
  layout?: string;
  layout_query?: object;
  layout_options?: object;
  refresh_interval?: number;
  filter?: object;
  icon?: string;
  color?: string;

  // directus_presets belongsTo directus_roles via role
  role_directus_role!: directus_roles;
  getRole_directus_role!: Sequelize.BelongsToGetAssociationMixin<directus_roles>;
  setRole_directus_role!: Sequelize.BelongsToSetAssociationMixin<directus_roles, directus_rolesId>;
  createRole_directus_role!: Sequelize.BelongsToCreateAssociationMixin<directus_roles>;
  // directus_presets belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_presets {
    return directus_presets.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bookmark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
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
      allowNull: true
    },
    search: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    layout: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "tabular"
    },
    layout_query: {
      type: DataTypes.JSON,
      allowNull: true
    },
    layout_options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    refresh_interval: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    filter: {
      type: DataTypes.JSON,
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "bookmark"
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_presets',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_presets_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
