import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface strengths_valley_stateAttributes {
  data?: object;
  id: string;
}

export type strengths_valley_statePk = "id";
export type strengths_valley_stateId = strengths_valley_state[strengths_valley_statePk];
export type strengths_valley_stateOptionalAttributes = "data";
export type strengths_valley_stateCreationAttributes = Optional<strengths_valley_stateAttributes, strengths_valley_stateOptionalAttributes>;

export class strengths_valley_state extends Model<strengths_valley_stateAttributes, strengths_valley_stateCreationAttributes> implements strengths_valley_stateAttributes {
  data?: object;
  id!: string;


  static initModel(sequelize: Sequelize.Sequelize): typeof strengths_valley_state {
    return strengths_valley_state.init({
    data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'strengths_valley_state',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strengths_valley_state_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
