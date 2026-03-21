import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { parent_organization, parent_organizationId } from './parent-organization';

export interface parent_organization_t9nAttributes {
  country_name?: string;
  id: string;
  language_code?: string;
  name?: string;
  parent_organization?: string;
}

export type parent_organization_t9nPk = "id";
export type parent_organization_t9nId = parent_organization_t9n[parent_organization_t9nPk];
export type parent_organization_t9nOptionalAttributes = "country_name" | "language_code" | "name" | "parent_organization";
export type parent_organization_t9nCreationAttributes = Optional<parent_organization_t9nAttributes, parent_organization_t9nOptionalAttributes>;

export class parent_organization_t9n extends Model<parent_organization_t9nAttributes, parent_organization_t9nCreationAttributes> implements parent_organization_t9nAttributes {
  country_name?: string;
  id!: string;
  language_code?: string;
  name?: string;
  parent_organization?: string;

  // parent_organization_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // parent_organization_t9n belongsTo parent_organization via parent_organization
  parent_organization_parent_organization!: parent_organization;
  getParent_organization_parent_organization!: Sequelize.BelongsToGetAssociationMixin<parent_organization>;
  setParent_organization_parent_organization!: Sequelize.BelongsToSetAssociationMixin<parent_organization, parent_organizationId>;
  createParent_organization_parent_organization!: Sequelize.BelongsToCreateAssociationMixin<parent_organization>;

  static initModel(sequelize: Sequelize.Sequelize): typeof parent_organization_t9n {
    return parent_organization_t9n.init({
    country_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    language_code: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      references: {
        model: 'language',
        key: 'code'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "parent_organization_t9n_name_unique"
    },
    parent_organization: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'parent_organization',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'parent_organization_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "parent_organization_t9n_name_unique",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "parent_organization_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
