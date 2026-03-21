import {type EventConfig} from '../../types/routeconfig.js';
import definitions from '../schemas/definitions/index.js';
import {communityStats} from './communityStats.js';
import {communityPosts} from './post.js';
import {hostSprint} from './hostSprint.js';
import {playerSprint} from './playerSprint.js';
import {memoryGame} from './memoryGame.js';
import {uiVersion} from './uiVersion.js';
import {hostQuiz} from './hostQuiz.js';
import {playerQuiz} from './playerQuiz.js';
import {hostGroupGame} from './hostGroupGame.js';
import {playerGroupGame} from './playerGroupGame.js';

const socketEvents: EventConfig[] = [
  communityStats,
  communityPosts,
  hostSprint,
  playerSprint,
  memoryGame,
  uiVersion,
  hostQuiz,
  playerQuiz,
  hostGroupGame,
  playerGroupGame,
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
