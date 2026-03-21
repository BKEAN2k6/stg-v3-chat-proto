import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { strengths_valley_level, strengths_valley_levelId } from './strengths-valley-level';

export interface strengths_valley_level_t9nAttributes {
  id: string;
  language_code?: string;
  strengths_valley_level?: string;
}

export type strengths_valley_level_t9nPk = "id";
export type strengths_valley_level_t9nId = strengths_valley_level_t9n[strengths_valley_level_t9nPk];
export type strengths_valley_level_t9nOptionalAttributes = "language_code" | "strengths_valley_level";
export type strengths_valley_level_t9nCreationAttributes = Optional<strengths_valley_level_t9nAttributes, strengths_valley_level_t9nOptionalAttributes>;

export class strengths_valley_level_t9n extends Model<strengths_valley_level_t9nAttributes, strengths_valley_level_t9nCreationAttributes> implements strengths_valley_level_t9nAttributes {
  id!: string;
  language_code?: string;
  strengths_valley_level?: string;

  // strengths_valley_level_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // strengths_valley_level_t9n belongsTo strengths_valley_level via strengths_valley_level
  strengths_valley_level_strengths_valley_level!: strengths_valley_level;
  getStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_level>;
  setStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_level, strengths_valley_levelId>;
  createStrengths_valley_level_strengths_valley_level!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_level>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_level_t9n {
    return strengths_valley_level_t9n.init({
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
    strengths_valley_level: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_level',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_level_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_level_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
