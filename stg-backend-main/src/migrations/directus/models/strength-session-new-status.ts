import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { strength_session, strength_sessionId } from './strength-session';

export interface strength_session_new_statusAttributes {
  date_created?: Date;
  id: string;
  new_status?: string;
  strength_session?: string;
}

export type strength_session_new_statusPk = "id";
export type strength_session_new_statusId = strength_session_new_status[strength_session_new_statusPk];
export type strength_session_new_statusOptionalAttributes = "date_created" | "new_status" | "strength_session";
export type strength_session_new_statusCreationAttributes = Optional<strength_session_new_statusAttributes, strength_session_new_statusOptionalAttributes>;

export class strength_session_new_status extends Model<strength_session_new_statusAttributes, strength_session_new_statusCreationAttributes> implements strength_session_new_statusAttributes {
  date_created?: Date;
  id!: string;
  new_status?: string;
  strength_session?: string;

  // strength_session_new_status belongsTo strength_session via strength_session
  strength_session_strength_session!: strength_session;
  getStrength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setStrength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createStrength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_session_new_status {
    return strength_session_new_status.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    new_status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    strength_session: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'strength_session_new_status',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_session_new_status_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
