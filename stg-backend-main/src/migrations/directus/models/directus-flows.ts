import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_operations, directus_operationsId } from './directus-operations';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_flowsAttributes {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  description?: string;
  status: string;
  trigger?: string;
  accountability?: string;
  options?: object;
  operation?: string;
  date_created?: Date;
  user_created?: string;
}

export type directus_flowsPk = "id";
export type directus_flowsId = directus_flows[directus_flowsPk];
export type directus_flowsOptionalAttributes = "icon" | "color" | "description" | "status" | "trigger" | "accountability" | "options" | "operation" | "date_created" | "user_created";
export type directus_flowsCreationAttributes = Optional<directus_flowsAttributes, directus_flowsOptionalAttributes>;

export class directus_flows extends Model<directus_flowsAttributes, directus_flowsCreationAttributes> implements directus_flowsAttributes {
  id!: string;
  name!: string;
  icon?: string;
  color?: string;
  description?: string;
  status!: string;
  trigger?: string;
  accountability?: string;
  options?: object;
  operation?: string;
  date_created?: Date;
  user_created?: string;

  // directus_flows hasMany directus_operations via flow
  directus_operations!: directus_operations[];
  getDirectus_operations!: Sequelize.HasManyGetAssociationsMixin<directus_operations>;
  setDirectus_operations!: Sequelize.HasManySetAssociationsMixin<directus_operations, directus_operationsId>;
  addDirectus_operation!: Sequelize.HasManyAddAssociationMixin<directus_operations, directus_operationsId>;
  addDirectus_operations!: Sequelize.HasManyAddAssociationsMixin<directus_operations, directus_operationsId>;
  createDirectus_operation!: Sequelize.HasManyCreateAssociationMixin<directus_operations>;
  removeDirectus_operation!: Sequelize.HasManyRemoveAssociationMixin<directus_operations, directus_operationsId>;
  removeDirectus_operations!: Sequelize.HasManyRemoveAssociationsMixin<directus_operations, directus_operationsId>;
  hasDirectus_operation!: Sequelize.HasManyHasAssociationMixin<directus_operations, directus_operationsId>;
  hasDirectus_operations!: Sequelize.HasManyHasAssociationsMixin<directus_operations, directus_operationsId>;
  countDirectus_operations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_flows belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_flows {
    return directus_flows.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: true
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "active"
    },
    trigger: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    accountability: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "all"
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    operation: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: "directus_flows_operation_unique"
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'directus_flows',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_flows_operation_unique",
        unique: true,
        fields: [
          { name: "operation" },
        ]
      },
      {
        name: "directus_flows_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
