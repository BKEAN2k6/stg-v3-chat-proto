import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { language, languageId } from './language';
import type { strength, strengthId } from './strength';

export interface strength_t9nAttributes {
  id: string;
  language_code?: string;
  name?: string;
  strength?: string;
}

export type strength_t9nPk = "id";
export type strength_t9nId = strength_t9n[strength_t9nPk];
export type strength_t9nOptionalAttributes = "language_code" | "name" | "strength";
export type strength_t9nCreationAttributes = Optional<strength_t9nAttributes, strength_t9nOptionalAttributes>;

export class strength_t9n extends Model<strength_t9nAttributes, strength_t9nCreationAttributes> implements strength_t9nAttributes {
  id!: string;
  language_code?: string;
  name?: string;
  strength?: string;

  // strength_t9n belongsTo language via language_code
  language_code_language!: language;
  getLanguage_code_language!: Sequelize.BelongsToGetAssociationMixin<language>;
  setLanguage_code_language!: Sequelize.BelongsToSetAssociationMixin<language, languageId>;
  createLanguage_code_language!: Sequelize.BelongsToCreateAssociationMixin<language>;
  // strength_t9n belongsTo strength via strength
  strength_strength!: strength;
  getStrength_strength!: Sequelize.BelongsToGetAssociationMixin<strength>;
  setStrength_strength!: Sequelize.BelongsToSetAssociationMixin<strength, strengthId>;
  createStrength_strength!: Sequelize.BelongsToCreateAssociationMixin<strength>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_t9n {
    return strength_t9n.init({
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
    strength: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strength_t9n',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_t9n_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
