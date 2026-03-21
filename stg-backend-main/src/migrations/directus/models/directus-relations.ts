import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface directus_relationsAttributes {
  id: number;
  many_collection: string;
  many_field: string;
  one_collection?: string;
  one_field?: string;
  one_collection_field?: string;
  one_allowed_collections?: string;
  junction_field?: string;
  sort_field?: string;
  one_deselect_action: string;
}

export type directus_relationsPk = "id";
export type directus_relationsId = directus_relations[directus_relationsPk];
export type directus_relationsOptionalAttributes = "id" | "one_collection" | "one_field" | "one_collection_field" | "one_allowed_collections" | "junction_field" | "sort_field" | "one_deselect_action";
export type directus_relationsCreationAttributes = Optional<directus_relationsAttributes, directus_relationsOptionalAttributes>;

export class directus_relations extends Model<directus_relationsAttributes, directus_relationsCreationAttributes> implements directus_relationsAttributes {
  id!: number;
  many_collection!: string;
  many_field!: string;
  one_collection?: string;
  one_field?: string;
  one_collection_field?: string;
  one_allowed_collections?: string;
  junction_field?: string;
  sort_field?: string;
  one_deselect_action!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof directus_relations {
    return directus_relations.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    many_collection: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    many_field: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    one_collection: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    one_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    one_collection_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    one_allowed_collections: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    junction_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    sort_field: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    one_deselect_action: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "nullify"
    }
  }, {
    sequelize,
    tableName: 'directus_relations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_relations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
