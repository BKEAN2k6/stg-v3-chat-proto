import {avatarColors, avatarSlugs} from './avatar-data';

export async function getAllUsedSlugAndColorPairs(
  directus: any,
  orgId: string,
) {
  const userLinks = await directus.items('user_to_organization').readByQuery({
    fields: ['user.avatar_slug', 'user.color'],
    filter: {
      organization: {
        id: {
          _eq: orgId,
        },
      },
    },
    limit: -1,
  });
  return userLinks.data
    .filter((userLink: any) => userLink.user.avatar_slug)
    .map((userLink: any) => ({
      slug: userLink.user.avatar_slug,
      color: userLink.user.color,
    }));
}

export function getRandomSlugColorPair(
  usedPairs: Array<{slug: string; color: string}>,
) {
  const allSlugs = avatarSlugs;
  const allColors = avatarColors;

  // Create all possible combinations
  const allCombinations = [];
  for (const slug of allSlugs) {
    for (const color of allColors) {
      allCombinations.push({slug, color});
    }
  }

  // Filter out used combinations
  const availableCombinations = allCombinations.filter(
    (combination) =>
      !usedPairs.some(
        (usedPair) =>
          usedPair.slug === combination.slug &&
          usedPair.color === combination.color,
      ),
  );

  // If there are available combinations, return a random one
  if (availableCombinations.length > 0) {
    const randomIndex = Math.floor(
      Math.random() * availableCombinations.length,
    );
    return availableCombinations[randomIndex];
  }

  // Otherwise, return a random combination from all possible combinations
  const randomIndex = Math.floor(Math.random() * allCombinations.length);
  return allCombinations[randomIndex];
}
