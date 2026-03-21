import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface email_delivery_queue_itemAttributes {
  date_created?: Date;
  date_updated?: Date;
  failure_info?: object;
  from_address?: string;
  from_name?: string;
  id: string;
  status?: string;
  template_name?: string;
  template_props?: object;
  to_address?: string;
  user_created?: string;
  user_updated?: string;
}

export type email_delivery_queue_itemPk = "id";
export type email_delivery_queue_itemId = email_delivery_queue_item[email_delivery_queue_itemPk];
export type email_delivery_queue_itemOptionalAttributes = "date_created" | "date_updated" | "failure_info" | "from_address" | "from_name" | "status" | "template_name" | "template_props" | "to_address" | "user_created" | "user_updated";
export type email_delivery_queue_itemCreationAttributes = Optional<email_delivery_queue_itemAttributes, email_delivery_queue_itemOptionalAttributes>;

export class email_delivery_queue_item extends Model<email_delivery_queue_itemAttributes, email_delivery_queue_itemCreationAttributes> implements email_delivery_queue_itemAttributes {
  date_created?: Date;
  date_updated?: Date;
  failure_info?: object;
  from_address?: string;
  from_name?: string;
  id!: string;
  status?: string;
  template_name?: string;
  template_props?: object;
  to_address?: string;
  user_created?: string;
  user_updated?: string;

  // email_delivery_queue_item belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // email_delivery_queue_item belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof email_delivery_queue_item {
    return email_delivery_queue_item.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    failure_info: {
      type: DataTypes.JSON,
      allowNull: true
    },
    from_address: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    from_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "PENDING"
    },
    template_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    template_props: {
      type: DataTypes.JSON,
      allowNull: true
    },
    to_address: {
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
    tableName: 'email_delivery_queue_item',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "email_delivery_queue_item_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
