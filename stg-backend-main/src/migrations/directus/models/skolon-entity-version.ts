import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface skolon_entity_versionAttributes {
  date_created?: Date;
  date_updated?: Date;
  entity: string;
  id: string;
  sort?: number;
  user_created?: string;
  user_updated?: string;
  version: number;
}

export type skolon_entity_versionPk = "id";
export type skolon_entity_versionId = skolon_entity_version[skolon_entity_versionPk];
export type skolon_entity_versionOptionalAttributes = "date_created" | "date_updated" | "entity" | "sort" | "user_created" | "user_updated" | "version";
export type skolon_entity_versionCreationAttributes = Optional<skolon_entity_versionAttributes, skolon_entity_versionOptionalAttributes>;

export class skolon_entity_version extends Model<skolon_entity_versionAttributes, skolon_entity_versionCreationAttributes> implements skolon_entity_versionAttributes {
  date_created?: Date;
  date_updated?: Date;
  entity!: string;
  id!: string;
  sort?: number;
  user_created?: string;
  user_updated?: string;
  version!: number;

  // skolon_entity_version belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // skolon_entity_version belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof skolon_entity_version {
    return skolon_entity_version.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    date_updated: {
      type: DataTypes.DATE,
      allowNull: true
    },
    entity: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      unique: "skolon_entity_version_entity_unique"
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
    version: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'skolon_entity_version',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "skolon_entity_version_entity_unique",
        unique: true,
        fields: [
          { name: "entity" },
        ]
      },
      {
        name: "skolon_entity_version_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
