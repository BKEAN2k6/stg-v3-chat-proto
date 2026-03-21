import * as Sequelize from 'sequelize';
import { DataTypes, Model, Optional } from 'sequelize';
import type { analytics_event, analytics_eventId } from './analytics-event';
import type { analytics_session, analytics_sessionId } from './analytics-session';
import type { directus_dashboards, directus_dashboardsId } from './directus-dashboards';
import type { directus_files, directus_filesId } from './directus-files';
import type { directus_flows, directus_flowsId } from './directus-flows';
import type { directus_folders, directus_foldersId } from './directus-folders';
import type { directus_notifications, directus_notificationsId } from './directus-notifications';
import type { directus_operations, directus_operationsId } from './directus-operations';
import type { directus_panels, directus_panelsId } from './directus-panels';
import type { directus_presets, directus_presetsId } from './directus-presets';
import type { directus_roles, directus_rolesId } from './directus-roles';
import type { directus_sessions, directus_sessionsId } from './directus-sessions';
import type { directus_shares, directus_sharesId } from './directus-shares';
import type { email_delivery_queue_item, email_delivery_queue_itemId } from './email-delivery-queue-item';
import type { granted_reward, granted_rewardId } from './granted-reward';
import type { group, groupId } from './group';
import type { login_token, login_tokenId } from './login-token';
import type { organization, organizationId } from './organization';
import type { parent_organization, parent_organizationId } from './parent-organization';
import type { reward, rewardId } from './reward';
import type { skolon_entity_version, skolon_entity_versionId } from './skolon-entity-version';
import type { strength, strengthId } from './strength';
import type { strength_session, strength_sessionId } from './strength-session';
import type { strength_session_new_player, strength_session_new_playerId } from './strength-session-new-player';
import type { strength_session_strength, strength_session_strengthId } from './strength-session-strength';
import type { strengths_valley_slide, strengths_valley_slideId } from './strengths-valley-slide';
import type { swl_item, swl_itemId } from './swl-item';
import type { swl_moment, swl_momentId } from './swl-moment';
import type { swl_promotion, swl_promotionId } from './swl-promotion';
import type { swl_wall, swl_wallId } from './swl-wall';
import type { user_to_group, user_to_groupId } from './user-to-group';
import type { user_to_organization, user_to_organizationId } from './user-to-organization';
import type { websocket_event, websocket_eventId } from './websocket-event';

export interface directus_usersAttributes {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  location?: string;
  title?: string;
  description?: string;
  tags?: object;
  avatar?: string;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  status: string;
  role?: string;
  token?: string;
  last_access?: Date;
  last_page?: string;
  provider: string;
  external_identifier?: string;
  auth_data?: object;
  email_notifications?: boolean;
  active_organization?: string;
  avatar_slug?: string;
  color?: string;
  date_created?: Date;
  expires_at?: Date;
  onboarding_completed_at?: Date;
  persistent: boolean;
  self_identified_signature_strengths?: string;
  skolon_uuid?: string;
  swl_wall?: string;
  temporary_write_access_folder?: string;
  temporary_write_access_folder_granted_at?: Date;
  top_strengths?: object;
  credit_count?: number;
  active_group?: string;
  active_strength_session?: string;
  stg_v1_id?: string;
  is_strength_session_user?: boolean;
}

export type directus_usersPk = "id";
export type directus_usersId = directus_users[directus_usersPk];
export type directus_usersOptionalAttributes = "first_name" | "last_name" | "email" | "password" | "location" | "title" | "description" | "tags" | "avatar" | "language" | "theme" | "tfa_secret" | "status" | "role" | "token" | "last_access" | "last_page" | "provider" | "external_identifier" | "auth_data" | "email_notifications" | "active_organization" | "avatar_slug" | "color" | "date_created" | "expires_at" | "onboarding_completed_at" | "self_identified_signature_strengths" | "skolon_uuid" | "swl_wall" | "temporary_write_access_folder" | "temporary_write_access_folder_granted_at" | "top_strengths" | "credit_count" | "active_group" | "active_strength_session" | "stg_v1_id" | "is_strength_session_user";
export type directus_usersCreationAttributes = Optional<directus_usersAttributes, directus_usersOptionalAttributes>;

export class directus_users extends Model<directus_usersAttributes, directus_usersCreationAttributes> implements directus_usersAttributes {
  id!: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  location?: string;
  title?: string;
  description?: string;
  tags?: object;
  avatar?: string;
  language?: string;
  theme?: string;
  tfa_secret?: string;
  status!: string;
  role?: string;
  token?: string;
  last_access?: Date;
  last_page?: string;
  provider!: string;
  external_identifier?: string;
  auth_data?: object;
  email_notifications?: boolean;
  active_organization?: string;
  avatar_slug?: string;
  color?: string;
  date_created?: Date;
  expires_at?: Date;
  onboarding_completed_at?: Date;
  persistent!: boolean;
  self_identified_signature_strengths?: string;
  skolon_uuid?: string;
  swl_wall?: string;
  temporary_write_access_folder?: string;
  temporary_write_access_folder_granted_at?: Date;
  top_strengths?: object;
  credit_count?: number;
  active_group?: string;
  active_strength_session?: string;
  stg_v1_id?: string;
  is_strength_session_user?: boolean;

  // directus_users belongsTo directus_folders via temporary_write_access_folder
  temporary_write_access_folder_directus_folder!: directus_folders;
  getTemporary_write_access_folder_directus_folder!: Sequelize.BelongsToGetAssociationMixin<directus_folders>;
  setTemporary_write_access_folder_directus_folder!: Sequelize.BelongsToSetAssociationMixin<directus_folders, directus_foldersId>;
  createTemporary_write_access_folder_directus_folder!: Sequelize.BelongsToCreateAssociationMixin<directus_folders>;
  // directus_users belongsTo directus_roles via role
  role_directus_role!: directus_roles;
  declare getRole_directus_role: Sequelize.BelongsToGetAssociationMixin<directus_roles>;
  setRole_directus_role!: Sequelize.BelongsToSetAssociationMixin<directus_roles, directus_rolesId>;
  createRole_directus_role!: Sequelize.BelongsToCreateAssociationMixin<directus_roles>;
  // directus_users hasMany analytics_event via user_created
  analytics_events!: analytics_event[];
  getAnalytics_events!: Sequelize.HasManyGetAssociationsMixin<analytics_event>;
  setAnalytics_events!: Sequelize.HasManySetAssociationsMixin<analytics_event, analytics_eventId>;
  addAnalytics_event!: Sequelize.HasManyAddAssociationMixin<analytics_event, analytics_eventId>;
  addAnalytics_events!: Sequelize.HasManyAddAssociationsMixin<analytics_event, analytics_eventId>;
  createAnalytics_event!: Sequelize.HasManyCreateAssociationMixin<analytics_event>;
  removeAnalytics_event!: Sequelize.HasManyRemoveAssociationMixin<analytics_event, analytics_eventId>;
  removeAnalytics_events!: Sequelize.HasManyRemoveAssociationsMixin<analytics_event, analytics_eventId>;
  hasAnalytics_event!: Sequelize.HasManyHasAssociationMixin<analytics_event, analytics_eventId>;
  hasAnalytics_events!: Sequelize.HasManyHasAssociationsMixin<analytics_event, analytics_eventId>;
  countAnalytics_events!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany analytics_session via user_created
  analytics_sessions!: analytics_session[];
  getAnalytics_sessions!: Sequelize.HasManyGetAssociationsMixin<analytics_session>;
  setAnalytics_sessions!: Sequelize.HasManySetAssociationsMixin<analytics_session, analytics_sessionId>;
  addAnalytics_session!: Sequelize.HasManyAddAssociationMixin<analytics_session, analytics_sessionId>;
  addAnalytics_sessions!: Sequelize.HasManyAddAssociationsMixin<analytics_session, analytics_sessionId>;
  createAnalytics_session!: Sequelize.HasManyCreateAssociationMixin<analytics_session>;
  removeAnalytics_session!: Sequelize.HasManyRemoveAssociationMixin<analytics_session, analytics_sessionId>;
  removeAnalytics_sessions!: Sequelize.HasManyRemoveAssociationsMixin<analytics_session, analytics_sessionId>;
  hasAnalytics_session!: Sequelize.HasManyHasAssociationMixin<analytics_session, analytics_sessionId>;
  hasAnalytics_sessions!: Sequelize.HasManyHasAssociationsMixin<analytics_session, analytics_sessionId>;
  countAnalytics_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_dashboards via user_created
  directus_dashboards!: directus_dashboards[];
  getDirectus_dashboards!: Sequelize.HasManyGetAssociationsMixin<directus_dashboards>;
  setDirectus_dashboards!: Sequelize.HasManySetAssociationsMixin<directus_dashboards, directus_dashboardsId>;
  addDirectus_dashboard!: Sequelize.HasManyAddAssociationMixin<directus_dashboards, directus_dashboardsId>;
  addDirectus_dashboards!: Sequelize.HasManyAddAssociationsMixin<directus_dashboards, directus_dashboardsId>;
  createDirectus_dashboard!: Sequelize.HasManyCreateAssociationMixin<directus_dashboards>;
  removeDirectus_dashboard!: Sequelize.HasManyRemoveAssociationMixin<directus_dashboards, directus_dashboardsId>;
  removeDirectus_dashboards!: Sequelize.HasManyRemoveAssociationsMixin<directus_dashboards, directus_dashboardsId>;
  hasDirectus_dashboard!: Sequelize.HasManyHasAssociationMixin<directus_dashboards, directus_dashboardsId>;
  hasDirectus_dashboards!: Sequelize.HasManyHasAssociationsMixin<directus_dashboards, directus_dashboardsId>;
  countDirectus_dashboards!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_files via modified_by
  directus_files!: directus_files[];
  getDirectus_files!: Sequelize.HasManyGetAssociationsMixin<directus_files>;
  setDirectus_files!: Sequelize.HasManySetAssociationsMixin<directus_files, directus_filesId>;
  addDirectus_file!: Sequelize.HasManyAddAssociationMixin<directus_files, directus_filesId>;
  addDirectus_files!: Sequelize.HasManyAddAssociationsMixin<directus_files, directus_filesId>;
  createDirectus_file!: Sequelize.HasManyCreateAssociationMixin<directus_files>;
  removeDirectus_file!: Sequelize.HasManyRemoveAssociationMixin<directus_files, directus_filesId>;
  removeDirectus_files!: Sequelize.HasManyRemoveAssociationsMixin<directus_files, directus_filesId>;
  hasDirectus_file!: Sequelize.HasManyHasAssociationMixin<directus_files, directus_filesId>;
  hasDirectus_files!: Sequelize.HasManyHasAssociationsMixin<directus_files, directus_filesId>;
  countDirectus_files!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_files via uploaded_by
  uploaded_by_directus_files!: directus_files[];
  getUploaded_by_directus_files!: Sequelize.HasManyGetAssociationsMixin<directus_files>;
  setUploaded_by_directus_files!: Sequelize.HasManySetAssociationsMixin<directus_files, directus_filesId>;
  addUploaded_by_directus_file!: Sequelize.HasManyAddAssociationMixin<directus_files, directus_filesId>;
  addUploaded_by_directus_files!: Sequelize.HasManyAddAssociationsMixin<directus_files, directus_filesId>;
  createUploaded_by_directus_file!: Sequelize.HasManyCreateAssociationMixin<directus_files>;
  removeUploaded_by_directus_file!: Sequelize.HasManyRemoveAssociationMixin<directus_files, directus_filesId>;
  removeUploaded_by_directus_files!: Sequelize.HasManyRemoveAssociationsMixin<directus_files, directus_filesId>;
  hasUploaded_by_directus_file!: Sequelize.HasManyHasAssociationMixin<directus_files, directus_filesId>;
  hasUploaded_by_directus_files!: Sequelize.HasManyHasAssociationsMixin<directus_files, directus_filesId>;
  countUploaded_by_directus_files!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_flows via user_created
  directus_flows!: directus_flows[];
  getDirectus_flows!: Sequelize.HasManyGetAssociationsMixin<directus_flows>;
  setDirectus_flows!: Sequelize.HasManySetAssociationsMixin<directus_flows, directus_flowsId>;
  addDirectus_flow!: Sequelize.HasManyAddAssociationMixin<directus_flows, directus_flowsId>;
  addDirectus_flows!: Sequelize.HasManyAddAssociationsMixin<directus_flows, directus_flowsId>;
  createDirectus_flow!: Sequelize.HasManyCreateAssociationMixin<directus_flows>;
  removeDirectus_flow!: Sequelize.HasManyRemoveAssociationMixin<directus_flows, directus_flowsId>;
  removeDirectus_flows!: Sequelize.HasManyRemoveAssociationsMixin<directus_flows, directus_flowsId>;
  hasDirectus_flow!: Sequelize.HasManyHasAssociationMixin<directus_flows, directus_flowsId>;
  hasDirectus_flows!: Sequelize.HasManyHasAssociationsMixin<directus_flows, directus_flowsId>;
  countDirectus_flows!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_notifications via recipient
  directus_notifications!: directus_notifications[];
  getDirectus_notifications!: Sequelize.HasManyGetAssociationsMixin<directus_notifications>;
  setDirectus_notifications!: Sequelize.HasManySetAssociationsMixin<directus_notifications, directus_notificationsId>;
  addDirectus_notification!: Sequelize.HasManyAddAssociationMixin<directus_notifications, directus_notificationsId>;
  addDirectus_notifications!: Sequelize.HasManyAddAssociationsMixin<directus_notifications, directus_notificationsId>;
  createDirectus_notification!: Sequelize.HasManyCreateAssociationMixin<directus_notifications>;
  removeDirectus_notification!: Sequelize.HasManyRemoveAssociationMixin<directus_notifications, directus_notificationsId>;
  removeDirectus_notifications!: Sequelize.HasManyRemoveAssociationsMixin<directus_notifications, directus_notificationsId>;
  hasDirectus_notification!: Sequelize.HasManyHasAssociationMixin<directus_notifications, directus_notificationsId>;
  hasDirectus_notifications!: Sequelize.HasManyHasAssociationsMixin<directus_notifications, directus_notificationsId>;
  countDirectus_notifications!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_notifications via sender
  sender_directus_notifications!: directus_notifications[];
  getSender_directus_notifications!: Sequelize.HasManyGetAssociationsMixin<directus_notifications>;
  setSender_directus_notifications!: Sequelize.HasManySetAssociationsMixin<directus_notifications, directus_notificationsId>;
  addSender_directus_notification!: Sequelize.HasManyAddAssociationMixin<directus_notifications, directus_notificationsId>;
  addSender_directus_notifications!: Sequelize.HasManyAddAssociationsMixin<directus_notifications, directus_notificationsId>;
  createSender_directus_notification!: Sequelize.HasManyCreateAssociationMixin<directus_notifications>;
  removeSender_directus_notification!: Sequelize.HasManyRemoveAssociationMixin<directus_notifications, directus_notificationsId>;
  removeSender_directus_notifications!: Sequelize.HasManyRemoveAssociationsMixin<directus_notifications, directus_notificationsId>;
  hasSender_directus_notification!: Sequelize.HasManyHasAssociationMixin<directus_notifications, directus_notificationsId>;
  hasSender_directus_notifications!: Sequelize.HasManyHasAssociationsMixin<directus_notifications, directus_notificationsId>;
  countSender_directus_notifications!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_operations via user_created
  directus_operations!: directus_operations[];
  getDirectus_operations!: Sequelize.HasManyGetAssociationsMixin<directus_operations>;
  setDirectus_operations!: Sequelize.HasManySetAssociationsMixin<directus_operations, directus_operationsId>;
  addDirectus_operation!: Sequelize.HasManyAddAssociationMixin<directus_operations, directus_operationsId>;
  addDirectus_operations!: Sequelize.HasManyAddAssociationsMixin<directus_operations, directus_operationsId>;
  createDirectus_operation!: Sequelize.HasManyCreateAssociationMixin<directus_operations>;
  removeDirectus_operation!: Sequelize.HasManyRemoveAssociationMixin<directus_operations, directus_operationsId>;
  removeDirectus_operations!: Sequelize.HasManyRemoveAssociationsMixin<directus_operations, directus_operationsId>;
  hasDirectus_operation!: Sequelize.HasManyHasAssociationMixin<directus_operations, directus_operationsId>;
  hasDirectus_operations!: Sequelize.HasManyHasAssociationsMixin<directus_operations, directus_operationsId>;
  countDirectus_operations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_panels via user_created
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
  // directus_users hasMany directus_presets via user
  directus_presets!: directus_presets[];
  getDirectus_presets!: Sequelize.HasManyGetAssociationsMixin<directus_presets>;
  setDirectus_presets!: Sequelize.HasManySetAssociationsMixin<directus_presets, directus_presetsId>;
  addDirectus_preset!: Sequelize.HasManyAddAssociationMixin<directus_presets, directus_presetsId>;
  addDirectus_presets!: Sequelize.HasManyAddAssociationsMixin<directus_presets, directus_presetsId>;
  createDirectus_preset!: Sequelize.HasManyCreateAssociationMixin<directus_presets>;
  removeDirectus_preset!: Sequelize.HasManyRemoveAssociationMixin<directus_presets, directus_presetsId>;
  removeDirectus_presets!: Sequelize.HasManyRemoveAssociationsMixin<directus_presets, directus_presetsId>;
  hasDirectus_preset!: Sequelize.HasManyHasAssociationMixin<directus_presets, directus_presetsId>;
  hasDirectus_presets!: Sequelize.HasManyHasAssociationsMixin<directus_presets, directus_presetsId>;
  countDirectus_presets!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_sessions via user
  directus_sessions!: directus_sessions[];
  getDirectus_sessions!: Sequelize.HasManyGetAssociationsMixin<directus_sessions>;
  setDirectus_sessions!: Sequelize.HasManySetAssociationsMixin<directus_sessions, directus_sessionsId>;
  addDirectus_session!: Sequelize.HasManyAddAssociationMixin<directus_sessions, directus_sessionsId>;
  addDirectus_sessions!: Sequelize.HasManyAddAssociationsMixin<directus_sessions, directus_sessionsId>;
  createDirectus_session!: Sequelize.HasManyCreateAssociationMixin<directus_sessions>;
  removeDirectus_session!: Sequelize.HasManyRemoveAssociationMixin<directus_sessions, directus_sessionsId>;
  removeDirectus_sessions!: Sequelize.HasManyRemoveAssociationsMixin<directus_sessions, directus_sessionsId>;
  hasDirectus_session!: Sequelize.HasManyHasAssociationMixin<directus_sessions, directus_sessionsId>;
  hasDirectus_sessions!: Sequelize.HasManyHasAssociationsMixin<directus_sessions, directus_sessionsId>;
  countDirectus_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany directus_shares via user_created
  directus_shares!: directus_shares[];
  getDirectus_shares!: Sequelize.HasManyGetAssociationsMixin<directus_shares>;
  setDirectus_shares!: Sequelize.HasManySetAssociationsMixin<directus_shares, directus_sharesId>;
  addDirectus_share!: Sequelize.HasManyAddAssociationMixin<directus_shares, directus_sharesId>;
  addDirectus_shares!: Sequelize.HasManyAddAssociationsMixin<directus_shares, directus_sharesId>;
  createDirectus_share!: Sequelize.HasManyCreateAssociationMixin<directus_shares>;
  removeDirectus_share!: Sequelize.HasManyRemoveAssociationMixin<directus_shares, directus_sharesId>;
  removeDirectus_shares!: Sequelize.HasManyRemoveAssociationsMixin<directus_shares, directus_sharesId>;
  hasDirectus_share!: Sequelize.HasManyHasAssociationMixin<directus_shares, directus_sharesId>;
  hasDirectus_shares!: Sequelize.HasManyHasAssociationsMixin<directus_shares, directus_sharesId>;
  countDirectus_shares!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany email_delivery_queue_item via user_created
  email_delivery_queue_items!: email_delivery_queue_item[];
  getEmail_delivery_queue_items!: Sequelize.HasManyGetAssociationsMixin<email_delivery_queue_item>;
  setEmail_delivery_queue_items!: Sequelize.HasManySetAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  addEmail_delivery_queue_item!: Sequelize.HasManyAddAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  addEmail_delivery_queue_items!: Sequelize.HasManyAddAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  createEmail_delivery_queue_item!: Sequelize.HasManyCreateAssociationMixin<email_delivery_queue_item>;
  removeEmail_delivery_queue_item!: Sequelize.HasManyRemoveAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  removeEmail_delivery_queue_items!: Sequelize.HasManyRemoveAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  hasEmail_delivery_queue_item!: Sequelize.HasManyHasAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  hasEmail_delivery_queue_items!: Sequelize.HasManyHasAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  countEmail_delivery_queue_items!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany email_delivery_queue_item via user_updated
  user_updated_email_delivery_queue_items!: email_delivery_queue_item[];
  getUser_updated_email_delivery_queue_items!: Sequelize.HasManyGetAssociationsMixin<email_delivery_queue_item>;
  setUser_updated_email_delivery_queue_items!: Sequelize.HasManySetAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  addUser_updated_email_delivery_queue_item!: Sequelize.HasManyAddAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  addUser_updated_email_delivery_queue_items!: Sequelize.HasManyAddAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  createUser_updated_email_delivery_queue_item!: Sequelize.HasManyCreateAssociationMixin<email_delivery_queue_item>;
  removeUser_updated_email_delivery_queue_item!: Sequelize.HasManyRemoveAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  removeUser_updated_email_delivery_queue_items!: Sequelize.HasManyRemoveAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  hasUser_updated_email_delivery_queue_item!: Sequelize.HasManyHasAssociationMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  hasUser_updated_email_delivery_queue_items!: Sequelize.HasManyHasAssociationsMixin<email_delivery_queue_item, email_delivery_queue_itemId>;
  countUser_updated_email_delivery_queue_items!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany granted_reward via user_created
  granted_rewards!: granted_reward[];
  getGranted_rewards!: Sequelize.HasManyGetAssociationsMixin<granted_reward>;
  setGranted_rewards!: Sequelize.HasManySetAssociationsMixin<granted_reward, granted_rewardId>;
  addGranted_reward!: Sequelize.HasManyAddAssociationMixin<granted_reward, granted_rewardId>;
  addGranted_rewards!: Sequelize.HasManyAddAssociationsMixin<granted_reward, granted_rewardId>;
  createGranted_reward!: Sequelize.HasManyCreateAssociationMixin<granted_reward>;
  removeGranted_reward!: Sequelize.HasManyRemoveAssociationMixin<granted_reward, granted_rewardId>;
  removeGranted_rewards!: Sequelize.HasManyRemoveAssociationsMixin<granted_reward, granted_rewardId>;
  hasGranted_reward!: Sequelize.HasManyHasAssociationMixin<granted_reward, granted_rewardId>;
  hasGranted_rewards!: Sequelize.HasManyHasAssociationsMixin<granted_reward, granted_rewardId>;
  countGranted_rewards!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany granted_reward via user
  user_granted_rewards!: granted_reward[];
  getUser_granted_rewards!: Sequelize.HasManyGetAssociationsMixin<granted_reward>;
  setUser_granted_rewards!: Sequelize.HasManySetAssociationsMixin<granted_reward, granted_rewardId>;
  addUser_granted_reward!: Sequelize.HasManyAddAssociationMixin<granted_reward, granted_rewardId>;
  addUser_granted_rewards!: Sequelize.HasManyAddAssociationsMixin<granted_reward, granted_rewardId>;
  createUser_granted_reward!: Sequelize.HasManyCreateAssociationMixin<granted_reward>;
  removeUser_granted_reward!: Sequelize.HasManyRemoveAssociationMixin<granted_reward, granted_rewardId>;
  removeUser_granted_rewards!: Sequelize.HasManyRemoveAssociationsMixin<granted_reward, granted_rewardId>;
  hasUser_granted_reward!: Sequelize.HasManyHasAssociationMixin<granted_reward, granted_rewardId>;
  hasUser_granted_rewards!: Sequelize.HasManyHasAssociationsMixin<granted_reward, granted_rewardId>;
  countUser_granted_rewards!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany group via user_created
  groups!: group[];
  getGroups!: Sequelize.HasManyGetAssociationsMixin<group>;
  setGroups!: Sequelize.HasManySetAssociationsMixin<group, groupId>;
  addGroup!: Sequelize.HasManyAddAssociationMixin<group, groupId>;
  addGroups!: Sequelize.HasManyAddAssociationsMixin<group, groupId>;
  createGroup!: Sequelize.HasManyCreateAssociationMixin<group>;
  removeGroup!: Sequelize.HasManyRemoveAssociationMixin<group, groupId>;
  removeGroups!: Sequelize.HasManyRemoveAssociationsMixin<group, groupId>;
  hasGroup!: Sequelize.HasManyHasAssociationMixin<group, groupId>;
  hasGroups!: Sequelize.HasManyHasAssociationsMixin<group, groupId>;
  countGroups!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany group via user_updated
  user_updated_groups!: group[];
  getUser_updated_groups!: Sequelize.HasManyGetAssociationsMixin<group>;
  setUser_updated_groups!: Sequelize.HasManySetAssociationsMixin<group, groupId>;
  addUser_updated_group!: Sequelize.HasManyAddAssociationMixin<group, groupId>;
  addUser_updated_groups!: Sequelize.HasManyAddAssociationsMixin<group, groupId>;
  createUser_updated_group!: Sequelize.HasManyCreateAssociationMixin<group>;
  removeUser_updated_group!: Sequelize.HasManyRemoveAssociationMixin<group, groupId>;
  removeUser_updated_groups!: Sequelize.HasManyRemoveAssociationsMixin<group, groupId>;
  hasUser_updated_group!: Sequelize.HasManyHasAssociationMixin<group, groupId>;
  hasUser_updated_groups!: Sequelize.HasManyHasAssociationsMixin<group, groupId>;
  countUser_updated_groups!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany login_token via user_created
  login_tokens!: login_token[];
  getLogin_tokens!: Sequelize.HasManyGetAssociationsMixin<login_token>;
  setLogin_tokens!: Sequelize.HasManySetAssociationsMixin<login_token, login_tokenId>;
  addLogin_token!: Sequelize.HasManyAddAssociationMixin<login_token, login_tokenId>;
  addLogin_tokens!: Sequelize.HasManyAddAssociationsMixin<login_token, login_tokenId>;
  createLogin_token!: Sequelize.HasManyCreateAssociationMixin<login_token>;
  removeLogin_token!: Sequelize.HasManyRemoveAssociationMixin<login_token, login_tokenId>;
  removeLogin_tokens!: Sequelize.HasManyRemoveAssociationsMixin<login_token, login_tokenId>;
  hasLogin_token!: Sequelize.HasManyHasAssociationMixin<login_token, login_tokenId>;
  hasLogin_tokens!: Sequelize.HasManyHasAssociationsMixin<login_token, login_tokenId>;
  countLogin_tokens!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany login_token via user
  user_login_tokens!: login_token[];
  getUser_login_tokens!: Sequelize.HasManyGetAssociationsMixin<login_token>;
  setUser_login_tokens!: Sequelize.HasManySetAssociationsMixin<login_token, login_tokenId>;
  addUser_login_token!: Sequelize.HasManyAddAssociationMixin<login_token, login_tokenId>;
  addUser_login_tokens!: Sequelize.HasManyAddAssociationsMixin<login_token, login_tokenId>;
  createUser_login_token!: Sequelize.HasManyCreateAssociationMixin<login_token>;
  removeUser_login_token!: Sequelize.HasManyRemoveAssociationMixin<login_token, login_tokenId>;
  removeUser_login_tokens!: Sequelize.HasManyRemoveAssociationsMixin<login_token, login_tokenId>;
  hasUser_login_token!: Sequelize.HasManyHasAssociationMixin<login_token, login_tokenId>;
  hasUser_login_tokens!: Sequelize.HasManyHasAssociationsMixin<login_token, login_tokenId>;
  countUser_login_tokens!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany organization via user_created
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
  // directus_users hasMany organization via user_updated
  user_updated_organizations!: organization[];
  getUser_updated_organizations!: Sequelize.HasManyGetAssociationsMixin<organization>;
  setUser_updated_organizations!: Sequelize.HasManySetAssociationsMixin<organization, organizationId>;
  addUser_updated_organization!: Sequelize.HasManyAddAssociationMixin<organization, organizationId>;
  addUser_updated_organizations!: Sequelize.HasManyAddAssociationsMixin<organization, organizationId>;
  createUser_updated_organization!: Sequelize.HasManyCreateAssociationMixin<organization>;
  removeUser_updated_organization!: Sequelize.HasManyRemoveAssociationMixin<organization, organizationId>;
  removeUser_updated_organizations!: Sequelize.HasManyRemoveAssociationsMixin<organization, organizationId>;
  hasUser_updated_organization!: Sequelize.HasManyHasAssociationMixin<organization, organizationId>;
  hasUser_updated_organizations!: Sequelize.HasManyHasAssociationsMixin<organization, organizationId>;
  countUser_updated_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany parent_organization via user_created
  parent_organizations!: parent_organization[];
  getParent_organizations!: Sequelize.HasManyGetAssociationsMixin<parent_organization>;
  setParent_organizations!: Sequelize.HasManySetAssociationsMixin<parent_organization, parent_organizationId>;
  addParent_organization!: Sequelize.HasManyAddAssociationMixin<parent_organization, parent_organizationId>;
  addParent_organizations!: Sequelize.HasManyAddAssociationsMixin<parent_organization, parent_organizationId>;
  createParent_organization!: Sequelize.HasManyCreateAssociationMixin<parent_organization>;
  removeParent_organization!: Sequelize.HasManyRemoveAssociationMixin<parent_organization, parent_organizationId>;
  removeParent_organizations!: Sequelize.HasManyRemoveAssociationsMixin<parent_organization, parent_organizationId>;
  hasParent_organization!: Sequelize.HasManyHasAssociationMixin<parent_organization, parent_organizationId>;
  hasParent_organizations!: Sequelize.HasManyHasAssociationsMixin<parent_organization, parent_organizationId>;
  countParent_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany parent_organization via user_updated
  user_updated_parent_organizations!: parent_organization[];
  getUser_updated_parent_organizations!: Sequelize.HasManyGetAssociationsMixin<parent_organization>;
  setUser_updated_parent_organizations!: Sequelize.HasManySetAssociationsMixin<parent_organization, parent_organizationId>;
  addUser_updated_parent_organization!: Sequelize.HasManyAddAssociationMixin<parent_organization, parent_organizationId>;
  addUser_updated_parent_organizations!: Sequelize.HasManyAddAssociationsMixin<parent_organization, parent_organizationId>;
  createUser_updated_parent_organization!: Sequelize.HasManyCreateAssociationMixin<parent_organization>;
  removeUser_updated_parent_organization!: Sequelize.HasManyRemoveAssociationMixin<parent_organization, parent_organizationId>;
  removeUser_updated_parent_organizations!: Sequelize.HasManyRemoveAssociationsMixin<parent_organization, parent_organizationId>;
  hasUser_updated_parent_organization!: Sequelize.HasManyHasAssociationMixin<parent_organization, parent_organizationId>;
  hasUser_updated_parent_organizations!: Sequelize.HasManyHasAssociationsMixin<parent_organization, parent_organizationId>;
  countUser_updated_parent_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany reward via user_created
  rewards!: reward[];
  getRewards!: Sequelize.HasManyGetAssociationsMixin<reward>;
  setRewards!: Sequelize.HasManySetAssociationsMixin<reward, rewardId>;
  addReward!: Sequelize.HasManyAddAssociationMixin<reward, rewardId>;
  addRewards!: Sequelize.HasManyAddAssociationsMixin<reward, rewardId>;
  createReward!: Sequelize.HasManyCreateAssociationMixin<reward>;
  removeReward!: Sequelize.HasManyRemoveAssociationMixin<reward, rewardId>;
  removeRewards!: Sequelize.HasManyRemoveAssociationsMixin<reward, rewardId>;
  hasReward!: Sequelize.HasManyHasAssociationMixin<reward, rewardId>;
  hasRewards!: Sequelize.HasManyHasAssociationsMixin<reward, rewardId>;
  countRewards!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany reward via user_updated
  user_updated_rewards!: reward[];
  getUser_updated_rewards!: Sequelize.HasManyGetAssociationsMixin<reward>;
  setUser_updated_rewards!: Sequelize.HasManySetAssociationsMixin<reward, rewardId>;
  addUser_updated_reward!: Sequelize.HasManyAddAssociationMixin<reward, rewardId>;
  addUser_updated_rewards!: Sequelize.HasManyAddAssociationsMixin<reward, rewardId>;
  createUser_updated_reward!: Sequelize.HasManyCreateAssociationMixin<reward>;
  removeUser_updated_reward!: Sequelize.HasManyRemoveAssociationMixin<reward, rewardId>;
  removeUser_updated_rewards!: Sequelize.HasManyRemoveAssociationsMixin<reward, rewardId>;
  hasUser_updated_reward!: Sequelize.HasManyHasAssociationMixin<reward, rewardId>;
  hasUser_updated_rewards!: Sequelize.HasManyHasAssociationsMixin<reward, rewardId>;
  countUser_updated_rewards!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany skolon_entity_version via user_created
  skolon_entity_versions!: skolon_entity_version[];
  getSkolon_entity_versions!: Sequelize.HasManyGetAssociationsMixin<skolon_entity_version>;
  setSkolon_entity_versions!: Sequelize.HasManySetAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  addSkolon_entity_version!: Sequelize.HasManyAddAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  addSkolon_entity_versions!: Sequelize.HasManyAddAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  createSkolon_entity_version!: Sequelize.HasManyCreateAssociationMixin<skolon_entity_version>;
  removeSkolon_entity_version!: Sequelize.HasManyRemoveAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  removeSkolon_entity_versions!: Sequelize.HasManyRemoveAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  hasSkolon_entity_version!: Sequelize.HasManyHasAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  hasSkolon_entity_versions!: Sequelize.HasManyHasAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  countSkolon_entity_versions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany skolon_entity_version via user_updated
  user_updated_skolon_entity_versions!: skolon_entity_version[];
  getUser_updated_skolon_entity_versions!: Sequelize.HasManyGetAssociationsMixin<skolon_entity_version>;
  setUser_updated_skolon_entity_versions!: Sequelize.HasManySetAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  addUser_updated_skolon_entity_version!: Sequelize.HasManyAddAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  addUser_updated_skolon_entity_versions!: Sequelize.HasManyAddAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  createUser_updated_skolon_entity_version!: Sequelize.HasManyCreateAssociationMixin<skolon_entity_version>;
  removeUser_updated_skolon_entity_version!: Sequelize.HasManyRemoveAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  removeUser_updated_skolon_entity_versions!: Sequelize.HasManyRemoveAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  hasUser_updated_skolon_entity_version!: Sequelize.HasManyHasAssociationMixin<skolon_entity_version, skolon_entity_versionId>;
  hasUser_updated_skolon_entity_versions!: Sequelize.HasManyHasAssociationsMixin<skolon_entity_version, skolon_entity_versionId>;
  countUser_updated_skolon_entity_versions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength via user_created
  strengths!: strength[];
  getStrengths!: Sequelize.HasManyGetAssociationsMixin<strength>;
  setStrengths!: Sequelize.HasManySetAssociationsMixin<strength, strengthId>;
  addStrength!: Sequelize.HasManyAddAssociationMixin<strength, strengthId>;
  addStrengths!: Sequelize.HasManyAddAssociationsMixin<strength, strengthId>;
  createStrength!: Sequelize.HasManyCreateAssociationMixin<strength>;
  removeStrength!: Sequelize.HasManyRemoveAssociationMixin<strength, strengthId>;
  removeStrengths!: Sequelize.HasManyRemoveAssociationsMixin<strength, strengthId>;
  hasStrength!: Sequelize.HasManyHasAssociationMixin<strength, strengthId>;
  hasStrengths!: Sequelize.HasManyHasAssociationsMixin<strength, strengthId>;
  countStrengths!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength via user_updated
  user_updated_strengths!: strength[];
  getUser_updated_strengths!: Sequelize.HasManyGetAssociationsMixin<strength>;
  setUser_updated_strengths!: Sequelize.HasManySetAssociationsMixin<strength, strengthId>;
  addUser_updated_strength!: Sequelize.HasManyAddAssociationMixin<strength, strengthId>;
  addUser_updated_strengths!: Sequelize.HasManyAddAssociationsMixin<strength, strengthId>;
  createUser_updated_strength!: Sequelize.HasManyCreateAssociationMixin<strength>;
  removeUser_updated_strength!: Sequelize.HasManyRemoveAssociationMixin<strength, strengthId>;
  removeUser_updated_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength, strengthId>;
  hasUser_updated_strength!: Sequelize.HasManyHasAssociationMixin<strength, strengthId>;
  hasUser_updated_strengths!: Sequelize.HasManyHasAssociationsMixin<strength, strengthId>;
  countUser_updated_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength_session via user_created
  strength_sessions!: strength_session[];
  getStrength_sessions!: Sequelize.HasManyGetAssociationsMixin<strength_session>;
  setStrength_sessions!: Sequelize.HasManySetAssociationsMixin<strength_session, strength_sessionId>;
  addStrength_session!: Sequelize.HasManyAddAssociationMixin<strength_session, strength_sessionId>;
  addStrength_sessions!: Sequelize.HasManyAddAssociationsMixin<strength_session, strength_sessionId>;
  createStrength_session!: Sequelize.HasManyCreateAssociationMixin<strength_session>;
  removeStrength_session!: Sequelize.HasManyRemoveAssociationMixin<strength_session, strength_sessionId>;
  removeStrength_sessions!: Sequelize.HasManyRemoveAssociationsMixin<strength_session, strength_sessionId>;
  hasStrength_session!: Sequelize.HasManyHasAssociationMixin<strength_session, strength_sessionId>;
  hasStrength_sessions!: Sequelize.HasManyHasAssociationsMixin<strength_session, strength_sessionId>;
  countStrength_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength_session via user_updated
  user_updated_strength_sessions!: strength_session[];
  getUser_updated_strength_sessions!: Sequelize.HasManyGetAssociationsMixin<strength_session>;
  setUser_updated_strength_sessions!: Sequelize.HasManySetAssociationsMixin<strength_session, strength_sessionId>;
  addUser_updated_strength_session!: Sequelize.HasManyAddAssociationMixin<strength_session, strength_sessionId>;
  addUser_updated_strength_sessions!: Sequelize.HasManyAddAssociationsMixin<strength_session, strength_sessionId>;
  createUser_updated_strength_session!: Sequelize.HasManyCreateAssociationMixin<strength_session>;
  removeUser_updated_strength_session!: Sequelize.HasManyRemoveAssociationMixin<strength_session, strength_sessionId>;
  removeUser_updated_strength_sessions!: Sequelize.HasManyRemoveAssociationsMixin<strength_session, strength_sessionId>;
  hasUser_updated_strength_session!: Sequelize.HasManyHasAssociationMixin<strength_session, strength_sessionId>;
  hasUser_updated_strength_sessions!: Sequelize.HasManyHasAssociationsMixin<strength_session, strength_sessionId>;
  countUser_updated_strength_sessions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength_session_new_player via user
  strength_session_new_players!: strength_session_new_player[];
  getStrength_session_new_players!: Sequelize.HasManyGetAssociationsMixin<strength_session_new_player>;
  setStrength_session_new_players!: Sequelize.HasManySetAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  addStrength_session_new_player!: Sequelize.HasManyAddAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  addStrength_session_new_players!: Sequelize.HasManyAddAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  createStrength_session_new_player!: Sequelize.HasManyCreateAssociationMixin<strength_session_new_player>;
  removeStrength_session_new_player!: Sequelize.HasManyRemoveAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  removeStrength_session_new_players!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  hasStrength_session_new_player!: Sequelize.HasManyHasAssociationMixin<strength_session_new_player, strength_session_new_playerId>;
  hasStrength_session_new_players!: Sequelize.HasManyHasAssociationsMixin<strength_session_new_player, strength_session_new_playerId>;
  countStrength_session_new_players!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength_session_strength via user_created
  strength_session_strengths!: strength_session_strength[];
  getStrength_session_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_strength>;
  setStrength_session_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_strength, strength_session_strengthId>;
  addStrength_session_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  createStrength_session_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_strength>;
  removeStrength_session_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_strength, strength_session_strengthId>;
  removeStrength_session_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_strength, strength_session_strengthId>;
  hasStrength_session_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  countStrength_session_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strength_session_strength via user
  user_strength_session_strengths!: strength_session_strength[];
  getUser_strength_session_strengths!: Sequelize.HasManyGetAssociationsMixin<strength_session_strength>;
  setUser_strength_session_strengths!: Sequelize.HasManySetAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  addUser_strength_session_strength!: Sequelize.HasManyAddAssociationMixin<strength_session_strength, strength_session_strengthId>;
  addUser_strength_session_strengths!: Sequelize.HasManyAddAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  createUser_strength_session_strength!: Sequelize.HasManyCreateAssociationMixin<strength_session_strength>;
  removeUser_strength_session_strength!: Sequelize.HasManyRemoveAssociationMixin<strength_session_strength, strength_session_strengthId>;
  removeUser_strength_session_strengths!: Sequelize.HasManyRemoveAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  hasUser_strength_session_strength!: Sequelize.HasManyHasAssociationMixin<strength_session_strength, strength_session_strengthId>;
  hasUser_strength_session_strengths!: Sequelize.HasManyHasAssociationsMixin<strength_session_strength, strength_session_strengthId>;
  countUser_strength_session_strengths!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strengths_valley_slide via user_created
  strengths_valley_slides!: strengths_valley_slide[];
  getStrengths_valley_slides!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide>;
  setStrengths_valley_slides!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_slide!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  addStrengths_valley_slides!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  createStrengths_valley_slide!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide>;
  removeStrengths_valley_slide!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  removeStrengths_valley_slides!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_slide!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasStrengths_valley_slides!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  countStrengths_valley_slides!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany strengths_valley_slide via user_updated
  user_updated_strengths_valley_slides!: strengths_valley_slide[];
  getUser_updated_strengths_valley_slides!: Sequelize.HasManyGetAssociationsMixin<strengths_valley_slide>;
  setUser_updated_strengths_valley_slides!: Sequelize.HasManySetAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  addUser_updated_strengths_valley_slide!: Sequelize.HasManyAddAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  addUser_updated_strengths_valley_slides!: Sequelize.HasManyAddAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  createUser_updated_strengths_valley_slide!: Sequelize.HasManyCreateAssociationMixin<strengths_valley_slide>;
  removeUser_updated_strengths_valley_slide!: Sequelize.HasManyRemoveAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  removeUser_updated_strengths_valley_slides!: Sequelize.HasManyRemoveAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasUser_updated_strengths_valley_slide!: Sequelize.HasManyHasAssociationMixin<strengths_valley_slide, strengths_valley_slideId>;
  hasUser_updated_strengths_valley_slides!: Sequelize.HasManyHasAssociationsMixin<strengths_valley_slide, strengths_valley_slideId>;
  countUser_updated_strengths_valley_slides!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_item via user_created
  swl_items!: swl_item[];
  getSwl_items!: Sequelize.HasManyGetAssociationsMixin<swl_item>;
  setSwl_items!: Sequelize.HasManySetAssociationsMixin<swl_item, swl_itemId>;
  addSwl_item!: Sequelize.HasManyAddAssociationMixin<swl_item, swl_itemId>;
  addSwl_items!: Sequelize.HasManyAddAssociationsMixin<swl_item, swl_itemId>;
  createSwl_item!: Sequelize.HasManyCreateAssociationMixin<swl_item>;
  removeSwl_item!: Sequelize.HasManyRemoveAssociationMixin<swl_item, swl_itemId>;
  removeSwl_items!: Sequelize.HasManyRemoveAssociationsMixin<swl_item, swl_itemId>;
  hasSwl_item!: Sequelize.HasManyHasAssociationMixin<swl_item, swl_itemId>;
  hasSwl_items!: Sequelize.HasManyHasAssociationsMixin<swl_item, swl_itemId>;
  countSwl_items!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_item via user_updated
  user_updated_swl_items!: swl_item[];
  getUser_updated_swl_items!: Sequelize.HasManyGetAssociationsMixin<swl_item>;
  setUser_updated_swl_items!: Sequelize.HasManySetAssociationsMixin<swl_item, swl_itemId>;
  addUser_updated_swl_item!: Sequelize.HasManyAddAssociationMixin<swl_item, swl_itemId>;
  addUser_updated_swl_items!: Sequelize.HasManyAddAssociationsMixin<swl_item, swl_itemId>;
  createUser_updated_swl_item!: Sequelize.HasManyCreateAssociationMixin<swl_item>;
  removeUser_updated_swl_item!: Sequelize.HasManyRemoveAssociationMixin<swl_item, swl_itemId>;
  removeUser_updated_swl_items!: Sequelize.HasManyRemoveAssociationsMixin<swl_item, swl_itemId>;
  hasUser_updated_swl_item!: Sequelize.HasManyHasAssociationMixin<swl_item, swl_itemId>;
  hasUser_updated_swl_items!: Sequelize.HasManyHasAssociationsMixin<swl_item, swl_itemId>;
  countUser_updated_swl_items!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_moment via created_by
  swl_moments!: swl_moment[];
  declare getSwl_moments: Sequelize.HasManyGetAssociationsMixin<swl_moment>;
  setSwl_moments!: Sequelize.HasManySetAssociationsMixin<swl_moment, swl_momentId>;
  addSwl_moment!: Sequelize.HasManyAddAssociationMixin<swl_moment, swl_momentId>;
  addSwl_moments!: Sequelize.HasManyAddAssociationsMixin<swl_moment, swl_momentId>;
  createSwl_moment!: Sequelize.HasManyCreateAssociationMixin<swl_moment>;
  removeSwl_moment!: Sequelize.HasManyRemoveAssociationMixin<swl_moment, swl_momentId>;
  removeSwl_moments!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment, swl_momentId>;
  hasSwl_moment!: Sequelize.HasManyHasAssociationMixin<swl_moment, swl_momentId>;
  hasSwl_moments!: Sequelize.HasManyHasAssociationsMixin<swl_moment, swl_momentId>;
  countSwl_moments!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_moment via user_created
  user_created_swl_moments!: swl_moment[];
  getUser_created_swl_moments!: Sequelize.HasManyGetAssociationsMixin<swl_moment>;
  setUser_created_swl_moments!: Sequelize.HasManySetAssociationsMixin<swl_moment, swl_momentId>;
  addUser_created_swl_moment!: Sequelize.HasManyAddAssociationMixin<swl_moment, swl_momentId>;
  addUser_created_swl_moments!: Sequelize.HasManyAddAssociationsMixin<swl_moment, swl_momentId>;
  createUser_created_swl_moment!: Sequelize.HasManyCreateAssociationMixin<swl_moment>;
  removeUser_created_swl_moment!: Sequelize.HasManyRemoveAssociationMixin<swl_moment, swl_momentId>;
  removeUser_created_swl_moments!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment, swl_momentId>;
  hasUser_created_swl_moment!: Sequelize.HasManyHasAssociationMixin<swl_moment, swl_momentId>;
  hasUser_created_swl_moments!: Sequelize.HasManyHasAssociationsMixin<swl_moment, swl_momentId>;
  countUser_created_swl_moments!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_moment via user_updated
  user_updated_swl_moments!: swl_moment[];
  getUser_updated_swl_moments!: Sequelize.HasManyGetAssociationsMixin<swl_moment>;
  setUser_updated_swl_moments!: Sequelize.HasManySetAssociationsMixin<swl_moment, swl_momentId>;
  addUser_updated_swl_moment!: Sequelize.HasManyAddAssociationMixin<swl_moment, swl_momentId>;
  addUser_updated_swl_moments!: Sequelize.HasManyAddAssociationsMixin<swl_moment, swl_momentId>;
  createUser_updated_swl_moment!: Sequelize.HasManyCreateAssociationMixin<swl_moment>;
  removeUser_updated_swl_moment!: Sequelize.HasManyRemoveAssociationMixin<swl_moment, swl_momentId>;
  removeUser_updated_swl_moments!: Sequelize.HasManyRemoveAssociationsMixin<swl_moment, swl_momentId>;
  hasUser_updated_swl_moment!: Sequelize.HasManyHasAssociationMixin<swl_moment, swl_momentId>;
  hasUser_updated_swl_moments!: Sequelize.HasManyHasAssociationsMixin<swl_moment, swl_momentId>;
  countUser_updated_swl_moments!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_promotion via user_created
  swl_promotions!: swl_promotion[];
  getSwl_promotions!: Sequelize.HasManyGetAssociationsMixin<swl_promotion>;
  setSwl_promotions!: Sequelize.HasManySetAssociationsMixin<swl_promotion, swl_promotionId>;
  addSwl_promotion!: Sequelize.HasManyAddAssociationMixin<swl_promotion, swl_promotionId>;
  addSwl_promotions!: Sequelize.HasManyAddAssociationsMixin<swl_promotion, swl_promotionId>;
  createSwl_promotion!: Sequelize.HasManyCreateAssociationMixin<swl_promotion>;
  removeSwl_promotion!: Sequelize.HasManyRemoveAssociationMixin<swl_promotion, swl_promotionId>;
  removeSwl_promotions!: Sequelize.HasManyRemoveAssociationsMixin<swl_promotion, swl_promotionId>;
  hasSwl_promotion!: Sequelize.HasManyHasAssociationMixin<swl_promotion, swl_promotionId>;
  hasSwl_promotions!: Sequelize.HasManyHasAssociationsMixin<swl_promotion, swl_promotionId>;
  countSwl_promotions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_promotion via user_updated
  user_updated_swl_promotions!: swl_promotion[];
  getUser_updated_swl_promotions!: Sequelize.HasManyGetAssociationsMixin<swl_promotion>;
  setUser_updated_swl_promotions!: Sequelize.HasManySetAssociationsMixin<swl_promotion, swl_promotionId>;
  addUser_updated_swl_promotion!: Sequelize.HasManyAddAssociationMixin<swl_promotion, swl_promotionId>;
  addUser_updated_swl_promotions!: Sequelize.HasManyAddAssociationsMixin<swl_promotion, swl_promotionId>;
  createUser_updated_swl_promotion!: Sequelize.HasManyCreateAssociationMixin<swl_promotion>;
  removeUser_updated_swl_promotion!: Sequelize.HasManyRemoveAssociationMixin<swl_promotion, swl_promotionId>;
  removeUser_updated_swl_promotions!: Sequelize.HasManyRemoveAssociationsMixin<swl_promotion, swl_promotionId>;
  hasUser_updated_swl_promotion!: Sequelize.HasManyHasAssociationMixin<swl_promotion, swl_promotionId>;
  hasUser_updated_swl_promotions!: Sequelize.HasManyHasAssociationsMixin<swl_promotion, swl_promotionId>;
  countUser_updated_swl_promotions!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_wall via user_created
  swl_walls!: swl_wall[];
  getSwl_walls!: Sequelize.HasManyGetAssociationsMixin<swl_wall>;
  setSwl_walls!: Sequelize.HasManySetAssociationsMixin<swl_wall, swl_wallId>;
  addSwl_wall!: Sequelize.HasManyAddAssociationMixin<swl_wall, swl_wallId>;
  addSwl_walls!: Sequelize.HasManyAddAssociationsMixin<swl_wall, swl_wallId>;
  createSwl_wall!: Sequelize.HasManyCreateAssociationMixin<swl_wall>;
  removeSwl_wall!: Sequelize.HasManyRemoveAssociationMixin<swl_wall, swl_wallId>;
  removeSwl_walls!: Sequelize.HasManyRemoveAssociationsMixin<swl_wall, swl_wallId>;
  hasSwl_wall!: Sequelize.HasManyHasAssociationMixin<swl_wall, swl_wallId>;
  hasSwl_walls!: Sequelize.HasManyHasAssociationsMixin<swl_wall, swl_wallId>;
  countSwl_walls!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany swl_wall via user_updated
  user_updated_swl_walls!: swl_wall[];
  getUser_updated_swl_walls!: Sequelize.HasManyGetAssociationsMixin<swl_wall>;
  setUser_updated_swl_walls!: Sequelize.HasManySetAssociationsMixin<swl_wall, swl_wallId>;
  addUser_updated_swl_wall!: Sequelize.HasManyAddAssociationMixin<swl_wall, swl_wallId>;
  addUser_updated_swl_walls!: Sequelize.HasManyAddAssociationsMixin<swl_wall, swl_wallId>;
  createUser_updated_swl_wall!: Sequelize.HasManyCreateAssociationMixin<swl_wall>;
  removeUser_updated_swl_wall!: Sequelize.HasManyRemoveAssociationMixin<swl_wall, swl_wallId>;
  removeUser_updated_swl_walls!: Sequelize.HasManyRemoveAssociationsMixin<swl_wall, swl_wallId>;
  hasUser_updated_swl_wall!: Sequelize.HasManyHasAssociationMixin<swl_wall, swl_wallId>;
  hasUser_updated_swl_walls!: Sequelize.HasManyHasAssociationsMixin<swl_wall, swl_wallId>;
  countUser_updated_swl_walls!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany user_to_group via user
  user_to_groups!: user_to_group[];
  getUser_to_groups!: Sequelize.HasManyGetAssociationsMixin<user_to_group>;
  setUser_to_groups!: Sequelize.HasManySetAssociationsMixin<user_to_group, user_to_groupId>;
  addUser_to_group!: Sequelize.HasManyAddAssociationMixin<user_to_group, user_to_groupId>;
  addUser_to_groups!: Sequelize.HasManyAddAssociationsMixin<user_to_group, user_to_groupId>;
  createUser_to_group!: Sequelize.HasManyCreateAssociationMixin<user_to_group>;
  removeUser_to_group!: Sequelize.HasManyRemoveAssociationMixin<user_to_group, user_to_groupId>;
  removeUser_to_groups!: Sequelize.HasManyRemoveAssociationsMixin<user_to_group, user_to_groupId>;
  hasUser_to_group!: Sequelize.HasManyHasAssociationMixin<user_to_group, user_to_groupId>;
  hasUser_to_groups!: Sequelize.HasManyHasAssociationsMixin<user_to_group, user_to_groupId>;
  countUser_to_groups!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany user_to_organization via inviter
  user_to_organizations!: user_to_organization[];
  getUser_to_organizations!: Sequelize.HasManyGetAssociationsMixin<user_to_organization>;
  setUser_to_organizations!: Sequelize.HasManySetAssociationsMixin<user_to_organization, user_to_organizationId>;
  addUser_to_organization!: Sequelize.HasManyAddAssociationMixin<user_to_organization, user_to_organizationId>;
  addUser_to_organizations!: Sequelize.HasManyAddAssociationsMixin<user_to_organization, user_to_organizationId>;
  createUser_to_organization!: Sequelize.HasManyCreateAssociationMixin<user_to_organization>;
  removeUser_to_organization!: Sequelize.HasManyRemoveAssociationMixin<user_to_organization, user_to_organizationId>;
  removeUser_to_organizations!: Sequelize.HasManyRemoveAssociationsMixin<user_to_organization, user_to_organizationId>;
  hasUser_to_organization!: Sequelize.HasManyHasAssociationMixin<user_to_organization, user_to_organizationId>;
  hasUser_to_organizations!: Sequelize.HasManyHasAssociationsMixin<user_to_organization, user_to_organizationId>;
  countUser_to_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany user_to_organization via user
  user_user_to_organizations!: user_to_organization[];
  getUser_user_to_organizations!: Sequelize.HasManyGetAssociationsMixin<user_to_organization>;
  setUser_user_to_organizations!: Sequelize.HasManySetAssociationsMixin<user_to_organization, user_to_organizationId>;
  addUser_user_to_organization!: Sequelize.HasManyAddAssociationMixin<user_to_organization, user_to_organizationId>;
  addUser_user_to_organizations!: Sequelize.HasManyAddAssociationsMixin<user_to_organization, user_to_organizationId>;
  createUser_user_to_organization!: Sequelize.HasManyCreateAssociationMixin<user_to_organization>;
  removeUser_user_to_organization!: Sequelize.HasManyRemoveAssociationMixin<user_to_organization, user_to_organizationId>;
  removeUser_user_to_organizations!: Sequelize.HasManyRemoveAssociationsMixin<user_to_organization, user_to_organizationId>;
  hasUser_user_to_organization!: Sequelize.HasManyHasAssociationMixin<user_to_organization, user_to_organizationId>;
  hasUser_user_to_organizations!: Sequelize.HasManyHasAssociationsMixin<user_to_organization, user_to_organizationId>;
  countUser_user_to_organizations!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users hasMany websocket_event via user_created
  websocket_events!: websocket_event[];
  getWebsocket_events!: Sequelize.HasManyGetAssociationsMixin<websocket_event>;
  setWebsocket_events!: Sequelize.HasManySetAssociationsMixin<websocket_event, websocket_eventId>;
  addWebsocket_event!: Sequelize.HasManyAddAssociationMixin<websocket_event, websocket_eventId>;
  addWebsocket_events!: Sequelize.HasManyAddAssociationsMixin<websocket_event, websocket_eventId>;
  createWebsocket_event!: Sequelize.HasManyCreateAssociationMixin<websocket_event>;
  removeWebsocket_event!: Sequelize.HasManyRemoveAssociationMixin<websocket_event, websocket_eventId>;
  removeWebsocket_events!: Sequelize.HasManyRemoveAssociationsMixin<websocket_event, websocket_eventId>;
  hasWebsocket_event!: Sequelize.HasManyHasAssociationMixin<websocket_event, websocket_eventId>;
  hasWebsocket_events!: Sequelize.HasManyHasAssociationsMixin<websocket_event, websocket_eventId>;
  countWebsocket_events!: Sequelize.HasManyCountAssociationsMixin;
  // directus_users belongsTo group via active_group
  active_group_group!: group;
  getActive_group_group!: Sequelize.BelongsToGetAssociationMixin<group>;
  setActive_group_group!: Sequelize.BelongsToSetAssociationMixin<group, groupId>;
  createActive_group_group!: Sequelize.BelongsToCreateAssociationMixin<group>;
  // directus_users belongsTo organization via active_organization
  active_organization_organization!: organization;
  getActive_organization_organization!: Sequelize.BelongsToGetAssociationMixin<organization>;
  setActive_organization_organization!: Sequelize.BelongsToSetAssociationMixin<organization, organizationId>;
  createActive_organization_organization!: Sequelize.BelongsToCreateAssociationMixin<organization>;
  // directus_users belongsTo strength_session via active_strength_session
  active_strength_session_strength_session!: strength_session;
  getActive_strength_session_strength_session!: Sequelize.BelongsToGetAssociationMixin<strength_session>;
  setActive_strength_session_strength_session!: Sequelize.BelongsToSetAssociationMixin<strength_session, strength_sessionId>;
  createActive_strength_session_strength_session!: Sequelize.BelongsToCreateAssociationMixin<strength_session>;
  // directus_users belongsTo swl_wall via swl_wall
  swl_wall_swl_wall!: swl_wall;
  getSwl_wall_swl_wall!: Sequelize.BelongsToGetAssociationMixin<swl_wall>;
  setSwl_wall_swl_wall!: Sequelize.BelongsToSetAssociationMixin<swl_wall, swl_wallId>;
  createSwl_wall_swl_wall!: Sequelize.BelongsToCreateAssociationMixin<swl_wall>;

  static initModel(sequelize: Sequelize.Sequelize): typeof directus_users {
    return directus_users.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: true,
      unique: "directus_users_email_unique"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true
    },
    avatar: {
      type: DataTypes.UUID,
      allowNull: true
    },
    language: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    theme: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "auto"
    },
    tfa_secret: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: false,
      defaultValue: "active"
    },
    role: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_roles',
        key: 'id'
      }
    },
    token: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "directus_users_token_unique"
    },
    last_access: {
      type: DataTypes.DATE,
      allowNull: true
    },
    last_page: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    provider: {
      type: DataTypes.STRING(128),
      allowNull: false,
      defaultValue: "default"
    },
    external_identifier: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: "directus_users_external_identifier_unique"
    },
    auth_data: {
      type: DataTypes.JSON,
      allowNull: true
    },
    email_notifications: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    active_organization: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'organization',
        key: 'id'
      }
    },
    avatar_slug: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    color: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    date_created: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    onboarding_completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    persistent: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    self_identified_signature_strengths: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL"
    },
    skolon_uuid: {
      type: DataTypes.UUID,
      allowNull: true,
      unique: "directus_users_skolon_uuid_unique"
    },
    swl_wall: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'swl_wall',
        key: 'id'
      },
      unique: "directus_users_swl_wall_unique"
    },
    temporary_write_access_folder: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'directus_folders',
        key: 'id'
      }
    },
    temporary_write_access_folder_granted_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    top_strengths: {
      type: DataTypes.JSON,
      allowNull: true
    },
    credit_count: {
      type: DataTypes.DECIMAL,
      allowNull: true,
      defaultValue: 0
    },
    active_group: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'group',
        key: 'id'
      }
    },
    active_strength_session: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'strength_session',
        key: 'id'
      }
    },
    stg_v1_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "NULL",
      unique: "directus_users_stg_v1_id_unique"
    },
    is_strength_session_user: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'directus_users',
    schema: 'public',
    timestamps: false,
    indexes: [
      {
        name: "directus_users_email_unique",
        unique: true,
        fields: [
          { name: "email" },
        ]
      },
      {
        name: "directus_users_external_identifier_unique",
        unique: true,
        fields: [
          { name: "external_identifier" },
        ]
      },
      {
        name: "directus_users_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "directus_users_skolon_uuid_unique",
        unique: true,
        fields: [
          { name: "skolon_uuid" },
        ]
      },
      {
        name: "directus_users_stg_v1_id_unique",
        unique: true,
        fields: [
          { name: "stg_v1_id" },
        ]
      },
      {
        name: "directus_users_swl_wall_unique",
        unique: true,
        fields: [
          { name: "swl_wall" },
        ]
      },
      {
        name: "directus_users_token_unique",
        unique: true,
        fields: [
          { name: "token" },
        ]
      },
    ]
  });
  }
}
