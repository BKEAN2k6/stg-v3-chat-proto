import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_activity, directus_activityId } from './directus-activity';

export interface directus_revisionsAttributes {
  id: number;
  activity: number;
  collection: string;
  item: string;
  data?: object;
  delta?: object;
  parent?: number;
}

export type directus_revisionsPk = "id";
export type directus_revisionsId = directus_revisions[directus_revisionsPk];
export type directus_revisionsOptionalAttributes = "id" | "data" | "delta" | "parent";
export type directus_revisionsCreationAttributes = Optional<directus_revisionsAttributes, directus_revisionsOptionalAttributes>;

export class directus_revisions extends Model<directus_revisionsAttributes, directus_revisionsCreationAttributes> implements directus_revisionsAttributes {
  id!: number;
  activity!: number;
  collection!: string;
  item!: string;
  data?: object;
  delta?: object;
  parent?: number;

  // directus_revisions belongsTo directus_activity via activity
  activity_directus_activity!: directus_activity;
  getActivity_directus_activity!: Sequelize.BelongsToGetAssociationMixin<directus_activity>;
  setActivity_directus_activity!: Sequelize.BelongsToSetAssociationMixin<directus_activity, directus_activityId>;
  createActivity_directus_activity!: Sequelize.BelongsToCreateAssociationMixin<directus_activity>;
  // directus_revisions belongsTo directus_revisions via parent
  parent_directus_revision!: directus_revisions;
  getParent_directus_revision!: Sequelize.BelongsToGetAssociationMixin<directus_revisions>;
  setParent_directus_revision!: Sequelize.BelongsToSetAssociationMixin<directus_revisions, directus_revisionsId>;
  createParent_directus_revision!: Sequelize.BelongsToCreateAssociationMixin<directus_revisions>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_revisions {
    return directus_revisions.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    activity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'directus_activity',
        key: 'id'
      }
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    delta: {
      type: DataTypes.JSON,
      allowNull: true
    },
    parent: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'directus_revisions',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'directus_revisions',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_revisions_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
