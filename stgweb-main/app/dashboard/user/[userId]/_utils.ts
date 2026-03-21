export type UserItem = {
  id: string;
  name: string;
  avatar: string;
  avatarSlug: string;
  color: string;
  strengthWallId: string;
};

export const fetchUserData = async (directus: any, userId: string) => {
  const userQuery = await directus.items('directus_users').readOne(userId);

  if (!userQuery) return;

  return {
    id: userQuery.id,
    name: `${userQuery.first_name} ${userQuery.last_name}`,
    avatar: userQuery.avatar,
    avatarSlug: userQuery.avatarSlug,
    color: userQuery.color,
    strengthWallId: userQuery.swl_wall,
  };
};
