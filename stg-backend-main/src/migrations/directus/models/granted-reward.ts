import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { reward, rewardId } from './reward';

export interface granted_rewardAttributes {
  date_created?: Date;
  id: string;
  reward?: string;
  user: string;
  user_created?: string;
}

export type granted_rewardPk = "id";
export type granted_rewardId = granted_reward[granted_rewardPk];
export type granted_rewardOptionalAttributes = "date_created" | "reward" | "user_created";
export type granted_rewardCreationAttributes = Optional<granted_rewardAttributes, granted_rewardOptionalAttributes>;

export class granted_reward extends Model<granted_rewardAttributes, granted_rewardCreationAttributes> implements granted_rewardAttributes {
  date_created?: Date;
  id!: string;
  reward?: string;
  user!: string;
  user_created?: string;

  // granted_reward belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // granted_reward belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // granted_reward belongsTo reward via reward
  reward_reward!: reward;
  getReward_reward!: Sequelize.BelongsToGetAssociationMixin<reward>;
  setReward_reward!: Sequelize.BelongsToSetAssociationMixin<reward, rewardId>;
  createReward_reward!: Sequelize.BelongsToCreateAssociationMixin<reward>;

  static initModel(sequelize: Sequelize.Sequelize): typeof granted_reward {
    return granted_reward.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    reward: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'reward',
        key: 'id'
      }
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_users',
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
    }
  }, {
    sequelize,
    tableName: 'granted_reward',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "granted_reward_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
