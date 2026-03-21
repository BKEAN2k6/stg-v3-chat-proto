import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';
import type { organization, organizationId } from './organization';

export interface user_to_organizationAttributes {
  date_created?: Date;
  id: string;
  inviter?: string;
  last_dashboard_access?: Date;
  organization: string;
  role?: string;
  user: string;
}

export type user_to_organizationPk = "id";
export type user_to_organizationId = user_to_organization[user_to_organizationPk];
export type user_to_organizationOptionalAttributes = "date_created" | "inviter" | "last_dashboard_access" | "role";
export type user_to_organizationCreationAttributes = Optional<user_to_organizationAttributes, user_to_organizationOptionalAttributes>;

export class user_to_organization extends Model<user_to_organizationAttributes, user_to_organizationCreationAttributes> implements user_to_organizationAttributes {
  date_created?: Date;
  id!: string;
  inviter?: string;
  last_dashboard_access?: Date;
  organization!: string;
  role?: string;
  user!: string;

  // user_to_organization belongsTo directus_users via inviter
  inviter_directus_user!: directus_users;
  getInviter_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setInviter_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createInviter_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // user_to_organization belongsTo directus_users via user
  user_directus_user!: directus_users;
  getUser_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // user_to_organization belongsTo organization via organization
  organization_organization!: organization;
  getOrganization_organization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization_organization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization_organization!: Sequelize.BelongsToCreateAssociationMixin<organization>;

  static initModel(sequelize: Sequelize.Sequelize): typeof user_to_organization {
    return user_to_organization.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    inviter: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    last_dashboard_access: {
      type: DataTypes.DATE,
      allowNull: true
    },
    organization: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    role: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "member"
    },
    user: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'user_to_organization',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "user_to_organization_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
