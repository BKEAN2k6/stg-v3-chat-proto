import {type EventConfig} from '../../types/routeconfig';
import definitions from '../schemas/definitions';
import {communityStats} from './communityStats';
import {communityPosts} from './post';
import {hostSprint} from './hostSprint';
import {playerSprint} from './playerSprint';
import {memoryGame} from './memoryGame';

const socketEvents: EventConfig[] = [
  communityStats,
  communityPosts,
  hostSprint,
  playerSprint,
  memoryGame,
];

for (const event of socketEvents) {
  for (const method of Object.keys(event.events)) {
    const eventConfig = event.events[method as keyof typeof event.events];
    if (eventConfig) {
      eventConfig.definitions = definitions;
    }
  }
}

export default socketEvents;
