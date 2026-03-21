import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_collections, directus_collectionsId } from './directus-collections';
import type { directus_roles, directus_rolesId } from './directus-roles';
import type { directus_sessions, directus_sessionsId } from './directus-sessions';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_sharesAttributes {
  id: string;
  name?: string;
  collection: string;
  item: string;
  role?: string;
  password?: string;
  user_created?: string;
  date_created?: Date;
  date_start?: Date;
  date_end?: Date;
  times_used?: number;
  max_uses?: number;
}

export type directus_sharesPk = "id";
export type directus_sharesId = directus_shares[directus_sharesPk];
export type directus_sharesOptionalAttributes = "name" | "role" | "password" | "user_created" | "date_created" | "date_start" | "date_end" | "times_used" | "max_uses";
export type directus_sharesCreationAttributes = Optional<directus_sharesAttributes, directus_sharesOptionalAttributes>;

export class directus_shares extends Model<directus_sharesAttributes, directus_sharesCreationAttributes> implements directus_sharesAttributes {
  id!: string;
  name?: string;
  collection!: string;
  item!: string;
  role?: string;
  password?: string;
  user_created?: string;
  date_created?: Date;
  date_start?: Date;
  date_end?: Date;
  times_used?: number;
  max_uses?: number;

  // directus_shares belongsTo directus_collections via collection
  collection_directus_collection!: directus_collections;
  getCollection_directus_collection!: Sequelize.BelongsToGetAssociationMixin<directus_collections>;
  setCollection_directus_collection!: Sequelize.BelongsToSetAssociationMixin<directus_collections, directus_collectionsId>;
  createCollection_directus_collection!: Sequelize.BelongsToCreateAssociationMixin<directus_collections>;
  // directus_shares belongsTo directus_roles via role
  role_directus_role!: directus_roles;
  getRole_directus_role!: Sequelize.BelongsToGetAssociationMixin<directus_roles>;
  setRole_directus_role!: Sequelize.BelongsToSetAssociationMixin<directus_roles, directus_rolesId>;
  createRole_directus_role!: Sequelize.BelongsToCreateAssociationMixin<directus_roles>;
  // directus_shares hasMany directus_sessions via share
  directus_sessions!: directus_sessions[];
  getDirectus_sessions!: Sequelize.HasManyGetAssociationsMixin<directus_sessions>;
  setDirectus_sessions!: Sequelize.HasManySetAssociationsMixin<directus_sessions, directus_sessionsId>;
  addDirectus_session!: Sequelize.HasManyAddAssociationMixin<directus_sessions, directus_sessionsId>;
  addDirectus_sessions!: Sequelize.HasManyAddAssociationsMixin<directus_sessions, directus_sessionsId>;
  createDirectus_session!: Sequelize.HasManyCreateAssociationMixin<directus_sessions>;
  removeDirectus_session!: Sequelize.HasManyRemoveAssociationMixin<directus_sessions, directus_sessionsId>;
  removeDirectus_sessions!: Sequelize.HasManyRemoveAssociationsMixin<directus_sessions, directus_sessionsId>;
  hasDirectus_session!: Sequelize.HasManyHasAssociationMixin<directus_sessions, directus_sessionsId>;
  hasDirectus_sessions!: Sequelize.HasManyHasAssociationsMixin<directus_sessions, directus_sessionsId>;
  countDirectus_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_shares belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_shares {
    return directus_shares.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false,
      references: {
        model: 'directus_collections',
        key: 'collection'
      }
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    role: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_roles',
        key: 'id'
      }
    },
    password: {
      type: DataTypes.STRING(255),
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
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    date_start: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_end: {
      type: DataTypes.DATE,
      allowNull: true
    },
    times_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    max_uses: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_shares',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_shares_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
