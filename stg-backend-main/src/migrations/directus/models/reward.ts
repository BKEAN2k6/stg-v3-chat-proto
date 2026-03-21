import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { granted_reward, granted_rewardId } from './granted-reward';

export interface rewardAttributes {
  credits_granted?: number;
  date_created?: Date;
  date_updated?: Date;
  grant_frequency?: string;
  id: string;
  slug?: string;
  times_granted?: number;
  user_created?: string;
  user_updated?: string;
}

export type rewardPk = "id";
export type rewardId = reward[rewardPk];
export type rewardOptionalAttributes = "credits_granted" | "date_created" | "date_updated" | "grant_frequency" | "slug" | "times_granted" | "user_created" | "user_updated";
export type rewardCreationAttributes = Optional<rewardAttributes, rewardOptionalAttributes>;

export class reward extends Model<rewardAttributes, rewardCreationAttributes> implements rewardAttributes {
  credits_granted?: number;
  date_created?: Date;
  date_updated?: Date;
  grant_frequency?: string;
  id!: string;
  slug?: string;
  times_granted?: number;
  user_created?: string;
  user_updated?: string;

  // reward belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // reward belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // reward hasMany granted_reward via reward
  granted_rewards!: granted_reward[];
  getGranted_rewards!: Sequelize.HasManyGetAssociationsMixin<granted_reward>;
  setGranted_rewards!: Sequelize.HasManySetAssociationsMixin<granted_reward, granted_rewardId>;
  addGranted_reward!: Sequelize.HasManyAddAssociationMixin<granted_reward, granted_rewardId>;
  addGranted_rewards!: Sequelize.HasManyAddAssociationsMixin<granted_reward, granted_rewardId>;
  createGranted_reward!: Sequelize.HasManyCreateAssociationMixin<granted_reward>;
  removeGranted_reward!: Sequelize.HasManyRemoveAssociationMixin<granted_reward, granted_rewardId>;
  removeGranted_rewards!: Sequelize.HasManyRemoveAssociationsMixin<granted_reward, granted_rewardId>;
  hasGranted_reward!: Sequelize.HasManyHasAssociationMixin<granted_reward, granted_rewardId>;
  hasGranted_rewards!: Sequelize.HasManyHasAssociationsMixin<granted_reward, granted_rewardId>;
  countGranted_rewards!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof reward {
    return reward.init({
    credits_granted: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    grant_frequency: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "reward_slug_unique"
    },
    times_granted: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    tableName: 'reward',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "reward_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "reward_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
