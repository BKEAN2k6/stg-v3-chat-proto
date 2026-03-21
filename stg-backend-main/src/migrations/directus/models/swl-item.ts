import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { swl_item_to_swl_wall, swl_item_to_swl_wallId } from './swl-item-to-swl-wall';
import type { swl_moment, swl_momentId } from './swl-moment';
import type { swl_promotion, swl_promotionId } from './swl-promotion';

export interface swl_itemAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  sort?: number;
  type?: string;
  user_created?: string;
  user_updated?: string;
}

export type swl_itemPk = "id";
export type swl_itemId = swl_item[swl_itemPk];
export type swl_itemOptionalAttributes = "date_created" | "date_updated" | "sort" | "type" | "user_created" | "user_updated";
export type swl_itemCreationAttributes = Optional<swl_itemAttributes, swl_itemOptionalAttributes>;

export class swl_item extends Model<swl_itemAttributes, swl_itemCreationAttributes> implements swl_itemAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  sort?: number;
  type?: string;
  user_created?: string;
  user_updated?: string;

  // swl_item belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_item belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_item hasMany swl_item_to_swl_wall via swl_item
  swl_item_to_swl_walls!: swl_item_to_swl_wall[];
  getSwl_item_to_swl_walls!: Sequelize.HasManyGetAssociationsMixin<swl_item_to_swl_wall>;
  setSwl_item_to_swl_walls!: Sequelize.HasManySetAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  addSwl_item_to_swl_wall!: Sequelize.HasManyAddAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  addSwl_item_to_swl_walls!: Sequelize.HasManyAddAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  createSwl_item_to_swl_wall!: Sequelize.HasManyCreateAssociationMixin<swl_item_to_swl_wall>;
  removeSwl_item_to_swl_wall!: Sequelize.HasManyRemoveAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  removeSwl_item_to_swl_walls!: Sequelize.HasManyRemoveAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  hasSwl_item_to_swl_wall!: Sequelize.HasManyHasAssociationMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  hasSwl_item_to_swl_walls!: Sequelize.HasManyHasAssociationsMixin<swl_item_to_swl_wall, swl_item_to_swl_wallId>;
  countSwl_item_to_swl_walls!: Sequelize.HasManyCountAssociationsMixin;
  // swl_item hasMany swl_moment via swl_item
  swl_moments!: swl_moment[];
  getSwl_moments!: Sequelize.HasManyGetAssociationsMixin<swl_moment>;
  setSwl_moments!: Sequelize.HasManySetAssociationsMixin<swl_moment, swl_momentId>;
  addSwl_moment!: Sequelize.HasManyAddAssociationMixin<swl_moment, swl_momentId>;
  addSwl_moments!: Sequelize.HasManyAddAssociationsMixin<swl_moment, swl_momentId>;
  createSwl_moment!: Sequelize.HasManyCreateAssociationMixin<swl_moment>;
  removeSwl_moment!: Sequelize.HasManyRemoveAssociationMixin<swl_moment, swl_momentId>;
  removeSwl_moments!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment, swl_momentId>;
  hasSwl_moment!: Sequelize.HasManyHasAssociationMixin<swl_moment, swl_momentId>;
  hasSwl_moments!: Sequelize.HasManyHasAssociationsMixin<swl_moment, swl_momentId>;
  countSwl_moments!: Sequelize.HasManyCountAssociationsMixin;
  // swl_item hasMany swl_promotion via swl_item
  swl_promotions!: swl_promotion[];
  getSwl_promotions!: Sequelize.HasManyGetAssociationsMixin<swl_promotion>;
  setSwl_promotions!: Sequelize.HasManySetAssociationsMixin<swl_promotion, swl_promotionId>;
  addSwl_promotion!: Sequelize.HasManyAddAssociationMixin<swl_promotion, swl_promotionId>;
  addSwl_promotions!: Sequelize.HasManyAddAssociationsMixin<swl_promotion, swl_promotionId>;
  createSwl_promotion!: Sequelize.HasManyCreateAssociationMixin<swl_promotion>;
  removeSwl_promotion!: Sequelize.HasManyRemoveAssociationMixin<swl_promotion, swl_promotionId>;
  removeSwl_promotions!: Sequelize.HasManyRemoveAssociationsMixin<swl_promotion, swl_promotionId>;
  hasSwl_promotion!: Sequelize.HasManyHasAssociationMixin<swl_promotion, swl_promotionId>;
  hasSwl_promotions!: Sequelize.HasManyHasAssociationsMixin<swl_promotion, swl_promotionId>;
  countSwl_promotions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_item {
    return swl_item.init({
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
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
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
    tableName: 'swl_item',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_item_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
