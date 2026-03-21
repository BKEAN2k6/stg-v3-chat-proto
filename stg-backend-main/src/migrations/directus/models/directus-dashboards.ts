import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_panels, directus_panelsId } from './directus-panels';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_dashboardsAttributes {
  id: string;
  name: string;
  icon: string;
  note?: string;
  date_created?: Date;
  user_created?: string;
  color?: string;
}

export type directus_dashboardsPk = "id";
export type directus_dashboardsId = directus_dashboards[directus_dashboardsPk];
export type directus_dashboardsOptionalAttributes = "icon" | "note" | "date_created" | "user_created" | "color";
export type directus_dashboardsCreationAttributes = Optional<directus_dashboardsAttributes, directus_dashboardsOptionalAttributes>;

export class directus_dashboards extends Model<directus_dashboardsAttributes, directus_dashboardsCreationAttributes> implements directus_dashboardsAttributes {
  id!: string;
  name!: string;
  icon!: string;
  note?: string;
  date_created?: Date;
  user_created?: string;
  color?: string;

  // directus_dashboards hasMany directus_panels via dashboard
  directus_panels!: directus_panels[];
  getDirectus_panels!: Sequelize.HasManyGetAssociationsMixin<directus_panels>;
  setDirectus_panels!: Sequelize.HasManySetAssociationsMixin<directus_panels, directus_panelsId>;
  addDirectus_panel!: Sequelize.HasManyAddAssociationMixin<directus_panels, directus_panelsId>;
  addDirectus_panels!: Sequelize.HasManyAddAssociationsMixin<directus_panels, directus_panelsId>;
  createDirectus_panel!: Sequelize.HasManyCreateAssociationMixin<directus_panels>;
  removeDirectus_panel!: Sequelize.HasManyRemoveAssociationMixin<directus_panels, directus_panelsId>;
  removeDirectus_panels!: Sequelize.HasManyRemoveAssociationsMixin<directus_panels, directus_panelsId>;
  hasDirectus_panel!: Sequelize.HasManyHasAssociationMixin<directus_panels, directus_panelsId>;
  hasDirectus_panels!: Sequelize.HasManyHasAssociationsMixin<directus_panels, directus_panelsId>;
  countDirectus_panels!: Sequelize.HasManyCountAssociationsMixin;
  // directus_dashboards belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_dashboards {
    return directus_dashboards.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "dashboard"
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    user_created: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_dashboards',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_dashboards_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
