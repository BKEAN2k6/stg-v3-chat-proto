import {type LocaleCode} from './locale';
import {
  StrengthFinnishCasesMap,
  type StrengthSlug,
  StrengthSlugs,
  StrengthTranslationMap,
} from '@/lib/strength-data';
import {equalDivision, shuffleArray} from '@/lib/utils';
import type {Moment} from '@/types/moment';

// a "hack" to make it so we get even number of slides with 4 strengths...
// (two strengths get repeated, but that should be fine...)
// used with the carousels to fill all the pages evenly
export function shuffledAndPaddedStrengthSlugs() {
  const slugs = [...StrengthSlugs];
  const shuffledSlugs = [...shuffleArray(slugs)];
  shuffledSlugs.push(shuffledSlugs[8]);
  // shuffledSlugs.push(shuffledSlugs[12])
  return shuffledSlugs;
}

export async function calculateProfileData(
  strengthWallId: string,
  directus: any,
) {
  const momentsQuery = await directus.items('swl_moment').readByQuery({
    fields: ['strengths.strength.slug'],
    filter: {
      _and: [
        {
          swl_item: {
            swl_wall_links: {
              swl_wall: {
                id: {
                  _eq: strengthWallId,
                },
              },
            },
          },
        },
        {
          status: {
            _eq: 'published',
          },
        },
      ],
    },
  });

  const moments = momentsQuery.data as Moment[];

  const strengthCounts: Record<string, number> = {};
  for (const moment of moments) {
    for (const strengtLink of moment.strengths) {
      if (strengthCounts[strengtLink.strength.slug]) {
        strengthCounts[strengtLink.strength.slug] += 1;
      } else {
        strengthCounts[strengtLink.strength.slug] = 1;
      }
    }
  }

  const strengths = Object.keys(strengthCounts).map((key: string) => ({
    strength: key,
    count: strengthCounts[key],
  }));

  strengths.sort((a, b) => {
    if (b.count - a.count === 0) {
      return a.strength.localeCompare(b.strength); // sort alphabetically by strength
    }

    return b.count - a.count; // sort by count in descending order
  });

  const _topStrengths = strengths.slice(0, 5);
  const topSlugs = _topStrengths.map((row) => row.strength);
  const topCounts = _topStrengths.map((row) => row.count);
  const topPercentages = equalDivision(topCounts);
  const topStrengths = topSlugs.map((slug, idx) => [slug, topPercentages[idx]]); // prettier-ignore

  return {
    strengths,
    topStrengths,
  };
}

export function strengthSlugToReceivedText(
  slug: StrengthSlug,
  locale: LocaleCode,
) {
  let strengthReceived = StrengthTranslationMap[slug][locale];
  if (locale === 'fi-FI') {
    // we finns have our own ways, so mold the text in the format that works in Finnish
    strengthReceived = StrengthFinnishCasesMap[slug].partitive;
  }

  return strengthReceived;
}
