import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_dashboards, directus_dashboardsId } from './directus-dashboards';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_panelsAttributes {
  id: string;
  dashboard: string;
  name?: string;
  icon?: string;
  color?: string;
  show_header: boolean;
  note?: string;
  type: string;
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  options?: object;
  date_created?: Date;
  user_created?: string;
}

export type directus_panelsPk = "id";
export type directus_panelsId = directus_panels[directus_panelsPk];
export type directus_panelsOptionalAttributes = "name" | "icon" | "color" | "note" | "options" | "date_created" | "user_created";
export type directus_panelsCreationAttributes = Optional<directus_panelsAttributes, directus_panelsOptionalAttributes>;

export class directus_panels extends Model<directus_panelsAttributes, directus_panelsCreationAttributes> implements directus_panelsAttributes {
  id!: string;
  dashboard!: string;
  name?: string;
  icon?: string;
  color?: string;
  show_header!: boolean;
  note?: string;
  type!: string;
  position_x!: number;
  position_y!: number;
  width!: number;
  height!: number;
  options?: object;
  date_created?: Date;
  user_created?: string;

  // directus_panels belongsTo directus_dashboards via dashboard
  dashboard_directus_dashboard!: directus_dashboards;
  getDashboard_directus_dashboard!: Sequelize.BelongsToGetAssociationMixin<directus_dashboards>;
  setDashboard_directus_dashboard!: Sequelize.BelongsToSetAssociationMixin<directus_dashboards, directus_dashboardsId>;
  createDashboard_directus_dashboard!: Sequelize.BelongsToCreateAssociationMixin<directus_dashboards>;
  // directus_panels belongsTo directus_users via user_created
  user_created_directus_user!: directus_users;
  getUser_created_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setUser_created_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createUser_created_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_panels {
    return directus_panels.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    dashboard: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_dashboards',
        key: 'id'
      }
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    icon: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "NULL"
    },
    color: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    show_header: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    position_x: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position_y: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
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
    }
  }, {
    sequelize,
    tableName: 'directus_panels',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_panels_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
