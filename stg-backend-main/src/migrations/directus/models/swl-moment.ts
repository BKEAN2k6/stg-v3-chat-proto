import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { strength_session, strength_sessionId } from './strength-session';
import type { swl_item, swl_itemId } from './swl-item';
import type { swl_moment_to_file, swl_moment_to_fileId } from './swl-moment-to-file';
import type { swl_moment_to_strength, swl_moment_to_strengthId } from './swl-moment-to-strength';

export interface swl_momentAttributes {
  created_by?: string;
  date_created?: Date;
  date_updated?: Date;
  from_strengths_onboarding?: boolean;
  id: string;
  markdown_content?: string;
  sort?: number;
  status: string;
  swl_item: string;
  user_created?: string;
  user_updated?: string;
  peek_access_token?: string;
  peek_accessed_at?: Date;
  strength_session?: string;
}

export type swl_momentPk = "id";
export type swl_momentId = swl_moment[swl_momentPk];
export type swl_momentOptionalAttributes = "created_by" | "date_created" | "date_updated" | "from_strengths_onboarding" | "markdown_content" | "sort" | "status" | "user_created" | "user_updated" | "peek_access_token" | "peek_accessed_at" | "strength_session";
export type swl_momentCreationAttributes = Optional<swl_momentAttributes, swl_momentOptionalAttributes>;

export class swl_moment extends Model<swl_momentAttributes, swl_momentCreationAttributes> implements swl_momentAttributes {
  created_by?: string;
  date_created?: Date;
  date_updated?: Date;
  from_strengths_onboarding?: boolean;
  id!: string;
  markdown_content?: string;
  sort?: number;
  status!: string;
  swl_item!: string;
  user_created?: string;
  user_updated?: string;
  peek_access_token?: string;
  peek_accessed_at?: Date;
  strength_session?: string;

  // swl_moment belongsTo directus_users via created_by
  created_by_directus_user!: directus_users;
  getCreated_by_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setCreated_by_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createCreated_by_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_moment belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_moment belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // swl_moment belongsTo strength_session via strength_session
  strength_session_strength_session!: strength_session;
  getStrength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setStrength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createStrength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;
  // swl_moment belongsTo swl_item via swl_item
  swl_item_swl_item!: swl_item;
  declare getSwl_item_swl_item: Sequelize.BelongsToGetAssociationMixin<swl_item>;
  setSwl_item_swl_item!: Sequelize.BelongsToSetAssociationMixin<swl_item, swl_itemId>;
  createSwl_item_swl_item!: Sequelize.BelongsToCreateAssociationMixin<swl_item>;
  // swl_moment hasMany swl_moment_to_file via swl_moment
  swl_moment_to_files!: swl_moment_to_file[];
  declare getSwl_moment_to_files: Sequelize.HasManyGetAssociationsMixin<swl_moment_to_file>;
  setSwl_moment_to_files!: Sequelize.HasManySetAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  addSwl_moment_to_file!: Sequelize.HasManyAddAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  addSwl_moment_to_files!: Sequelize.HasManyAddAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  createSwl_moment_to_file!: Sequelize.HasManyCreateAssociationMixin<swl_moment_to_file>;
  removeSwl_moment_to_file!: Sequelize.HasManyRemoveAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  removeSwl_moment_to_files!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  hasSwl_moment_to_file!: Sequelize.HasManyHasAssociationMixin<swl_moment_to_file, swl_moment_to_fileId>;
  hasSwl_moment_to_files!: Sequelize.HasManyHasAssociationsMixin<swl_moment_to_file, swl_moment_to_fileId>;
  countSwl_moment_to_files!: Sequelize.HasManyCountAssociationsMixin;
  // swl_moment hasMany swl_moment_to_strength via swl_moment
  swl_moment_to_strengths!: swl_moment_to_strength[];
  declare getSwl_moment_to_strengths: Sequelize.HasManyGetAssociationsMixin<swl_moment_to_strength>;
  setSwl_moment_to_strengths!: Sequelize.HasManySetAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  addSwl_moment_to_strength!: Sequelize.HasManyAddAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  addSwl_moment_to_strengths!: Sequelize.HasManyAddAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  createSwl_moment_to_strength!: Sequelize.HasManyCreateAssociationMixin<swl_moment_to_strength>;
  removeSwl_moment_to_strength!: Sequelize.HasManyRemoveAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  removeSwl_moment_to_strengths!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  hasSwl_moment_to_strength!: Sequelize.HasManyHasAssociationMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  hasSwl_moment_to_strengths!: Sequelize.HasManyHasAssociationsMixin<swl_moment_to_strength, swl_moment_to_strengthId>;
  countSwl_moment_to_strengths!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_moment {
    return swl_moment.init({
    created_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    from_strengths_onboarding: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    markdown_content: {
      type: DataTypes.TEXT,
      allowNull: true
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
    },
    peek_access_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "swl_moment_peek_access_token_unique"
    },
    peek_accessed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    strength_session: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'swl_moment',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_moment_peek_access_token_unique",
        unique: true,
        fields: [
          { name: "peek_access_token" },
        ]
      },
      {
        name: "swl_moment_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
