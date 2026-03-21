import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_revisions, directus_revisionsId } from './directus-revisions';

export interface directus_activityAttributes {
  id: number;
  action: string;
  user?: string;
  timestamp: Date;
  ip?: string;
  user_agent?: string;
  collection: string;
  item: string;
  comment?: string;
  origin?: string;
}

export type directus_activityPk = "id";
export type directus_activityId = directus_activity[directus_activityPk];
export type directus_activityOptionalAttributes = "id" | "user" | "timestamp" | "ip" | "user_agent" | "comment" | "origin";
export type directus_activityCreationAttributes = Optional<directus_activityAttributes, directus_activityOptionalAttributes>;

export class directus_activity extends Model<directus_activityAttributes, directus_activityCreationAttributes> implements directus_activityAttributes {
  id!: number;
  action!: string;
  user?: string;
  timestamp!: Date;
  ip?: string;
  user_agent?: string;
  collection!: string;
  item!: string;
  comment?: string;
  origin?: string;

  // directus_activity hasMany directus_revisions via activity
  directus_revisions!: directus_revisions[];
  getDirectus_revisions!: Sequelize.HasManyGetAssociationsMixin<directus_revisions>;
  setDirectus_revisions!: Sequelize.HasManySetAssociationsMixin<directus_revisions, directus_revisionsId>;
  addDirectus_revision!: Sequelize.HasManyAddAssociationMixin<directus_revisions, directus_revisionsId>;
  addDirectus_revisions!: Sequelize.HasManyAddAssociationsMixin<directus_revisions, directus_revisionsId>;
  createDirectus_revision!: Sequelize.HasManyCreateAssociationMixin<directus_revisions>;
  removeDirectus_revision!: Sequelize.HasManyRemoveAssociationMixin<directus_revisions, directus_revisionsId>;
  removeDirectus_revisions!: Sequelize.HasManyRemoveAssociationsMixin<directus_revisions, directus_revisionsId>;
  hasDirectus_revision!: Sequelize.HasManyHasAssociationMixin<directus_revisions, directus_revisionsId>;
  hasDirectus_revisions!: Sequelize.HasManyHasAssociationsMixin<directus_revisions, directus_revisionsId>;
  countDirectus_revisions!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_activity {
    return directus_activity.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    action: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    user: {
      type: DataTypes.UUID,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    ip: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    origin: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_activity',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_activity_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
