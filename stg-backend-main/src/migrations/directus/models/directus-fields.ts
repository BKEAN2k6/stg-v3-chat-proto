import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface directus_fieldsAttributes {
  id: number;
  collection: string;
  field: string;
  special?: string;
  interface?: string;
  options?: object;
  display?: string;
  display_options?: object;
  readonly: boolean;
  isHidden: boolean;
  sort?: number;
  width?: string;
  translations?: object;
  note?: string;
  conditions?: object;
  required?: boolean;
  group?: string;
  validation?: object;
  validation_message?: string;
}

export type directus_fieldsPk = "id";
export type directus_fieldsId = directus_fields[directus_fieldsPk];
export type directus_fieldsOptionalAttributes = "id" | "special" | "interface" | "options" | "display" | "display_options" | "sort" | "width" | "translations" | "note" | "conditions" | "required" | "group" | "validation" | "validation_message";
export type directus_fieldsCreationAttributes = Optional<directus_fieldsAttributes, directus_fieldsOptionalAttributes>;

export class directus_fields extends Model<directus_fieldsAttributes, directus_fieldsCreationAttributes> implements directus_fieldsAttributes {
  id!: number;
  collection!: string;
  field!: string;
  special?: string;
  interface?: string;
  options?: object;
  display?: string;
  display_options?: object;
  readonly!: boolean;
  isHidden!: boolean;
  sort?: number;
  width?: string;
  translations?: object;
  note?: string;
  conditions?: object;
  required?: boolean;
  group?: string;
  validation?: object;
  validation_message?: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof directus_fields {
    return directus_fields.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    field: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    special: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    interface: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    display: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    display_options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    readonly: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    width: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "full"
    },
    translations: {
      type: DataTypes.JSON,
      allowNull: true
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    conditions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    required: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    group: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    validation: {
      type: DataTypes.JSON,
      allowNull: true
    },
    validation_message: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_fields',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_fields_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
