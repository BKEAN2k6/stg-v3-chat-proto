import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface directus_translationsAttributes {
  id: string;
  language: string;
  key: string;
  value: string;
}

export type directus_translationsPk = "id";
export type directus_translationsId = directus_translations[directus_translationsPk];
export type directus_translationsCreationAttributes = directus_translationsAttributes;

export class directus_translations extends Model<directus_translationsAttributes, directus_translationsCreationAttributes> implements directus_translationsAttributes {
  id!: string;
  language!: string;
  key!: string;
  value!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof directus_translations {
    return directus_translations.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'directus_translations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_translations_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
