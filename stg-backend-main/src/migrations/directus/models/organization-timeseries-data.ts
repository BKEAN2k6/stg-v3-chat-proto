import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { organization, organizationId } from './organization';

export interface organization_timeseries_dataAttributes {
  date_created?: Date;
  id: string;
  organization: string;
  total_strengths_seen_in_org_at_date?: number;
  total_strengths_seen_in_org_to_date?: number;
  total_strengths_seen_in_others_at_date?: number;
  total_strengths_seen_in_others_to_date?: number;
  total_strengths_seen_in_selfs_at_date?: number;
  total_strengths_seen_in_selfs_to_date?: number;
}

export type organization_timeseries_dataPk = "id";
export type organization_timeseries_dataId = organization_timeseries_data[organization_timeseries_dataPk];
export type organization_timeseries_dataOptionalAttributes = "date_created" | "total_strengths_seen_in_org_at_date" | "total_strengths_seen_in_org_to_date" | "total_strengths_seen_in_others_at_date" | "total_strengths_seen_in_others_to_date" | "total_strengths_seen_in_selfs_at_date" | "total_strengths_seen_in_selfs_to_date";
export type organization_timeseries_dataCreationAttributes = Optional<organization_timeseries_dataAttributes, organization_timeseries_dataOptionalAttributes>;

export class organization_timeseries_data extends Model<organization_timeseries_dataAttributes, organization_timeseries_dataCreationAttributes> implements organization_timeseries_dataAttributes {
  date_created?: Date;
  id!: string;
  organization!: string;
  total_strengths_seen_in_org_at_date?: number;
  total_strengths_seen_in_org_to_date?: number;
  total_strengths_seen_in_others_at_date?: number;
  total_strengths_seen_in_others_to_date?: number;
  total_strengths_seen_in_selfs_at_date?: number;
  total_strengths_seen_in_selfs_to_date?: number;

  // organization_timeseries_data belongsTo organization via organization
  organization_organization!: organization;
  getOrganization_organization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setOrganization_organization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createOrganization_organization!: Sequelize.BelongsToCreateAssociationMixin<organization>;

  static initModel(sequelize: Sequelize.Sequelize): typeof organization_timeseries_data {
    return organization_timeseries_data.init({
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    organization: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    total_strengths_seen_in_org_at_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_strengths_seen_in_org_to_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_strengths_seen_in_others_at_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_strengths_seen_in_others_to_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_strengths_seen_in_selfs_at_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    total_strengths_seen_in_selfs_to_date: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'organization_timeseries_data',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "organization_timeseries_data_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
