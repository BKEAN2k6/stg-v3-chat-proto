import {type Request, type Response} from 'express';
import mongoose from 'mongoose';
import {MemoryGame, Group, JoinCode} from '../../../models/index.js';
import {
  type CreateMemoryGameRequest,
  type CreateMemoryGameParameters,
  type CreateMemoryGameResponse,
} from '../../client/ApiTypes.js';

const strengthSlugs: StrengthSlug[] = [
  'carefulness',
  'compassion',
  'courage',
  'creativity',
  'curiosity',
  'enthusiasm',
  'fairness',
  'forgiveness',
  'gratitude',
  'grit',
  'honesty',
  'hope',
  'humour',
  'judgement',
  'kindness',
  'leadership',
  'love',
  'loveOfBeauty',
  'loveOfLearning',
  'modesty',
  'perseverance',
  'perspective',
  'selfRegulation',
  'socialIntelligence',
  'spirituality',
  'teamwork',
];

function shuffle(array: StrengthSlug[]) {
  const arrayCopy = [...array];
  let currentIndex = arrayCopy.length;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [arrayCopy[currentIndex], arrayCopy[randomIndex]] = [
      arrayCopy[randomIndex],
      arrayCopy[currentIndex],
    ];
  }

  return arrayCopy;
}

export async function createMemoryGame(
  request: Request,
  response: Response,
): Promise<void> {
  const {id: group} = request.params as CreateMemoryGameParameters;
  const {numberOfCards} = request.body as CreateMemoryGameRequest;
  const createdBy = new mongoose.Types.ObjectId(request.user.id);

  if (!(await Group.exists({_id: group}))) {
    response.status(404).json({error: 'Group not found'});
    return;
  }

  const gameStrengths = shuffle([...strengthSlugs]).slice(0, numberOfCards / 2);
  const cardStrengths = shuffle([...gameStrengths, ...gameStrengths]);
  const cards = cardStrengths.map((strength) => ({
    _id: new mongoose.Types.ObjectId(),
    strength,
  }));

  const joinCode = new JoinCode();
  await joinCode.generate();

  const game = await MemoryGame.create({
    group,
    createdBy,
    cards,
    code: joinCode.code,
    codeActiveUntil: joinCode.codeActiveUntil,
  });

  joinCode.game = game._id;
  await joinCode.save();

  response.status(201).json(game.toJSON() satisfies CreateMemoryGameResponse);
}
