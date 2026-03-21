import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { organization, organizationId } from './organization';
import type { organization_t9n, organization_t9nId } from './organization-t-9-n';
import type { parent_organization_t9n, parent_organization_t9nId } from './parent-organization-t-9-n';
import type { strength_t9n, strength_t9nId } from './strength-t-9-n';
import type { strengths_valley_level_t9n, strengths_valley_level_t9nId } from './strengths-valley-level-t-9-n';
import type { strengths_valley_map_t9n, strengths_valley_map_t9nId } from './strengths-valley-map-t-9-n';
import type { strengths_valley_round_t9n, strengths_valley_round_t9nId } from './strengths-valley-round-t-9-n';
import type { strengths_valley_slide_t9n, strengths_valley_slide_t9nId } from './strengths-valley-slide-t-9-n';
import type { strengths_valley_story_t9n, strengths_valley_story_t9nId } from './strengths-valley-story-t-9-n';

export interface languageAttributes {
  code: string;
  direction?: string;
  name?: string;
  persistent?: boolean;
}

export type languagePk = "code";
export type languageId = language[languagePk];
export type languageOptionalAttributes = "code" | "direction" | "name" | "persistent";
export type languageCreationAttributes = Optional<languageAttributes, languageOptionalAttributes>;

export class language extends Model<languageAttributes, languageCreationAttributes> implements languageAttributes {
  code!: string;
  direction?: string;
  name?: string;
  persistent?: boolean;

  // language hasMany organization via default_language
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
  // language hasMany organization_t9n via language_code
  organization_t9ns!: organization_t9n[];
  getOrganization_t9ns!: Sequelize.HasManyGetAssociationsMixin<organization_t9n>;
  setOrganization_t9ns!: Sequelize.HasManySetAssociationsMixin<organization_t9n, organization_t9nId>;
  addOrganization_t9n!: Sequelize.HasManyAddAssociationMixin<organization_t9n, organization_t9nId>;
  addOrganization_t9ns!: Sequelize.HasManyAddAssociationsMixin<organization_t9n, organization_t9nId>;
  createOrganization_t9n!: Sequelize.HasManyCreateAssociationMixin<organization_t9n>;
  removeOrganization_t9n!: Sequelize.HasManyRemoveAssociationMixin<organization_t9n, organization_t9nId>;
  removeOrganization_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<organization_t9n, organization_t9nId>;
  hasOrganization_t9n!: Sequelize.HasManyHasAssociationMixin<organization_t9n, organization_t9nId>;
  hasOrganization_t9ns!: Sequelize.HasManyHasAssociationsMixin<organization_t9n, organization_t9nId>;
  countOrganization_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany parent_organization_t9n via language_code
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
  // language hasMany strength_t9n via language_code
  strength_t9ns!: strength_t9n[];
  getStrength_t9ns!: Sequelize.HasManyGetAssociationsMixin<strength_t9n>;
  setStrength_t9ns!: Sequelize.HasManySetAssociationsMixin<strength_t9n, strength_t9nId>;
  addStrength_t9n!: Sequelize.HasManyAddAssociationMixin<strength_t9n, strength_t9nId>;
  addStrength_t9ns!: Sequelize.HasManyAddAssociationsMixin<strength_t9n, strength_t9nId>;
  createStrength_t9n!: Sequelize.HasManyCreateAssociationMixin<strength_t9n>;
  removeStrength_t9n!: Sequelize.HasManyRemoveAssociationMixin<strength_t9n, strength_t9nId>;
  removeStrength_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strength_t9n, strength_t9nId>;
  hasStrength_t9n!: Sequelize.HasManyHasAssociationMixin<strength_t9n, strength_t9nId>;
  hasStrength_t9ns!: Sequelize.HasManyHasAssociationsMixin<strength_t9n, strength_t9nId>;
  countStrength_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany strengths_valley_level_t9n via language_code
  strengths_valley_level_t9ns!: strengths_valley_level_t9n[];
  getStrengths_valley_level_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_level_t9n>;
  setStrengths_valley_level_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  addStrengths_valley_level_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  addStrengths_valley_level_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  createStrengths_valley_level_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_level_t9n>;
  removeStrengths_valley_level_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  removeStrengths_valley_level_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  hasStrengths_valley_level_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  hasStrengths_valley_level_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_level_t9n, strengths_valley_level_t9nId>;
  countStrengths_valley_level_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany strengths_valley_map_t9n via language_code
  strengths_valley_map_t9ns!: strengths_valley_map_t9n[];
  getStrengths_valley_map_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_map_t9n>;
  setStrengths_valley_map_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  addStrengths_valley_map_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  addStrengths_valley_map_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  createStrengths_valley_map_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_map_t9n>;
  removeStrengths_valley_map_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  removeStrengths_valley_map_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  hasStrengths_valley_map_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  hasStrengths_valley_map_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_map_t9n, strengths_valley_map_t9nId>;
  countStrengths_valley_map_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany strengths_valley_round_t9n via language_code
  strengths_valley_round_t9ns!: strengths_valley_round_t9n[];
  getStrengths_valley_round_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_round_t9n>;
  setStrengths_valley_round_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  addStrengths_valley_round_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  addStrengths_valley_round_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  createStrengths_valley_round_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_round_t9n>;
  removeStrengths_valley_round_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  removeStrengths_valley_round_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  hasStrengths_valley_round_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  hasStrengths_valley_round_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_round_t9n, strengths_valley_round_t9nId>;
  countStrengths_valley_round_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany strengths_valley_slide_t9n via language_code
  strengths_valley_slide_t9ns!: strengths_valley_slide_t9n[];
  getStrengths_valley_slide_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide_t9n>;
  setStrengths_valley_slide_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  addStrengths_valley_slide_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  addStrengths_valley_slide_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  createStrengths_valley_slide_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide_t9n>;
  removeStrengths_valley_slide_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  removeStrengths_valley_slide_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  hasStrengths_valley_slide_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  hasStrengths_valley_slide_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide_t9n, strengths_valley_slide_t9nId>;
  countStrengths_valley_slide_t9ns!: Sequelize.HasManyCountAssociationsMixin;
  // language hasMany strengths_valley_story_t9n via language_code
  strengths_valley_story_t9ns!: strengths_valley_story_t9n[];
  getStrengths_valley_story_t9ns!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_story_t9n>;
  setStrengths_valley_story_t9ns!: Sequelize.HasManySetAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  addStrengths_valley_story_t9n!: Sequelize.HasManyAddAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  addStrengths_valley_story_t9ns!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  createStrengths_valley_story_t9n!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_story_t9n>;
  removeStrengths_valley_story_t9n!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  removeStrengths_valley_story_t9ns!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  hasStrengths_valley_story_t9n!: Sequelize.HasManyHasAssociationMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  hasStrengths_valley_story_t9ns!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_story_t9n, strengths_valley_story_t9nId>;
  countStrengths_valley_story_t9ns!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof language {
    return language.init({
    code: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL",
      primaryKey: true
    },
    direction: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "ltr"
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'language',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "language_pkey",
        unique: true,
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
  }
}
