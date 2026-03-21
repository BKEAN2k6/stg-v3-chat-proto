import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { strengths_valley_story, strengths_valley_storyId } from './strengths-valley-story';

export interface strengths_valley_story_t9nAttributes {
  id: string;
  language_code?: string;
  name?: string;
  strengths_valley_story?: string;
}

export type strengths_valley_story_t9nPk = "id";
export type strengths_valley_story_t9nId = strengths_valley_story_t9n[strengths_valley_story_t9nPk];
export type strengths_valley_story_t9nOptionalAttributes = "language_code" | "name" | "strengths_valley_story";
export type strengths_valley_story_t9nCreationAttributes = Optional<strengths_valley_story_t9nAttributes, strengths_valley_story_t9nOptionalAttributes>;

export class strengths_valley_story_t9n extends Model<strengths_valley_story_t9nAttributes, strengths_valley_story_t9nCreationAttributes> implements strengths_valley_story_t9nAttributes {
  id!: string;
  language_code?: string;
  name?: string;
  strengths_valley_story?: string;

  // strengths_valley_story_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // strengths_valley_story_t9n belongsTo strengths_valley_story via strengths_valley_story
  strengths_valley_story_strengths_valley_story!: strengths_valley_story;
  getStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToGetAssociationMixin<strengths_valley_story>;
  setStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToSetAssociationMixin<strengths_valley_story, strengths_valley_storyId>;
  createStrengths_valley_story_strengths_valley_story!: Sequelize.BelongsToCreateAssociationMixin<strengths_valley_story>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_story_t9n {
    return strengths_valley_story_t9n.init({
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
      unique: "strengths_valley_story_t9n_name_unique"
    },
    strengths_valley_story: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strengths_valley_story',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_story_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_story_t9n_name_unique",
        unique: true,
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "strengths_valley_story_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
