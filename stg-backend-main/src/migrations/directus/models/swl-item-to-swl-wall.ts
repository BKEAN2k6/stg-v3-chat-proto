import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { swl_item, swl_itemId } from './swl-item';
import type { swl_wall, swl_wallId } from './swl-wall';

export interface swl_item_to_swl_wallAttributes {
  date_created: Date;
  id: string;
  params?: object;
  swl_item: string;
  swl_wall: string;
}

export type swl_item_to_swl_wallPk = "id";
export type swl_item_to_swl_wallId = swl_item_to_swl_wall[swl_item_to_swl_wallPk];
export type swl_item_to_swl_wallOptionalAttributes = "params";
export type swl_item_to_swl_wallCreationAttributes = Optional<swl_item_to_swl_wallAttributes, swl_item_to_swl_wallOptionalAttributes>;

export class swl_item_to_swl_wall extends Model<swl_item_to_swl_wallAttributes, swl_item_to_swl_wallCreationAttributes> implements swl_item_to_swl_wallAttributes {
  date_created!: Date;
  id!: string;
  params?: object;
  swl_item!: string;
  swl_wall!: string;

  // swl_item_to_swl_wall belongsTo swl_item via swl_item
  swl_item_swl_item!: swl_item;
  getSwl_item_swl_item!: Sequelize.BelongsToGetAssociationMixin<swl_item>;
  setSwl_item_swl_item!: Sequelize.BelongsToSetAssociationMixin<swl_item, swl_itemId>;
  createSwl_item_swl_item!: Sequelize.BelongsToCreateAssociationMixin<swl_item>;
  // swl_item_to_swl_wall belongsTo swl_wall via swl_wall
  swl_wall_swl_wall!: swl_wall;
  getSwl_wall_swl_wall!: Sequelize.BelongsToGetAssociationMixin<swl_wall>;
  setSwl_wall_swl_wall!: Sequelize.BelongsToSetAssociationMixin<swl_wall, swl_wallId>;
  createSwl_wall_swl_wall!: Sequelize.BelongsToCreateAssociationMixin<swl_wall>;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_item_to_swl_wall {
    return swl_item_to_swl_wall.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: false
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    params: {
      type: DataTypes.JSON,
      allowNull: true
    },
    swl_item: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'swl_item',
        key: 'id'
      }
    },
    swl_wall: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'swl_wall',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'swl_item_to_swl_wall',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_item_to_swl_wall_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
