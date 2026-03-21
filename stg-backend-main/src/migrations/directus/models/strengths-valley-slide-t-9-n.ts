import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { strengths_valley_slide, strengths_valley_slideId } from './strengths-valley-slide';

export interface strengths_valley_slide_t9nAttributes {
  body_text?: object;
  header?: object;
  id: string;
  language_code?: string;
  media?: object;
  strengths_valley_slide?: string;
}

export type strengths_valley_slide_t9nPk = "id";
export type strengths_valley_slide_t9nId = strengths_valley_slide_t9n[strengths_valley_slide_t9nPk];
export type strengths_valley_slide_t9nOptionalAttributes = "body_text" | "header" | "language_code" | "media" | "strengths_valley_slide";
export type strengths_valley_slide_t9nCreationAttributes = Optional<strengths_valley_slide_t9nAttributes, strengths_valley_slide_t9nOptionalAttributes>;

export class strengths_valley_slide_t9n extends Model<strengths_valley_slide_t9nAttributes, strengths_valley_slide_t9nCreationAttributes> implements strengths_valley_slide_t9nAttributes {
  body_text?: object;
  header?: object;
  id!: string;
  language_code?: string;
  media?: object;
  strengths_valley_slide?: string;

  // strengths_valley_slide_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // strengths_valley_slide_t9n belongsTo strengths_valley_slide via strengths_valley_slide
  strengths_valley_slide_strengths_valley_slide!: strengths_valley_slide;
  getStrengths_valley_slide_strengths_valley_slide!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_slide>;
  setStrengths_valley_slide_strengths_valley_slide!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  createStrengths_valley_slide_strengths_valley_slide!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_slide>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_slide_t9n {
    return strengths_valley_slide_t9n.init({
    body_text: {
      type: DataTypes.JSON,
      allowNull: true
    },
    header: {
      type: DataTypes.JSON,
      allowNull: true
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
    media: {
      type: DataTypes.JSON,
      allowNull: true
    },
    strengths_valley_slide: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_slide',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_slide_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_slide_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
