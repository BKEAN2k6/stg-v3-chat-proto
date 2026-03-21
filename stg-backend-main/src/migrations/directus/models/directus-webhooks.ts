import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface directus_webhooksAttributes {
  id: number;
  name: string;
  method: string;
  url: string;
  status: string;
  data: boolean;
  actions: string;
  collections: string;
  headers?: object;
}

export type directus_webhooksPk = "id";
export type directus_webhooksId = directus_webhooks[directus_webhooksPk];
export type directus_webhooksOptionalAttributes = "id" | "method" | "status" | "data" | "headers";
export type directus_webhooksCreationAttributes = Optional<directus_webhooksAttributes, directus_webhooksOptionalAttributes>;

export class directus_webhooks extends Model<directus_webhooksAttributes, directus_webhooksCreationAttributes> implements directus_webhooksAttributes {
  id!: number;
  name!: string;
  method!: string;
  url!: string;
  status!: string;
  data!: boolean;
  actions!: string;
  collections!: string;
  headers?: object;


  static initModel(sequelize: Sequelize.Sequelize): typeof directus_webhooks {
    return directus_webhooks.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "POST"
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "active"
    },
    data: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    actions: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    collections: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    headers: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_webhooks',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_webhooks_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
