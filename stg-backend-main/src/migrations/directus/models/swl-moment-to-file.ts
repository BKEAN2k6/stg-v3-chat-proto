import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { directus_files, directus_filesId } from './directus-files';
import type { swl_moment, swl_momentId } from './swl-moment';

export interface swl_moment_to_fileAttributes {
  directus_files: string;
  id: string;
  swl_moment: string;
}

export type swl_moment_to_filePk = "id";
export type swl_moment_to_fileId = swl_moment_to_file[swl_moment_to_filePk];
export type swl_moment_to_fileCreationAttributes = swl_moment_to_fileAttributes;

export class swl_moment_to_file extends Model<swl_moment_to_fileAttributes, swl_moment_to_fileCreationAttributes> implements swl_moment_to_fileAttributes {
  directus_files!: string;
  id!: string;
  swl_moment!: string;

  // swl_moment_to_file belongsTo directus_files via directus_files
  directus_files_directus_file!: directus_files;
  declare getDirectus_files_directus_file: Sequelize.BelongsToGetAssociationMixin<directus_files>;
  setDirectus_files_directus_file!: Sequelize.BelongsToSetAssociationMixin<directus_files, directus_filesId>;
  createDirectus_files_directus_file!: Sequelize.BelongsToCreateAssociationMixin<directus_files>;
  // swl_moment_to_file belongsTo swl_moment via swl_moment
  swl_moment_swl_moment!: swl_moment;
  getSwl_moment_swl_moment!: Sequelize.BelongsToGetAssociationMixin<swl_moment>;
  setSwl_moment_swl_moment!: Sequelize.BelongsToSetAssociationMixin<swl_moment, swl_momentId>;
  createSwl_moment_swl_moment!: Sequelize.BelongsToCreateAssociationMixin<swl_moment>;

  static initModel(sequelize: Sequelize.Sequelize): typeof swl_moment_to_file {
    return swl_moment_to_file.init({
    directus_files: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'directus_files',
        key: 'id'
      }
    },
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    swl_moment: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'swl_moment',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'swl_moment_to_file',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "swl_moment_to_file_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
  }
}
