export async function fetchDashboardData(directus: any) {
  return directus.users.me.read({
    fields: [
      'id',
      'swl_wall',
      'active_organization.id',
      'active_organization.translation.language_code',
      'active_organization.translation.name',
      'active_organization.color',
      'active_organization.avatar',
      'active_organization.swl_wall',
      'active_organization.users',
      'active_organization.has_access_to_v1_learn',
      'active_organization.use_nov23_structure_update',
      'active_group.id',
      'active_group.name',
      'active_group.swl_wall',
      'first_name',
      'last_name',
      'avatar',
      'avatar_slug',
      'color',
      'top_strengths',
      'credit_count',
      'organizations',
      'use_nov23_structure_update',
    ],
  });
}
