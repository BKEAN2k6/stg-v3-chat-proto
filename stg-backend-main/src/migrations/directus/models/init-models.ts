import type { Sequelize } from "sequelize";
import { analytics_event as _analytics_event } from "./analytics-event";
import type { analytics_eventAttributes, analytics_eventCreationAttributes } from "./analytics-event";
import { analytics_session as _analytics_session } from "./analytics-session";
import type { analytics_sessionAttributes, analytics_sessionCreationAttributes } from "./analytics-session";
import { directus_activity as _directus_activity } from "./directus-activity";
import type { directus_activityAttributes, directus_activityCreationAttributes } from "./directus-activity";
import { directus_collections as _directus_collections } from "./directus-collections";
import type { directus_collectionsAttributes, directus_collectionsCreationAttributes } from "./directus-collections";
import { directus_dashboards as _directus_dashboards } from "./directus-dashboards";
import type { directus_dashboardsAttributes, directus_dashboardsCreationAttributes } from "./directus-dashboards";
import { directus_fields as _directus_fields } from "./directus-fields";
import type { directus_fieldsAttributes, directus_fieldsCreationAttributes } from "./directus-fields";
import { directus_files as _directus_files } from "./directus-files";
import type { directus_filesAttributes, directus_filesCreationAttributes } from "./directus-files";
import { directus_flows as _directus_flows } from "./directus-flows";
import type { directus_flowsAttributes, directus_flowsCreationAttributes } from "./directus-flows";
import { directus_folders as _directus_folders } from "./directus-folders";
import type { directus_foldersAttributes, directus_foldersCreationAttributes } from "./directus-folders";
import { directus_migrations as _directus_migrations } from "./directus-migrations";
import type { directus_migrationsAttributes, directus_migrationsCreationAttributes } from "./directus-migrations";
import { directus_notifications as _directus_notifications } from "./directus-notifications";
import type { directus_notificationsAttributes, directus_notificationsCreationAttributes } from "./directus-notifications";
import { directus_operations as _directus_operations } from "./directus-operations";
import type { directus_operationsAttributes, directus_operationsCreationAttributes } from "./directus-operations";
import { directus_panels as _directus_panels } from "./directus-panels";
import type { directus_panelsAttributes, directus_panelsCreationAttributes } from "./directus-panels";
import { directus_permissions as _directus_permissions } from "./directus-permissions";
import type { directus_permissionsAttributes, directus_permissionsCreationAttributes } from "./directus-permissions";
import { directus_presets as _directus_presets } from "./directus-presets";
import type { directus_presetsAttributes, directus_presetsCreationAttributes } from "./directus-presets";
import { directus_relations as _directus_relations } from "./directus-relations";
import type { directus_relationsAttributes, directus_relationsCreationAttributes } from "./directus-relations";
import { directus_revisions as _directus_revisions } from "./directus-revisions";
import type { directus_revisionsAttributes, directus_revisionsCreationAttributes } from "./directus-revisions";
import { directus_roles as _directus_roles } from "./directus-roles";
import type { directus_rolesAttributes, directus_rolesCreationAttributes } from "./directus-roles";
import { directus_sessions as _directus_sessions } from "./directus-sessions";
import type { directus_sessionsAttributes, directus_sessionsCreationAttributes } from "./directus-sessions";
import { directus_settings as _directus_settings } from "./directus-settings";
import type { directus_settingsAttributes, directus_settingsCreationAttributes } from "./directus-settings";
import { directus_shares as _directus_shares } from "./directus-shares";
import type { directus_sharesAttributes, directus_sharesCreationAttributes } from "./directus-shares";
import { directus_translations as _directus_translations } from "./directus-translations";
import type { directus_translationsAttributes, directus_translationsCreationAttributes } from "./directus-translations";
import { directus_users as _directus_users } from "./directus-users";
import type { directus_usersAttributes, directus_usersCreationAttributes } from "./directus-users";
import { directus_webhooks as _directus_webhooks } from "./directus-webhooks";
import type { directus_webhooksAttributes, directus_webhooksCreationAttributes } from "./directus-webhooks";
import { email_delivery_queue_item as _email_delivery_queue_item } from "./email-delivery-queue-item";
import type { email_delivery_queue_itemAttributes, email_delivery_queue_itemCreationAttributes } from "./email-delivery-queue-item";
import { granted_reward as _granted_reward } from "./granted-reward";
import type { granted_rewardAttributes, granted_rewardCreationAttributes } from "./granted-reward";
import { group as _group } from "./group";
import type { groupAttributes, groupCreationAttributes } from "./group";
import { language as _language } from "./language";
import type { languageAttributes, languageCreationAttributes } from "./language";
import { login_token as _login_token } from "./login-token";
import type { login_tokenAttributes, login_tokenCreationAttributes } from "./login-token";
import { organization as _organization } from "./organization";
import type { organizationAttributes, organizationCreationAttributes } from "./organization";
import { organization_t9n as _organization_t9n } from "./organization-t-9-n";
import type { organization_t9nAttributes, organization_t9nCreationAttributes } from "./organization-t-9-n";
import { organization_timeseries_data as _organization_timeseries_data } from "./organization-timeseries-data";
import type { organization_timeseries_dataAttributes, organization_timeseries_dataCreationAttributes } from "./organization-timeseries-data";
import { parent_organization as _parent_organization } from "./parent-organization";
import type { parent_organizationAttributes, parent_organizationCreationAttributes } from "./parent-organization";
import { parent_organization_t9n as _parent_organization_t9n } from "./parent-organization-t-9-n";
import type { parent_organization_t9nAttributes, parent_organization_t9nCreationAttributes } from "./parent-organization-t-9-n";
import { reward as _reward } from "./reward";
import type { rewardAttributes, rewardCreationAttributes } from "./reward";
import { skolon_entity_version as _skolon_entity_version } from "./skolon-entity-version";
import type { skolon_entity_versionAttributes, skolon_entity_versionCreationAttributes } from "./skolon-entity-version";
import { strength as _strength } from "./strength";
import type { strengthAttributes, strengthCreationAttributes } from "./strength";
import { strength_session as _strength_session } from "./strength-session";
import type { strength_sessionAttributes, strength_sessionCreationAttributes } from "./strength-session";
import { strength_session_new_player as _strength_session_new_player } from "./strength-session-new-player";
import type { strength_session_new_playerAttributes, strength_session_new_playerCreationAttributes } from "./strength-session-new-player";
import { strength_session_new_status as _strength_session_new_status } from "./strength-session-new-status";
import type { strength_session_new_statusAttributes, strength_session_new_statusCreationAttributes } from "./strength-session-new-status";
import { strength_session_new_strength as _strength_session_new_strength } from "./strength-session-new-strength";
import type { strength_session_new_strengthAttributes, strength_session_new_strengthCreationAttributes } from "./strength-session-new-strength";
import { strength_session_strength as _strength_session_strength } from "./strength-session-strength";
import type { strength_session_strengthAttributes, strength_session_strengthCreationAttributes } from "./strength-session-strength";
import { strength_t9n as _strength_t9n } from "./strength-t-9-n";
import type { strength_t9nAttributes, strength_t9nCreationAttributes } from "./strength-t-9-n";
import { strengths_valley_level as _strengths_valley_level } from "./strengths-valley-level";
import type { strengths_valley_levelAttributes, strengths_valley_levelCreationAttributes } from "./strengths-valley-level";
import { strengths_valley_level_t9n as _strengths_valley_level_t9n } from "./strengths-valley-level-t-9-n";
import type { strengths_valley_level_t9nAttributes, strengths_valley_level_t9nCreationAttributes } from "./strengths-valley-level-t-9-n";
import { strengths_valley_map as _strengths_valley_map } from "./strengths-valley-map";
import type { strengths_valley_mapAttributes, strengths_valley_mapCreationAttributes } from "./strengths-valley-map";
import { strengths_valley_map_t9n as _strengths_valley_map_t9n } from "./strengths-valley-map-t-9-n";
import type { strengths_valley_map_t9nAttributes, strengths_valley_map_t9nCreationAttributes } from "./strengths-valley-map-t-9-n";
import { strengths_valley_round as _strengths_valley_round } from "./strengths-valley-round";
import type { strengths_valley_roundAttributes, strengths_valley_roundCreationAttributes } from "./strengths-valley-round";
import { strengths_valley_round_t9n as _strengths_valley_round_t9n } from "./strengths-valley-round-t-9-n";
import type { strengths_valley_round_t9nAttributes, strengths_valley_round_t9nCreationAttributes } from "./strengths-valley-round-t-9-n";
import { strengths_valley_slide as _strengths_valley_slide } from "./strengths-valley-slide";
import type { strengths_valley_slideAttributes, strengths_valley_slideCreationAttributes } from "./strengths-valley-slide";
import { strengths_valley_slide_t9n as _strengths_valley_slide_t9n } from "./strengths-valley-slide-t-9-n";
import type { strengths_valley_slide_t9nAttributes, strengths_valley_slide_t9nCreationAttributes } from "./strengths-valley-slide-t-9-n";
import { strengths_valley_state as _strengths_valley_state } from "./strengths-valley-state";
import type { strengths_valley_stateAttributes, strengths_valley_stateCreationAttributes } from "./strengths-valley-state";
import { strengths_valley_story as _strengths_valley_story } from "./strengths-valley-story";
import type { strengths_valley_storyAttributes, strengths_valley_storyCreationAttributes } from "./strengths-valley-story";
import { strengths_valley_story_t9n as _strengths_valley_story_t9n } from "./strengths-valley-story-t-9-n";
import type { strengths_valley_story_t9nAttributes, strengths_valley_story_t9nCreationAttributes } from "./strengths-valley-story-t-9-n";
import { swl_item as _swl_item } from "./swl-item";
import type { swl_itemAttributes, swl_itemCreationAttributes } from "./swl-item";
import { swl_item_to_swl_wall as _swl_item_to_swl_wall } from "./swl-item-to-swl-wall";
import type { swl_item_to_swl_wallAttributes, swl_item_to_swl_wallCreationAttributes } from "./swl-item-to-swl-wall";
import { swl_moment as _swl_moment } from "./swl-moment";
import type { swl_momentAttributes, swl_momentCreationAttributes } from "./swl-moment";
import { swl_moment_to_file as _swl_moment_to_file } from "./swl-moment-to-file";
import type { swl_moment_to_fileAttributes, swl_moment_to_fileCreationAttributes } from "./swl-moment-to-file";
import { swl_moment_to_strength as _swl_moment_to_strength } from "./swl-moment-to-strength";
import type { swl_moment_to_strengthAttributes, swl_moment_to_strengthCreationAttributes } from "./swl-moment-to-strength";
import { swl_promotion as _swl_promotion } from "./swl-promotion";
import type { swl_promotionAttributes, swl_promotionCreationAttributes } from "./swl-promotion";
import { swl_wall as _swl_wall } from "./swl-wall";
import type { swl_wallAttributes, swl_wallCreationAttributes } from "./swl-wall";
import { user_to_group as _user_to_group } from "./user-to-group";
import type { user_to_groupAttributes, user_to_groupCreationAttributes } from "./user-to-group";
import { user_to_organization as _user_to_organization } from "./user-to-organization";
import type { user_to_organizationAttributes, user_to_organizationCreationAttributes } from "./user-to-organization";
import { websocket_event as _websocket_event } from "./websocket-event";
import type { websocket_eventAttributes, websocket_eventCreationAttributes } from "./websocket-event";

export {
  _analytics_event as analytics_event,
  _analytics_session as analytics_session,
  _directus_activity as directus_activity,
  _directus_collections as directus_collections,
  _directus_dashboards as directus_dashboards,
  _directus_fields as directus_fields,
  _directus_files as directus_files,
  _directus_flows as directus_flows,
  _directus_folders as directus_folders,
  _directus_migrations as directus_migrations,
  _directus_notifications as directus_notifications,
  _directus_operations as directus_operations,
  _directus_panels as directus_panels,
  _directus_permissions as directus_permissions,
  _directus_presets as directus_presets,
  _directus_relations as directus_relations,
  _directus_revisions as directus_revisions,
  _directus_roles as directus_roles,
  _directus_sessions as directus_sessions,
  _directus_settings as directus_settings,
  _directus_shares as directus_shares,
  _directus_translations as directus_translations,
  _directus_users as directus_users,
  _directus_webhooks as directus_webhooks,
  _email_delivery_queue_item as email_delivery_queue_item,
  _granted_reward as granted_reward,
  _group as group,
  _language as language,
  _login_token as login_token,
  _organization as organization,
  _organization_t9n as organization_t9n,
  _organization_timeseries_data as organization_timeseries_data,
  _parent_organization as parent_organization,
  _parent_organization_t9n as parent_organization_t9n,
  _reward as reward,
  _skolon_entity_version as skolon_entity_version,
  _strength as strength,
  _strength_session as strength_session,
  _strength_session_new_player as strength_session_new_player,
  _strength_session_new_status as strength_session_new_status,
  _strength_session_new_strength as strength_session_new_strength,
  _strength_session_strength as strength_session_strength,
  _strength_t9n as strength_t9n,
  _strengths_valley_level as strengths_valley_level,
  _strengths_valley_level_t9n as strengths_valley_level_t9n,
  _strengths_valley_map as strengths_valley_map,
  _strengths_valley_map_t9n as strengths_valley_map_t9n,
  _strengths_valley_round as strengths_valley_round,
  _strengths_valley_round_t9n as strengths_valley_round_t9n,
  _strengths_valley_slide as strengths_valley_slide,
  _strengths_valley_slide_t9n as strengths_valley_slide_t9n,
  _strengths_valley_state as strengths_valley_state,
  _strengths_valley_story as strengths_valley_story,
  _strengths_valley_story_t9n as strengths_valley_story_t9n,
  _swl_item as swl_item,
  _swl_item_to_swl_wall as swl_item_to_swl_wall,
  _swl_moment as swl_moment,
  _swl_moment_to_file as swl_moment_to_file,
  _swl_moment_to_strength as swl_moment_to_strength,
  _swl_promotion as swl_promotion,
  _swl_wall as swl_wall,
  _user_to_group as user_to_group,
  _user_to_organization as user_to_organization,
  _websocket_event as websocket_event,
};

export type {
  analytics_eventAttributes,
  analytics_eventCreationAttributes,
  analytics_sessionAttributes,
  analytics_sessionCreationAttributes,
  directus_activityAttributes,
  directus_activityCreationAttributes,
  directus_collectionsAttributes,
  directus_collectionsCreationAttributes,
  directus_dashboardsAttributes,
  directus_dashboardsCreationAttributes,
  directus_fieldsAttributes,
  directus_fieldsCreationAttributes,
  directus_filesAttributes,
  directus_filesCreationAttributes,
  directus_flowsAttributes,
  directus_flowsCreationAttributes,
  directus_foldersAttributes,
  directus_foldersCreationAttributes,
  directus_migrationsAttributes,
  directus_migrationsCreationAttributes,
  directus_notificationsAttributes,
  directus_notificationsCreationAttributes,
  directus_operationsAttributes,
  directus_operationsCreationAttributes,
  directus_panelsAttributes,
  directus_panelsCreationAttributes,
  directus_permissionsAttributes,
  directus_permissionsCreationAttributes,
  directus_presetsAttributes,
  directus_presetsCreationAttributes,
  directus_relationsAttributes,
  directus_relationsCreationAttributes,
  directus_revisionsAttributes,
  directus_revisionsCreationAttributes,
  directus_rolesAttributes,
  directus_rolesCreationAttributes,
  directus_sessionsAttributes,
  directus_sessionsCreationAttributes,
  directus_settingsAttributes,
  directus_settingsCreationAttributes,
  directus_sharesAttributes,
  directus_sharesCreationAttributes,
  directus_translationsAttributes,
  directus_translationsCreationAttributes,
  directus_usersAttributes,
  directus_usersCreationAttributes,
  directus_webhooksAttributes,
  directus_webhooksCreationAttributes,
  email_delivery_queue_itemAttributes,
  email_delivery_queue_itemCreationAttributes,
  granted_rewardAttributes,
  granted_rewardCreationAttributes,
  groupAttributes,
  groupCreationAttributes,
  languageAttributes,
  languageCreationAttributes,
  login_tokenAttributes,
  login_tokenCreationAttributes,
  organizationAttributes,
  organizationCreationAttributes,
  organization_t9nAttributes,
  organization_t9nCreationAttributes,
  organization_timeseries_dataAttributes,
  organization_timeseries_dataCreationAttributes,
  parent_organizationAttributes,
  parent_organizationCreationAttributes,
  parent_organization_t9nAttributes,
  parent_organization_t9nCreationAttributes,
  rewardAttributes,
  rewardCreationAttributes,
  skolon_entity_versionAttributes,
  skolon_entity_versionCreationAttributes,
  strengthAttributes,
  strengthCreationAttributes,
  strength_sessionAttributes,
  strength_sessionCreationAttributes,
  strength_session_new_playerAttributes,
  strength_session_new_playerCreationAttributes,
  strength_session_new_statusAttributes,
  strength_session_new_statusCreationAttributes,
  strength_session_new_strengthAttributes,
  strength_session_new_strengthCreationAttributes,
  strength_session_strengthAttributes,
  strength_session_strengthCreationAttributes,
  strength_t9nAttributes,
  strength_t9nCreationAttributes,
  strengths_valley_levelAttributes,
  strengths_valley_levelCreationAttributes,
  strengths_valley_level_t9nAttributes,
  strengths_valley_level_t9nCreationAttributes,
  strengths_valley_mapAttributes,
  strengths_valley_mapCreationAttributes,
  strengths_valley_map_t9nAttributes,
  strengths_valley_map_t9nCreationAttributes,
  strengths_valley_roundAttributes,
  strengths_valley_roundCreationAttributes,
  strengths_valley_round_t9nAttributes,
  strengths_valley_round_t9nCreationAttributes,
  strengths_valley_slideAttributes,
  strengths_valley_slideCreationAttributes,
  strengths_valley_slide_t9nAttributes,
  strengths_valley_slide_t9nCreationAttributes,
  strengths_valley_stateAttributes,
  strengths_valley_stateCreationAttributes,
  strengths_valley_storyAttributes,
  strengths_valley_storyCreationAttributes,
  strengths_valley_story_t9nAttributes,
  strengths_valley_story_t9nCreationAttributes,
  swl_itemAttributes,
  swl_itemCreationAttributes,
  swl_item_to_swl_wallAttributes,
  swl_item_to_swl_wallCreationAttributes,
  swl_momentAttributes,
  swl_momentCreationAttributes,
  swl_moment_to_fileAttributes,
  swl_moment_to_fileCreationAttributes,
  swl_moment_to_strengthAttributes,
  swl_moment_to_strengthCreationAttributes,
  swl_promotionAttributes,
  swl_promotionCreationAttributes,
  swl_wallAttributes,
  swl_wallCreationAttributes,
  user_to_groupAttributes,
  user_to_groupCreationAttributes,
  user_to_organizationAttributes,
  user_to_organizationCreationAttributes,
  websocket_eventAttributes,
  websocket_eventCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  const analytics_event = _analytics_event.initModel(sequelize);
  const analytics_session = _analytics_session.initModel(sequelize);
  const directus_activity = _directus_activity.initModel(sequelize);
  const directus_collections = _directus_collections.initModel(sequelize);
  const directus_dashboards = _directus_dashboards.initModel(sequelize);
  const directus_fields = _directus_fields.initModel(sequelize);
  const directus_files = _directus_files.initModel(sequelize);
  const directus_flows = _directus_flows.initModel(sequelize);
  const directus_folders = _directus_folders.initModel(sequelize);
  const directus_migrations = _directus_migrations.initModel(sequelize);
  const directus_notifications = _directus_notifications.initModel(sequelize);
  const directus_operations = _directus_operations.initModel(sequelize);
  const directus_panels = _directus_panels.initModel(sequelize);
  const directus_permissions = _directus_permissions.initModel(sequelize);
  const directus_presets = _directus_presets.initModel(sequelize);
  const directus_relations = _directus_relations.initModel(sequelize);
  const directus_revisions = _directus_revisions.initModel(sequelize);
  const directus_roles = _directus_roles.initModel(sequelize);
  const directus_sessions = _directus_sessions.initModel(sequelize);
  const directus_settings = _directus_settings.initModel(sequelize);
  const directus_shares = _directus_shares.initModel(sequelize);
  const directus_translations = _directus_translations.initModel(sequelize);
  const directus_users = _directus_users.initModel(sequelize);
  const directus_webhooks = _directus_webhooks.initModel(sequelize);
  const email_delivery_queue_item = _email_delivery_queue_item.initModel(sequelize);
  const granted_reward = _granted_reward.initModel(sequelize);
  const group = _group.initModel(sequelize);
  const language = _language.initModel(sequelize);
  const login_token = _login_token.initModel(sequelize);
  const organization = _organization.initModel(sequelize);
  const organization_t9n = _organization_t9n.initModel(sequelize);
  const organization_timeseries_data = _organization_timeseries_data.initModel(sequelize);
  const parent_organization = _parent_organization.initModel(sequelize);
  const parent_organization_t9n = _parent_organization_t9n.initModel(sequelize);
  const reward = _reward.initModel(sequelize);
  const skolon_entity_version = _skolon_entity_version.initModel(sequelize);
  const strength = _strength.initModel(sequelize);
  const strength_session = _strength_session.initModel(sequelize);
  const strength_session_new_player = _strength_session_new_player.initModel(sequelize);
  const strength_session_new_status = _strength_session_new_status.initModel(sequelize);
  const strength_session_new_strength = _strength_session_new_strength.initModel(sequelize);
  const strength_session_strength = _strength_session_strength.initModel(sequelize);
  const strength_t9n = _strength_t9n.initModel(sequelize);
  const strengths_valley_level = _strengths_valley_level.initModel(sequelize);
  const strengths_valley_level_t9n = _strengths_valley_level_t9n.initModel(sequelize);
  const strengths_valley_map = _strengths_valley_map.initModel(sequelize);
  const strengths_valley_map_t9n = _strengths_valley_map_t9n.initModel(sequelize);
  const strengths_valley_round = _strengths_valley_round.initModel(sequelize);
  const strengths_valley_round_t9n = _strengths_valley_round_t9n.initModel(sequelize);
  const strengths_valley_slide = _strengths_valley_slide.initModel(sequelize);
  const strengths_valley_slide_t9n = _strengths_valley_slide_t9n.initModel(sequelize);
  const strengths_valley_state = _strengths_valley_state.initModel(sequelize);
  const strengths_valley_story = _strengths_valley_story.initModel(sequelize);
  const strengths_valley_story_t9n = _strengths_valley_story_t9n.initModel(sequelize);
  const swl_item = _swl_item.initModel(sequelize);
  const swl_item_to_swl_wall = _swl_item_to_swl_wall.initModel(sequelize);
  const swl_moment = _swl_moment.initModel(sequelize);
  const swl_moment_to_file = _swl_moment_to_file.initModel(sequelize);
  const swl_moment_to_strength = _swl_moment_to_strength.initModel(sequelize);
  const swl_promotion = _swl_promotion.initModel(sequelize);
  const swl_wall = _swl_wall.initModel(sequelize);
  const user_to_group = _user_to_group.initModel(sequelize);
  const user_to_organization = _user_to_organization.initModel(sequelize);
  const websocket_event = _websocket_event.initModel(sequelize);

  directus_revisions.belongsTo(directus_activity, { as: "activity_directus_activity", foreignKey: "activity"});
  directus_activity.hasMany(directus_revisions, { as: "directus_revisions", foreignKey: "activity"});
  directus_collections.belongsTo(directus_collections, { as: "group_directus_collection", foreignKey: "group"});
  directus_collections.hasMany(directus_collections, { as: "directus_collections", foreignKey: "group"});
  directus_shares.belongsTo(directus_collections, { as: "collection_directus_collection", foreignKey: "collection"});
  directus_collections.hasMany(directus_shares, { as: "directus_shares", foreignKey: "collection"});
  directus_panels.belongsTo(directus_dashboards, { as: "dashboard_directus_dashboard", foreignKey: "dashboard"});
  directus_dashboards.hasMany(directus_panels, { as: "directus_panels", foreignKey: "dashboard"});
  directus_settings.belongsTo(directus_files, { as: "project_logo_directus_file", foreignKey: "project_logo"});
  directus_files.hasMany(directus_settings, { as: "directus_settings", foreignKey: "project_logo"});
  directus_settings.belongsTo(directus_files, { as: "public_background_directus_file", foreignKey: "public_background"});
  directus_files.hasMany(directus_settings, { as: "public_background_directus_settings", foreignKey: "public_background"});
  directus_settings.belongsTo(directus_files, { as: "public_foreground_directus_file", foreignKey: "public_foreground"});
  directus_files.hasMany(directus_settings, { as: "public_foreground_directus_settings", foreignKey: "public_foreground"});
  group.belongsTo(directus_files, { as: "avatar_directus_file", foreignKey: "avatar"});
  directus_files.hasMany(group, { as: "groups", foreignKey: "avatar"});
  organization.belongsTo(directus_files, { as: "avatar_directus_file", foreignKey: "avatar"});
  directus_files.hasMany(organization, { as: "organizations", foreignKey: "avatar"});
  strengths_valley_map.belongsTo(directus_files, { as: "map_directus_file", foreignKey: "map"});
  directus_files.hasMany(strengths_valley_map, { as: "strengths_valley_maps", foreignKey: "map"});
  strengths_valley_round.belongsTo(directus_files, { as: "background_directus_file", foreignKey: "background"});
  directus_files.hasMany(strengths_valley_round, { as: "strengths_valley_rounds", foreignKey: "background"});
  swl_moment_to_file.belongsTo(directus_files, { as: "directus_files_directus_file", foreignKey: "directus_files"});
  directus_files.hasMany(swl_moment_to_file, { as: "swl_moment_to_files", foreignKey: "directus_files"});
  directus_operations.belongsTo(directus_flows, { as: "flow_directus_flow", foreignKey: "flow"});
  directus_flows.hasMany(directus_operations, { as: "directus_operations", foreignKey: "flow"});
  directus_files.belongsTo(directus_folders, { as: "folder_directus_folder", foreignKey: "folder"});
  directus_folders.hasMany(directus_files, { as: "directus_files", foreignKey: "folder"});
  directus_folders.belongsTo(directus_folders, { as: "parent_directus_folder", foreignKey: "parent"});
  directus_folders.hasMany(directus_folders, { as: "directus_folders", foreignKey: "parent"});
  directus_settings.belongsTo(directus_folders, { as: "storage_default_folder_directus_folder", foreignKey: "storage_default_folder"});
  directus_folders.hasMany(directus_settings, { as: "directus_settings", foreignKey: "storage_default_folder"});
  directus_users.belongsTo(directus_folders, { as: "temporary_write_access_folder_directus_folder", foreignKey: "temporary_write_access_folder"});
  directus_folders.hasMany(directus_users, { as: "directus_users", foreignKey: "temporary_write_access_folder"});
  swl_wall.belongsTo(directus_folders, { as: "media_folder_directus_folder", foreignKey: "media_folder"});
  directus_folders.hasMany(swl_wall, { as: "swl_walls", foreignKey: "media_folder"});
  directus_operations.belongsTo(directus_operations, { as: "reject_directus_operation", foreignKey: "reject"});
  directus_operations.hasOne(directus_operations, { as: "directus_operation", foreignKey: "reject"});
  directus_operations.belongsTo(directus_operations, { as: "resolve_directus_operation", foreignKey: "resolve"});
  //directus_operations.hasOne(directus_operations, { as: "resolve_directus_operation", foreignKey: "resolve"});
  directus_revisions.belongsTo(directus_revisions, { as: "parent_directus_revision", foreignKey: "parent"});
  directus_revisions.hasMany(directus_revisions, { as: "directus_revisions", foreignKey: "parent"});
  directus_permissions.belongsTo(directus_roles, { as: "role_directus_role", foreignKey: "role"});
  directus_roles.hasMany(directus_permissions, { as: "directus_permissions", foreignKey: "role"});
  directus_presets.belongsTo(directus_roles, { as: "role_directus_role", foreignKey: "role"});
  directus_roles.hasMany(directus_presets, { as: "directus_presets", foreignKey: "role"});
  directus_shares.belongsTo(directus_roles, { as: "role_directus_role", foreignKey: "role"});
  directus_roles.hasMany(directus_shares, { as: "directus_shares", foreignKey: "role"});
  directus_users.belongsTo(directus_roles, { as: "role_directus_role", foreignKey: "role"});
  directus_roles.hasMany(directus_users, { as: "directus_users", foreignKey: "role"});
  directus_sessions.belongsTo(directus_shares, { as: "share_directus_share", foreignKey: "share"});
  directus_shares.hasMany(directus_sessions, { as: "directus_sessions", foreignKey: "share"});
  analytics_event.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(analytics_event, { as: "analytics_events", foreignKey: "user_created"});
  analytics_session.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(analytics_session, { as: "analytics_sessions", foreignKey: "user_created"});
  directus_dashboards.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(directus_dashboards, { as: "directus_dashboards", foreignKey: "user_created"});
  directus_files.belongsTo(directus_users, { as: "modified_by_directus_user", foreignKey: "modified_by"});
  directus_users.hasMany(directus_files, { as: "directus_files", foreignKey: "modified_by"});
  directus_files.belongsTo(directus_users, { as: "uploaded_by_directus_user", foreignKey: "uploaded_by"});
  directus_users.hasMany(directus_files, { as: "uploaded_by_directus_files", foreignKey: "uploaded_by"});
  directus_flows.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(directus_flows, { as: "directus_flows", foreignKey: "user_created"});
  directus_notifications.belongsTo(directus_users, { as: "recipient_directus_user", foreignKey: "recipient"});
  directus_users.hasMany(directus_notifications, { as: "directus_notifications", foreignKey: "recipient"});
  directus_notifications.belongsTo(directus_users, { as: "sender_directus_user", foreignKey: "sender"});
  directus_users.hasMany(directus_notifications, { as: "sender_directus_notifications", foreignKey: "sender"});
  directus_operations.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(directus_operations, { as: "directus_operations", foreignKey: "user_created"});
  directus_panels.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(directus_panels, { as: "directus_panels", foreignKey: "user_created"});
  directus_presets.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(directus_presets, { as: "directus_presets", foreignKey: "user"});
  directus_sessions.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(directus_sessions, { as: "directus_sessions", foreignKey: "user"});
  directus_shares.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(directus_shares, { as: "directus_shares", foreignKey: "user_created"});
  email_delivery_queue_item.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(email_delivery_queue_item, { as: "email_delivery_queue_items", foreignKey: "user_created"});
  email_delivery_queue_item.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(email_delivery_queue_item, { as: "user_updated_email_delivery_queue_items", foreignKey: "user_updated"});
  granted_reward.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(granted_reward, { as: "granted_rewards", foreignKey: "user_created"});
  granted_reward.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(granted_reward, { as: "user_granted_rewards", foreignKey: "user"});
  group.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(group, { as: "groups", foreignKey: "user_created"});
  group.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(group, { as: "user_updated_groups", foreignKey: "user_updated"});
  login_token.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(login_token, { as: "login_tokens", foreignKey: "user_created"});
  login_token.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(login_token, { as: "user_login_tokens", foreignKey: "user"});
  organization.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(organization, { as: "organizations", foreignKey: "user_created"});
  organization.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(organization, { as: "user_updated_organizations", foreignKey: "user_updated"});
  parent_organization.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(parent_organization, { as: "parent_organizations", foreignKey: "user_created"});
  parent_organization.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(parent_organization, { as: "user_updated_parent_organizations", foreignKey: "user_updated"});
  reward.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(reward, { as: "rewards", foreignKey: "user_created"});
  reward.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(reward, { as: "user_updated_rewards", foreignKey: "user_updated"});
  skolon_entity_version.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(skolon_entity_version, { as: "skolon_entity_versions", foreignKey: "user_created"});
  skolon_entity_version.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(skolon_entity_version, { as: "user_updated_skolon_entity_versions", foreignKey: "user_updated"});
  strength.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(strength, { as: "strengths", foreignKey: "user_created"});
  strength.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(strength, { as: "user_updated_strengths", foreignKey: "user_updated"});
  strength_session.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(strength_session, { as: "strength_sessions", foreignKey: "user_created"});
  strength_session.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(strength_session, { as: "user_updated_strength_sessions", foreignKey: "user_updated"});
  strength_session_new_player.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(strength_session_new_player, { as: "strength_session_new_players", foreignKey: "user"});
  strength_session_strength.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(strength_session_strength, { as: "strength_session_strengths", foreignKey: "user_created"});
  strength_session_strength.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(strength_session_strength, { as: "user_strength_session_strengths", foreignKey: "user"});
  strengths_valley_slide.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(strengths_valley_slide, { as: "strengths_valley_slides", foreignKey: "user_created"});
  strengths_valley_slide.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(strengths_valley_slide, { as: "user_updated_strengths_valley_slides", foreignKey: "user_updated"});
  swl_item.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(swl_item, { as: "swl_items", foreignKey: "user_created"});
  swl_item.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(swl_item, { as: "user_updated_swl_items", foreignKey: "user_updated"});
  swl_moment.belongsTo(directus_users, { as: "created_by_directus_user", foreignKey: "created_by"});
  directus_users.hasMany(swl_moment, { as: "swl_moments", foreignKey: "created_by"});
  swl_moment.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(swl_moment, { as: "user_created_swl_moments", foreignKey: "user_created"});
  swl_moment.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(swl_moment, { as: "user_updated_swl_moments", foreignKey: "user_updated"});
  swl_promotion.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(swl_promotion, { as: "swl_promotions", foreignKey: "user_created"});
  swl_promotion.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(swl_promotion, { as: "user_updated_swl_promotions", foreignKey: "user_updated"});
  swl_wall.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(swl_wall, { as: "swl_walls", foreignKey: "user_created"});
  swl_wall.belongsTo(directus_users, { as: "user_updated_directus_user", foreignKey: "user_updated"});
  directus_users.hasMany(swl_wall, { as: "user_updated_swl_walls", foreignKey: "user_updated"});
  user_to_group.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(user_to_group, { as: "user_to_groups", foreignKey: "user"});
  user_to_organization.belongsTo(directus_users, { as: "inviter_directus_user", foreignKey: "inviter"});
  directus_users.hasMany(user_to_organization, { as: "user_to_organizations", foreignKey: "inviter"});
  user_to_organization.belongsTo(directus_users, { as: "user_directus_user", foreignKey: "user"});
  directus_users.hasMany(user_to_organization, { as: "user_user_to_organizations", foreignKey: "user"});
  websocket_event.belongsTo(directus_users, { as: "user_created_directus_user", foreignKey: "user_created"});
  directus_users.hasMany(websocket_event, { as: "websocket_events", foreignKey: "user_created"});
  directus_users.belongsTo(group, { as: "active_group_group", foreignKey: "active_group"});
  group.hasMany(directus_users, { as: "directus_users", foreignKey: "active_group"});
  strength_session.belongsTo(group, { as: "group_group", foreignKey: "group"});
  group.hasMany(strength_session, { as: "strength_sessions", foreignKey: "group"});
  user_to_group.belongsTo(group, { as: "group_group", foreignKey: "group"});
  group.hasMany(user_to_group, { as: "user_to_groups", foreignKey: "group"});
  organization.belongsTo(language, { as: "default_language_language", foreignKey: "default_language"});
  language.hasMany(organization, { as: "organizations", foreignKey: "default_language"});
  organization_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(organization_t9n, { as: "organization_t9ns", foreignKey: "language_code"});
  parent_organization_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(parent_organization_t9n, { as: "parent_organization_t9ns", foreignKey: "language_code"});
  strength_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strength_t9n, { as: "strength_t9ns", foreignKey: "language_code"});
  strengths_valley_level_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strengths_valley_level_t9n, { as: "strengths_valley_level_t9ns", foreignKey: "language_code"});
  strengths_valley_map_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strengths_valley_map_t9n, { as: "strengths_valley_map_t9ns", foreignKey: "language_code"});
  strengths_valley_round_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strengths_valley_round_t9n, { as: "strengths_valley_round_t9ns", foreignKey: "language_code"});
  strengths_valley_slide_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strengths_valley_slide_t9n, { as: "strengths_valley_slide_t9ns", foreignKey: "language_code"});
  strengths_valley_story_t9n.belongsTo(language, { as: "language_code_language", foreignKey: "language_code"});
  language.hasMany(strengths_valley_story_t9n, { as: "strengths_valley_story_t9ns", foreignKey: "language_code"});
  directus_users.belongsTo(organization, { as: "active_organization_organization", foreignKey: "active_organization"});
  organization.hasMany(directus_users, { as: "directus_users", foreignKey: "active_organization"});
  group.belongsTo(organization, { as: "organization_organization", foreignKey: "organization"});
  organization.hasMany(group, { as: "groups", foreignKey: "organization"});
  organization_t9n.belongsTo(organization, { as: "organization_organization", foreignKey: "organization"});
  organization.hasMany(organization_t9n, { as: "organization_t9ns", foreignKey: "organization"});
  organization_timeseries_data.belongsTo(organization, { as: "organization_organization", foreignKey: "organization"});
  organization.hasMany(organization_timeseries_data, { as: "organization_timeseries_data", foreignKey: "organization"});
  user_to_organization.belongsTo(organization, { as: "organization_organization", foreignKey: "organization"});
  organization.hasMany(user_to_organization, { as: "user_to_organizations", foreignKey: "organization"});
  organization.belongsTo(parent_organization, { as: "parent_organization_parent_organization", foreignKey: "parent_organization"});
  parent_organization.hasMany(organization, { as: "organizations", foreignKey: "parent_organization"});
  parent_organization_t9n.belongsTo(parent_organization, { as: "parent_organization_parent_organization", foreignKey: "parent_organization"});
  parent_organization.hasMany(parent_organization_t9n, { as: "parent_organization_t9ns", foreignKey: "parent_organization"});
  granted_reward.belongsTo(reward, { as: "reward_reward", foreignKey: "reward"});
  reward.hasMany(granted_reward, { as: "granted_rewards", foreignKey: "reward"});
  strength_session_strength.belongsTo(strength, { as: "strength_strength", foreignKey: "strength"});
  strength.hasMany(strength_session_strength, { as: "strength_session_strengths", foreignKey: "strength"});
  strength_t9n.belongsTo(strength, { as: "strength_strength", foreignKey: "strength"});
  strength.hasMany(strength_t9n, { as: "strength_t9ns", foreignKey: "strength"});
  swl_moment_to_strength.belongsTo(strength, { as: "strength_strength", foreignKey: "strength"});
  strength.hasMany(swl_moment_to_strength, { as: "swl_moment_to_strengths", foreignKey: "strength"});
  directus_users.belongsTo(strength_session, { as: "active_strength_session_strength_session", foreignKey: "active_strength_session"});
  strength_session.hasMany(directus_users, { as: "directus_users", foreignKey: "active_strength_session"});
  strength_session_new_player.belongsTo(strength_session, { as: "strength_session_strength_session", foreignKey: "strength_session"});
  strength_session.hasMany(strength_session_new_player, { as: "strength_session_new_players", foreignKey: "strength_session"});
  strength_session_new_status.belongsTo(strength_session, { as: "strength_session_strength_session", foreignKey: "strength_session"});
  strength_session.hasMany(strength_session_new_status, { as: "strength_session_new_statuses", foreignKey: "strength_session"});
  strength_session_new_strength.belongsTo(strength_session, { as: "strength_session_strength_session", foreignKey: "strength_session"});
  strength_session.hasMany(strength_session_new_strength, { as: "strength_session_new_strengths", foreignKey: "strength_session"});
  strength_session_strength.belongsTo(strength_session, { as: "strength_session_strength_session", foreignKey: "strength_session"});
  strength_session.hasMany(strength_session_strength, { as: "strength_session_strengths", foreignKey: "strength_session"});
  swl_moment.belongsTo(strength_session, { as: "strength_session_strength_session", foreignKey: "strength_session"});
  strength_session.hasMany(swl_moment, { as: "swl_moments", foreignKey: "strength_session"});
  strength_session_new_strength.belongsTo(strength_session_strength, { as: "strength_session_strength_strength_session_strength", foreignKey: "strength_session_strength"});
  strength_session_strength.hasMany(strength_session_new_strength, { as: "strength_session_new_strengths", foreignKey: "strength_session_strength"});
  strengths_valley_level_t9n.belongsTo(strengths_valley_level, { as: "strengths_valley_level_strengths_valley_level", foreignKey: "strengths_valley_level"});
  strengths_valley_level.hasMany(strengths_valley_level_t9n, { as: "strengths_valley_level_t9ns", foreignKey: "strengths_valley_level"});
  strengths_valley_slide.belongsTo(strengths_valley_level, { as: "strengths_valley_level_strengths_valley_level", foreignKey: "strengths_valley_level"});
  strengths_valley_level.hasMany(strengths_valley_slide, { as: "strengths_valley_slides", foreignKey: "strengths_valley_level"});
  strengths_valley_map_t9n.belongsTo(strengths_valley_map, { as: "strengths_valley_map_strengths_valley_map", foreignKey: "strengths_valley_map"});
  strengths_valley_map.hasMany(strengths_valley_map_t9n, { as: "strengths_valley_map_t9ns", foreignKey: "strengths_valley_map"});
  strengths_valley_story.belongsTo(strengths_valley_map, { as: "strengths_valley_map_strengths_valley_map", foreignKey: "strengths_valley_map"});
  strengths_valley_map.hasMany(strengths_valley_story, { as: "strengths_valley_stories", foreignKey: "strengths_valley_map"});
  strengths_valley_level.belongsTo(strengths_valley_round, { as: "strengths_valley_round_strengths_valley_round", foreignKey: "strengths_valley_round"});
  strengths_valley_round.hasMany(strengths_valley_level, { as: "strengths_valley_levels", foreignKey: "strengths_valley_round"});
  strengths_valley_round_t9n.belongsTo(strengths_valley_round, { as: "strengths_valley_round_strengths_valley_round", foreignKey: "strengths_valley_round"});
  strengths_valley_round.hasMany(strengths_valley_round_t9n, { as: "strengths_valley_round_t9ns", foreignKey: "strengths_valley_round"});
  strengths_valley_slide.belongsTo(strengths_valley_round, { as: "strengths_valley_round_end_strengths_valley_round", foreignKey: "strengths_valley_round_end"});
  strengths_valley_round.hasMany(strengths_valley_slide, { as: "strengths_valley_slides", foreignKey: "strengths_valley_round_end"});
  strengths_valley_slide.belongsTo(strengths_valley_round, { as: "strengths_valley_round_strengths_valley_round", foreignKey: "strengths_valley_round"});
  strengths_valley_round.hasMany(strengths_valley_slide, { as: "strengths_valley_round_strengths_valley_slides", foreignKey: "strengths_valley_round"});
  strengths_valley_slide.belongsTo(strengths_valley_round, { as: "strengths_valley_round_start_strengths_valley_round", foreignKey: "strengths_valley_round_start"});
  strengths_valley_round.hasMany(strengths_valley_slide, { as: "strengths_valley_round_start_strengths_valley_slides", foreignKey: "strengths_valley_round_start"});
  strengths_valley_slide_t9n.belongsTo(strengths_valley_slide, { as: "strengths_valley_slide_strengths_valley_slide", foreignKey: "strengths_valley_slide"});
  strengths_valley_slide.hasMany(strengths_valley_slide_t9n, { as: "strengths_valley_slide_t9ns", foreignKey: "strengths_valley_slide"});
  strengths_valley_round.belongsTo(strengths_valley_story, { as: "strengths_valley_story_strengths_valley_story", foreignKey: "strengths_valley_story"});
  strengths_valley_story.hasMany(strengths_valley_round, { as: "strengths_valley_rounds", foreignKey: "strengths_valley_story"});
  strengths_valley_story_t9n.belongsTo(strengths_valley_story, { as: "strengths_valley_story_strengths_valley_story", foreignKey: "strengths_valley_story"});
  strengths_valley_story.hasMany(strengths_valley_story_t9n, { as: "strengths_valley_story_t9ns", foreignKey: "strengths_valley_story"});
  swl_item_to_swl_wall.belongsTo(swl_item, { as: "swl_item_swl_item", foreignKey: "swl_item"});
  swl_item.hasMany(swl_item_to_swl_wall, { as: "swl_item_to_swl_walls", foreignKey: "swl_item"});
  swl_moment.belongsTo(swl_item, { as: "swl_item_swl_item", foreignKey: "swl_item"});
  swl_item.hasMany(swl_moment, { as: "swl_moments", foreignKey: "swl_item"});
  swl_promotion.belongsTo(swl_item, { as: "swl_item_swl_item", foreignKey: "swl_item"});
  swl_item.hasMany(swl_promotion, { as: "swl_promotions", foreignKey: "swl_item"});
  swl_moment_to_file.belongsTo(swl_moment, { as: "swl_moment_swl_moment", foreignKey: "swl_moment"});
  swl_moment.hasMany(swl_moment_to_file, { as: "swl_moment_to_files", foreignKey: "swl_moment"});
  swl_moment_to_strength.belongsTo(swl_moment, { as: "swl_moment_swl_moment", foreignKey: "swl_moment"});
  swl_moment.hasMany(swl_moment_to_strength, { as: "swl_moment_to_strengths", foreignKey: "swl_moment"});
  directus_users.belongsTo(swl_wall, { as: "swl_wall_swl_wall", foreignKey: "swl_wall"});
  swl_wall.hasOne(directus_users, { as: "directus_user", foreignKey: "swl_wall"});
  group.belongsTo(swl_wall, { as: "swl_wall_swl_wall", foreignKey: "swl_wall"});
  swl_wall.hasMany(group, { as: "groups", foreignKey: "swl_wall"});
  organization.belongsTo(swl_wall, { as: "swl_wall_swl_wall", foreignKey: "swl_wall"});
  swl_wall.hasOne(organization, { as: "organization", foreignKey: "swl_wall"});
  swl_item_to_swl_wall.belongsTo(swl_wall, { as: "swl_wall_swl_wall", foreignKey: "swl_wall"});
  swl_wall.hasMany(swl_item_to_swl_wall, { as: "swl_item_to_swl_walls", foreignKey: "swl_wall"});

  return {
    analytics_event: analytics_event,
    analytics_session: analytics_session,
    directus_activity: directus_activity,
    directus_collections: directus_collections,
    directus_dashboards: directus_dashboards,
    directus_fields: directus_fields,
    directus_files: directus_files,
    directus_flows: directus_flows,
    directus_folders: directus_folders,
    directus_migrations: directus_migrations,
    directus_notifications: directus_notifications,
    directus_operations: directus_operations,
    directus_panels: directus_panels,
    directus_permissions: directus_permissions,
    directus_presets: directus_presets,
    directus_relations: directus_relations,
    directus_revisions: directus_revisions,
    directus_roles: directus_roles,
    directus_sessions: directus_sessions,
    directus_settings: directus_settings,
    directus_shares: directus_shares,
    directus_translations: directus_translations,
    directus_users: directus_users,
    directus_webhooks: directus_webhooks,
    email_delivery_queue_item: email_delivery_queue_item,
    granted_reward: granted_reward,
    group: group,
    language: language,
    login_token: login_token,
    organization: organization,
    organization_t9n: organization_t9n,
    organization_timeseries_data: organization_timeseries_data,
    parent_organization: parent_organization,
    parent_organization_t9n: parent_organization_t9n,
    reward: reward,
    skolon_entity_version: skolon_entity_version,
    strength: strength,
    strength_session: strength_session,
    strength_session_new_player: strength_session_new_player,
    strength_session_new_status: strength_session_new_status,
    strength_session_new_strength: strength_session_new_strength,
    strength_session_strength: strength_session_strength,
    strength_t9n: strength_t9n,
    strengths_valley_level: strengths_valley_level,
    strengths_valley_level_t9n: strengths_valley_level_t9n,
    strengths_valley_map: strengths_valley_map,
    strengths_valley_map_t9n: strengths_valley_map_t9n,
    strengths_valley_round: strengths_valley_round,
    strengths_valley_round_t9n: strengths_valley_round_t9n,
    strengths_valley_slide: strengths_valley_slide,
    strengths_valley_slide_t9n: strengths_valley_slide_t9n,
    strengths_valley_state: strengths_valley_state,
    strengths_valley_story: strengths_valley_story,
    strengths_valley_story_t9n: strengths_valley_story_t9n,
    swl_item: swl_item,
    swl_item_to_swl_wall: swl_item_to_swl_wall,
    swl_moment: swl_moment,
    swl_moment_to_file: swl_moment_to_file,
    swl_moment_to_strength: swl_moment_to_strength,
    swl_promotion: swl_promotion,
    swl_wall: swl_wall,
    user_to_group: user_to_group,
    user_to_organization: user_to_organization,
    websocket_event: websocket_event,
  };
}
