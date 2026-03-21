import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { swl_item, swl_itemId } from './swl-item';

export interface swl_promotionAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  key: string;
  sort?: number;
  status: string;
  swl_item: string;
  user_created?: string;
  user_updated?: string;
}

export type swl_promotionPk = "id";
export type swl_promotionId = swl_promotion[swl_promotionPk];
export type swl_promotionOptionalAttributes = "date_created" | "date_updated" | "key" | "sort" | "status" | "user_created" | "user_updated";
export type swl_promotionCreationAttributes = Optional<swl_promotionAttributes, swl_promotionOptionalAttributes>;

export class swl_promotion extends Model<swl_promotionAttributes, swl_promotionCreationAttributes> implements swl_promotionAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  key!: string;
  sort?: number;
  status!: string;
  swl_item!: string;
  user_created?: string;
  user_updated?: string;

  // swl_promotion belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_promotion belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_promotion belongsTo swl_item via swl_item
  swl_item_swl_item!: swl_item;
  getSwl_item_swl_item!: Sequelize.BelongsToGetAssociationMixin<swl_item>;
  setSwl_item_swl_item!: Sequelize.BelongsToSetAssociationMixin<swl_item, swl_itemId>;
  createSwl_item_swl_item!: Sequelize.BelongsToCreateAssociationMixin<swl_item>;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_promotion {
    return swl_promotion.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      unique: "swl_promotion_key_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "draft"
    },
    swl_item: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'swl_item',
        key: 'id'
      }
    },
    user_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    user_updated: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'swl_promotion',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_promotion_key_unique",
        unique: true,
        fields: [
          { name: "key" },
        ]
      },
      {
        name: "swl_promotion_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
