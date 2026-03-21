import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { organization, organizationId } from './organization';
import type { parent_organization_t9n, parent_organization_t9nId } from './parent-organization-t-9-n';

export interface parent_organizationAttributes {
  date_created?: Date;
  date_updated?: Date;
  id: string;
  persistent?: boolean;
  slug?: string;
  sort?: number;
  status?: string;
  type?: string;
  user_created?: string;
  user_updated?: string;
}

export type parent_organizationPk = "id";
export type parent_organizationId = parent_organization[parent_organizationPk];
export type parent_organizationOptionalAttributes = "date_created" | "date_updated" | "persistent" | "slug" | "sort" | "status" | "type" | "user_created" | "user_updated";
export type parent_organizationCreationAttributes = Optional<parent_organizationAttributes, parent_organizationOptionalAttributes>;

export class parent_organization extends Model<parent_organizationAttributes, parent_organizationCreationAttributes> implements parent_organizationAttributes {
  date_created?: Date;
  date_updated?: Date;
  id!: string;
  persistent?: boolean;
  slug?: string;
  sort?: number;
  status?: string;
  type?: string;
  user_created?: string;
  user_updated?: string;

  // parent_organization belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // parent_organization belongsTo directus_users via user_updated
  user_updated_directus_user!: directus_users;
  getUser_updated_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_updated_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_updated_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // parent_organization hasMany organization via parent_organization
  organizations!: organization[];
  getOrganizations!: Sequelize.HasManyGetAssociationsMixin<organization>;
  setOrganizations!: Sequelize.HasManySetAssociationsMixin<organization, organizationId>;
  addOrganization!: Sequelize.HasManyAddAssociationMixin<organization, organizationId>;
  addOrganizations!: Sequelize.HasManyAddAssociationsMixin<organization, organizationId>;
  createOrganization!: Sequelize.HasManyCreateAssociationMixin<organization>;
  removeOrganization!: Sequelize.HasManyRemoveAssociationMixin<organization, organizationId>;
  removeOrganizations!: Sequelize.HasManyRemoveAssociationsMixin<organization, organizationId>;
  hasOrganization!: Sequelize.HasManyHasAssociationMixin<organization, organizationId>;
  hasOrganizations!: Sequelize.HasManyHasAssociationsMixin<organization, organizationId>;
  countOrganizations!: Sequelize.HasManyCountAssociationsMixin;
  // parent_organization hasMany parent_organization_t9n via parent_organization
  parent_organization_t9ns!: parent_organization_t9n[];
  getParent_organization_t9ns!: Sequelize.HasManyGetAssociationsMixin<parent_organization_t9n>;
  setParent_organization_t9ns!: Sequelize.HasManySetAssociationsMixin<parent_organization_t9n, parent_organization_t9nId>;
  addParent_organization_t9n!: Sequelize.HasManyAddAssociationMixin<parent_organization_t9n, parent_organization_t9nId>;
  addParent_organization_t9ns!: Sequelize.HasManyAddAssociationsMixin<parent_organization_t9n, parent_organization_t9nId>;
  createParent_organization_t9n!: Sequelize.HasManyCreateAssociationMixin<parent_organization_t9n>;
  removeParent_organization_t9n!: Sequelize.HasManyRemoveAssociationMixin<parent_organization_t9n, parent_organization_t9nId>;
  removeParent_organization_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<parent_organization_t9n, parent_organization_t9nId>;
  hasParent_organization_t9n!: Sequelize.HasManyHasAssociationMixin<parent_organization_t9n, parent_organization_t9nId>;
  hasParent_organization_t9ns!: Sequelize.HasManyHasAssociationsMixin<parent_organization_t9n, parent_organization_t9nId>;
  countParent_organization_t9ns!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof parent_organization {
    return parent_organization.init({
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
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "parent_organization_slug_unique"
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "published"
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
    tableName: 'parent_organization',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "parent_organization_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "parent_organization_slug_unique",
        unique: true,
        fields: [
          { name: "slug" },
        ]
      },
    ]
  });
  }
}
