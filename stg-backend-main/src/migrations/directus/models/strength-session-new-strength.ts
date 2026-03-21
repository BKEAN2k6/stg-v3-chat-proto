import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { strength_session, strength_sessionId } from './strength-session';
import type { strength_session_strength, strength_session_strengthId } from './strength-session-strength';

export interface strength_session_new_strengthAttributes {
  date_created?: Date;
  id: string;
  strength_session?: string;
  strength_session_strength?: string;
}

export type strength_session_new_strengthPk = "id";
export type strength_session_new_strengthId = strength_session_new_strength[strength_session_new_strengthPk];
export type strength_session_new_strengthOptionalAttributes = "date_created" | "strength_session" | "strength_session_strength";
export type strength_session_new_strengthCreationAttributes = Optional<strength_session_new_strengthAttributes, strength_session_new_strengthOptionalAttributes>;

export class strength_session_new_strength extends Model<strength_session_new_strengthAttributes, strength_session_new_strengthCreationAttributes> implements strength_session_new_strengthAttributes {
  date_created?: Date;
  id!: string;
  strength_session?: string;
  strength_session_strength?: string;

  // strength_session_new_strength belongsTo strength_session via strength_session
  strength_session_strength_session!: strength_session;
  getStrength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setStrength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createStrength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;
  // strength_session_new_strength belongsTo strength_session_strength via strength_session_strength
  strength_session_strength_strength_session_strength!: strength_session_strength;
  getStrength_session_strength_strength_session_strength!: Sequelize.BelongsToGetAssociationMixin<strength_session_strength>;
  setStrength_session_strength_strength_session_strength!: Sequelize.BelongsToSetAssociationMixin<strength_session_strength, strength_session_strengthId>;
  createStrength_session_strength_strength_session_strength!: Sequelize.BelongsToCreateAssociationMixin<strength_session_strength>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_session_new_strength {
    return strength_session_new_strength.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    strength_session: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session',
        key: 'id'
      }
    },
    strength_session_strength: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session_strength',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strength_session_new_strength',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_session_new_strength_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
