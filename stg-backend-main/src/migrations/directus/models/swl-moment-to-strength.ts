import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { strength, strengthId } from './strength';
import type { swl_moment, swl_momentId } from './swl-moment';

export interface swl_moment_to_strengthAttributes {
  id: string;
  strength: string;
  swl_moment: string;
}

export type swl_moment_to_strengthPk = "id";
export type swl_moment_to_strengthId = swl_moment_to_strength[swl_moment_to_strengthPk];
export type swl_moment_to_strengthCreationAttributes = swl_moment_to_strengthAttributes;

export class swl_moment_to_strength extends Model<swl_moment_to_strengthAttributes, swl_moment_to_strengthCreationAttributes> implements swl_moment_to_strengthAttributes {
  id!: string;
  strength!: string;
  swl_moment!: string;

  // swl_moment_to_strength belongsTo strength via strength
  strength_strength!: strength;
  declare getStrength_strength: Sequelize.BelongsToGetAssociationMixin<strength>;
  setStrength_strength!: Sequelize.BelongsToSetAssociationMixin<strength, strengthId>;
  createStrength_strength!: Sequelize.BelongsToCreateAssociationMixin<strength>;
  // swl_moment_to_strength belongsTo swl_moment via swl_moment
  swl_moment_swl_moment!: swl_moment;
  getSwl_moment_swl_moment!: Sequelize.BelongsToGetAssociationMixin<swl_moment>;
  setSwl_moment_swl_moment!: Sequelize.BelongsToSetAssociationMixin<swl_moment, swl_momentId>;
  createSwl_moment_swl_moment!: Sequelize.BelongsToCreateAssociationMixin<swl_moment>;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_moment_to_strength {
    return swl_moment_to_strength.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    strength: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'strength',
        key: 'id'
      }
    },
    swl_moment: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'swl_moment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'swl_moment_to_strength',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_moment_to_strength_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
