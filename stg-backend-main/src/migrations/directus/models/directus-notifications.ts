import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_users, directus_usersId } from './directus-users';

export interface directus_notificationsAttributes {
  id: number;
  timestamp?: Date;
  status?: string;
  recipient: string;
  sender?: string;
  subject: string;
  message?: string;
  collection?: string;
  item?: string;
}

export type directus_notificationsPk = "id";
export type directus_notificationsId = directus_notifications[directus_notificationsPk];
export type directus_notificationsOptionalAttributes = "id" | "timestamp" | "status" | "sender" | "message" | "collection" | "item";
export type directus_notificationsCreationAttributes = Optional<directus_notificationsAttributes, directus_notificationsOptionalAttributes>;

export class directus_notifications extends Model<directus_notificationsAttributes, directus_notificationsCreationAttributes> implements directus_notificationsAttributes {
  id!: number;
  timestamp?: Date;
  status?: string;
  recipient!: string;
  sender?: string;
  subject!: string;
  message?: string;
  collection?: string;
  item?: string;

  // directus_notifications belongsTo directus_users via recipient
  recipient_directus_user!: directus_users;
  getRecipient_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setRecipient_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createRecipient_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;
  // directus_notifications belongsTo directus_users via sender
  sender_directus_user!: directus_users;
  getSender_directus_user!: Sequelize.BelongsToGetAssociationMixin<directus_users>;
  setSender_directus_user!: Sequelize.BelongsToSetAssociationMixin<directus_users, directus_usersId>;
  createSender_directus_user!: Sequelize.BelongsToCreateAssociationMixin<directus_users>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_notifications {
    return directus_notifications.init({
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "inbox"
    },
    recipient: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    sender: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_users',
        key: 'id'
      }
    },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    collection: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    item: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_notifications',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_notifications_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
