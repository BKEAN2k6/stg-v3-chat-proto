import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { group, groupId } from './group';
import type { strength_session_new_player, strength_session_new_playerId } from './strength-session-new-player';
import type { strength_session_new_status, strength_session_new_statusId } from './strength-session-new-status';
import type { strength_session_new_strength, strength_session_new_strengthId } from './strength-session-new-strength';
import type { strength_session_strength, strength_session_strengthId } from './strength-session-strength';
import type { swl_moment, swl_momentId } from './swl-moment';

export interface strength_sessionAttributes {
  date_created?: Date;
  date_updated?: Date;
  group?: string;
  id: string;
  mode: string;
  rooms?: object;
  sort?: number;
  status?: string;
  user_created?: string;
  user_updated?: string;
}

export type strength_sessionPk = "id";
export type strength_sessionId = strength_session[strength_sessionPk];
export type strength_sessionOptionalAttributes = "date_created" | "date_updated" | "group" | "mode" | "rooms" | "sort" | "status" | "user_created" | "user_updated";
export type strength_sessionCreationAttributes = Optional<strength_sessionAttributes, strength_sessionOptionalAttributes>;

export class strength_session extends Model<strength_sessionAttributes, strength_sessionCreationAttributes> implements strength_sessionAttributes {
  date_created?: Date;
  date_updated?: Date;
  group?: string;
  id!: string;
  mode!: string;
  rooms?: object;
  sort?: number;
  status?: string;
  user_created?: string;
  user_updated?: string;

  // strength_session belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength_session belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // strength_session belongsTo group via group
  group_group!: group;
  getGroup_group!: Sequelize.BelongsToGetAssociationMixin<group>;
  setGroup_group!: Sequelize.BelongsToSetAssociationMixin<group, groupId>;
  createGroup_group!: Sequelize.BelongsToCreateAssociationMixin<group>;
  // strength_session hasMany directus_users via active_strength_session
  directus_users!: directus_users[];
  getDirectus_users!: Sequelize.HasManyGetAssociationsMixin<directus_users>;
  setDirectus_users!: Sequelize.HasManySetAssociationsMixin<directus_users, directus_usersId>;
  addDirectus_user!: Sequelize.HasManyAddAssociationMixin<directus_users, directus_usersId>;
  addDirectus_users!: Sequelize.HasManyAddAssociationsMixin<directus_users, directus_usersId>;
  createDirectus_user!: Sequelize.HasManyCreateAssociationMixin<directus_users>;
  removeDirectus_user!: Sequelize.HasManyRemoveAssociationMixin<directus_users, directus_usersId>;
  removeDirectus_users!: Sequelize.HasManyRemoveAssociationsMixin<directus_users, directus_usersId>;
  hasDirectus_user!: Sequelize.HasManyHasAssociationMixin<directus_users, directus_usersId>;
  hasDirectus_users!: Sequelize.HasManyHasAssociationsMixin<directus_users, directus_usersId>;
  countDirectus_users!: Sequelize.HasManyCountAssociationsMixin;
  // strength_session hasMany strength_session_new_player via strength_session
  strength_session_new_players!: strength_session_new_player[];
  getStrength_session_new_players!: Sequelize.HasManyGetAssociationsMixin<strength_session_new_player>;
  setStrength_session_new_players!: Sequelize.HasManySetAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  addStrength_session_new_player!: Sequelize.HasManyAddAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  addStrength_session_new_players!: Sequelize.HasManyAddAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  createStrength_session_new_player!: Sequelize.HasManyCreateAssociationMixin<strength_session_new_player>;
  removeStrength_session_new_player!: Sequelize.HasManyRemoveAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  removeStrength_session_new_players!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  hasStrength_session_new_player!: Sequelize.HasManyHasAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  hasStrength_session_new_players!: Sequelize.HasManyHasAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  countStrength_session_new_players!: Sequelize.HasManyCountAssociationsMixin;
  // strength_session hasMany strength_session_new_status via strength_session
  strength_session_new_statuses!: strength_session_new_status[];
  getStrength_session_new_statuses!: Sequelize.HasManyGetAssociationsMixin<strength_session_new_status>;
  setStrength_session_new_statuses!: Sequelize.HasManySetAssociationsMixin<strength_session_new_status, strength_session_new_statusId>;
  addStrength_session_new_status!: Sequelize.HasManyAddAssociationMixin<strength_session_new_status, strength_session_new_statusId>;
  addStrength_session_new_statuses!: Sequelize.HasManyAddAssociationsMixin<strength_session_new_status, strength_session_new_statusId>;
  createStrength_session_new_status!: Sequelize.HasManyCreateAssociationMixin<strength_session_new_status>;
  removeStrength_session_new_status!: Sequelize.HasManyRemoveAssociationMixin<strength_session_new_status, strength_session_new_statusId>;
  removeStrength_session_new_statuses!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_new_status, strength_session_new_statusId>;
  hasStrength_session_new_status!: Sequelize.HasManyHasAssociationMixin<strength_session_new_status, strength_session_new_statusId>;
  hasStrength_session_new_statuses!: Sequelize.HasManyHasAssociationsMixin<strength_session_new_status, strength_session_new_statusId>;
  countStrength_session_new_statuses!: Sequelize.HasManyCountAssociationsMixin;
  // strength_session hasMany strength_session_new_strength via strength_session
  strength_session_new_strengths!: strength_session_new_strength[];
  getStrength_session_new_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_new_strength>;
  setStrength_session_new_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  addStrength_session_new_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  addStrength_session_new_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  createStrength_session_new_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_new_strength>;
  removeStrength_session_new_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  removeStrength_session_new_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  hasStrength_session_new_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_new_strength, strength_session_new_strengthId>;
  hasStrength_session_new_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_new_strength, strength_session_new_strengthId>;
  countStrength_session_new_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // strength_session hasMany strength_session_strength via strength_session
  strength_session_strengths!: strength_session_strength[];
  getStrength_session_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_strength>;
  setStrength_session_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  createStrength_session_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_strength>;
  removeStrength_session_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_strength, strength_session_strengthId>;
  removeStrength_session_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  countStrength_session_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // strength_session hasMany swl_moment via strength_session
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

  static initModel(sequelize: Sequelize.Sequelize): typeof strength_session {
    return strength_session.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
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
    mode: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    rooms: {
      type: DataTypes.JSON,
      allowNull: true
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "started"
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
    tableName: 'strength_session',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "strength_session_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
