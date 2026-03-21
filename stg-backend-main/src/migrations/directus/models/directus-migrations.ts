import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';

export interface directus_migrationsAttributes {
  version: string;
  name: string;
  timestamp?: Date;
}

export type directus_migrationsPk = "version";
export type directus_migrationsId = directus_migrations[directus_migrationsPk];
export type directus_migrationsOptionalAttributes = "timestamp";
export type directus_migrationsCreationAttributes = Optional<directus_migrationsAttributes, directus_migrationsOptionalAttributes>;

export class directus_migrations extends Model<directus_migrationsAttributes, directus_migrationsCreationAttributes> implements directus_migrationsAttributes {
  version!: string;
  name!: string;
  timestamp?: Date;


  static initModel(sequelize: Sequelize.Sequelize): typeof directus_migrations {
    return directus_migrations.init({
    version: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'directus_migrations',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_migrations_pkey",
        unique: true,
        fields: [
          { name: "version" },
        ]
      },
    ]
  });
  }
}
