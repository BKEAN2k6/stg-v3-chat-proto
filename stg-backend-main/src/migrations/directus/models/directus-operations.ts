import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_flows, directus_flowsId } from './directus-flows';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_operationsAttributes {
  id: string;
  name?: string;
  key: string;
  type: string;
  position_x: number;
  position_y: number;
  options?: object;
  resolve?: string;
  reject?: string;
  flow: string;
  date_created?: Date;
  user_created?: string;
}

export type directus_operationsPk = "id";
export type directus_operationsId = directus_operations[directus_operationsPk];
export type directus_operationsOptionalAttributes = "name" | "options" | "resolve" | "reject" | "date_created" | "user_created";
export type directus_operationsCreationAttributes = Optional<directus_operationsAttributes, directus_operationsOptionalAttributes>;

export class directus_operations extends Model<directus_operationsAttributes, directus_operationsCreationAttributes> implements directus_operationsAttributes {
  id!: string;
  name?: string;
  key!: string;
  type!: string;
  position_x!: number;
  position_y!: number;
  options?: object;
  resolve?: string;
  reject?: string;
  flow!: string;
  date_created?: Date;
  user_created?: string;

  // directus_operations belongsTo directus_flows via flow
  flow_directus_flow!: directus_flows;
  getFlow_directus_flow!: Sequelize.BelongsToGetAssociationMixin<directus_flows>;
  setFlow_directus_flow!: Sequelize.BelongsToSetAssociationMixin<directus_flows, directus_flowsId>;
  createFlow_directus_flow!: Sequelize.BelongsToCreateAssociationMixin<directus_flows>;
  // directus_operations belongsTo directus_operations via reject
  reject_directus_operation!: directus_operations;
  getReject_directus_operation!: Sequelize.BelongsToGetAssociationMixin<directus_operations>;
  setReject_directus_operation!: Sequelize.BelongsToSetAssociationMixin<directus_operations, directus_operationsId>;
  createReject_directus_operation!: Sequelize.BelongsToCreateAssociationMixin<directus_operations>;
  // directus_operations belongsTo directus_operations via resolve
  resolve_directus_operation!: directus_operations;
  getResolve_directus_operation!: Sequelize.BelongsToGetAssociationMixin<directus_operations>;
  setResolve_directus_operation!: Sequelize.BelongsToSetAssociationMixin<directus_operations, directus_operationsId>;
  createResolve_directus_operation!: Sequelize.BelongsToCreateAssociationMixin<directus_operations>;
  // directus_operations belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_operations {
    return directus_operations.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position_x: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position_y: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    resolve: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_operations',
        key: 'id'
      },
      unique: "directus_operations_resolve_unique"
    },
    reject: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_operations',
        key: 'id'
      },
      unique: "directus_operations_reject_unique"
    },
    flow: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_flows',
        key: 'id'
      }
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
    tableName: 'directus_operations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_operations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "directus_operations_reject_unique",
        unique: true,
        fields: [
          { name: "reject" },
        ]
      },
      {
        name: "directus_operations_resolve_unique",
        unique: true,
        fields: [
          { name: "resolve" },
        ]
      },
    ]
  });
  }
}
