import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { group, groupId } from './group';

export interface user_to_groupAttributes {
  date_created?: Date;
  group?: string;
  id: string;
  user?: string;
}

export type user_to_groupPk = "id";
export type user_to_groupId = user_to_group[user_to_groupPk];
export type user_to_groupOptionalAttributes = "date_created" | "group" | "user";
export type user_to_groupCreationAttributes = Optional<user_to_groupAttributes, user_to_groupOptionalAttributes>;

export class user_to_group extends Model<user_to_groupAttributes, user_to_groupCreationAttributes> implements user_to_groupAttributes {
  date_created?: Date;
  group?: string;
  id!: string;
  user?: string;

  // user_to_group belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // user_to_group belongsTo group via group
  group_group!: group;
  getGroup_group!: Sequelize.BelongsToGetAssociationMixin<group>;
  setGroup_group!: Sequelize.BelongsToSetAssociationMixin<group, groupId>;
  createGroup_group!: Sequelize.BelongsToCreateAssociationMixin<group>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_to_group {
    return user_to_group.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    group: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'group',
        key: 'id'
      }
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_to_group',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_to_group_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
