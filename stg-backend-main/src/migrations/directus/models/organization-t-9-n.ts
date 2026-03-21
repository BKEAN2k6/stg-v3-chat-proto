import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { organization, organizationId } from './organization';

export interface organization_t9nAttributes {
  id: string;
  language_code?: string;
  name?: string;
  organization?: string;
}

export type organization_t9nPk = "id";
export type organization_t9nId = organization_t9n[organization_t9nPk];
export type organization_t9nOptionalAttributes = "language_code" | "name" | "organization";
export type organization_t9nCreationAttributes = Optional<organization_t9nAttributes, organization_t9nOptionalAttributes>;

export class organization_t9n extends Model<organization_t9nAttributes, organization_t9nCreationAttributes> implements organization_t9nAttributes {
  id!: string;
  language_code?: string;
  name?: string;
  organization?: string;

  // organization_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // organization_t9n belongsTo organization via organization
  organization_organization!: organization;
  getOrganization_organization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization_organization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization_organization!: Sequelize.BelongsToCreateAssociationMixin<organization>;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization_t9n {
    return organization_t9n.init({
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
      defaultValue: "NULL"
    },
    organization: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'organization',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'organization_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organization_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
