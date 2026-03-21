import {type Reaction} from '@/api/ApiTypes';

export const reactionTypes = [
  'like',
  'compassion',
  'courage',
  'creativity',
  'humour',
  'love',
  'perseverance',
] as Array<Reaction['type']>;

export const reactionIcons = {
  like: `/images/reactions/like.png`,
  compassion: `/images/reactions/compassion.png`,
  courage: `/images/reactions/courage.png`,
  creativity: `/images/reactions/creativity.png`,
  humour: `/images/reactions/humour.png`,
  love: `/images/reactions/love.png`,
  perseverance: `/images/reactions/perseverance.png`,
};

export const getUniqueReactions = (reactions: Reaction[]) => {
  const uniqueReactionTypes = new Set(
    reactions.map((reaction) => reaction.type),
  );
  return Array.from(uniqueReactionTypes).sort();
};
