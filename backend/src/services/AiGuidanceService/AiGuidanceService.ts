import process from 'node:process';
import {differenceInCalendarDays} from 'date-fns';
import {type Types} from 'mongoose';
import OpenAI from 'openai';
import {type DocumentType} from '@typegoose/typegoose';
import {
  Group,
  Article,
  StrengthGoal,
  GroupGame,
  AiGuidanceLog,
} from '../../models/index.js';
import type {Group as GroupModel} from '../../models/Group.js';
import type {User} from '../../models/User.js';
import {
  type LanguageCode,
  type AgeGroup,
  type StrengthSlug,
  type ArticleChapter,
  type AiGuidanceResponse,
} from '../../api/client/ApiTypes.js';
import {getDefaultSelection} from '../../shared/timelineProgress.js';
import {formatTimeAgo} from '../formatTimeAgo.js';
import {calculateStreak} from './streakCalculation.js';
import {calculateDiplomaCount, getCompletedDiplomas} from './diplomaCount.js';

type AiGuidanceResponseWithRationale = AiGuidanceResponse & {
  selectionRationale?: string;
};

type ActivityType =
  | 'lesson'
  | 'game'
  | 'goal_progress'
  | 'goal_completed'
  | 'diploma';

type ActivityRecord = {
  date: Date;
  type: ActivityType;
  id?: string;
  strength?: string;
};

type ArticleProgressEntry = {
  article: Types.ObjectId | string;
  completionDate: Date;
};

type PopulatedGroup = DocumentType<GroupModel> & {
  owner: DocumentType<User>;
  articleProgress: ArticleProgressEntry[];
};

type StrengthGoalLean = {
  strength: StrengthSlug;
  description?: string;
  target: number;
  events: Array<{createdAt: Date}>;
  isSystemCreated?: boolean;
  targetDate: Date;
  createdAt: Date;
  _id: Types.ObjectId;
};

type AiGuidanceContext = {
  currentWeekday: string;
  teacherName: string;
  characterName: string;
  streakWeeks: number;
  streakDescription: string;
  language: LanguageCode;
  ageGroup: AgeGroup;
  lastActivityType: ActivityRecord['type'] | 'none';
  lastActivityDate: string | undefined;
  lastActivityAgo: string | undefined;
  lastActivityDaysAgo: number | undefined;
  lastLessonDate: string | undefined;
  lastLessonAgo: string | undefined;
  lastLessonDaysAgo: number | undefined;
  lastLessonStrengthLocalized: string | undefined;
  lastLessonChapterLocalized: string | undefined;
  lastDiplomaDate: string | undefined;
  lastDiplomaAgo: string | undefined;
  lastDiplomaDaysAgo: number | undefined;
  lastDiplomaStrength: string | undefined;
  lastDiplomaTitle: string;
  gameAnalysis: {
    memory?: {daysAgo: number; ago?: string};
    sprint?: {daysAgo: number; ago?: string};
  };
  next_article_id: string | undefined;
  next_article_strength_localized: string;
  next_article_chapter_localized: string;

  activeGoals: Array<{
    strength: string;
    progress: string;
    createdAgo: string;
    lastProgressAgo: string | undefined;
    id: string;
  }>;
  referencedStrengths: StrengthSlug[];
  milestones: {
    totalLessonsCompleted: number;
    totalDiplomas: number;
    streakWeeks: number;
  };
  diplomaProgress:
    | {
        strengthLocalized: string;
        lessonsCompleted: number;
        lessonsRemaining: number;
      }
    | undefined;
  previousSuggestions: Array<{
    title?: string;
    text: string;
    date: string;
    ago: string | undefined;
    daysAgo: number | undefined;
  }>;
  currentDate: string;
  timeContext: {
    hour: number;
    phase: string;
  };
  lastGamePlayers: string[];
  userCreatedAgo: string | undefined;
  groupCreatedAgo: string | undefined;
};

type MemoryGameLean = {
  players: Array<{_id: Types.ObjectId; nickname: string}>;
  foundPairs: Array<{player: Types.ObjectId}>;
  updatedAt: Date;
};

type SprintGameLean = {
  players: Array<{_id: Types.ObjectId; nickname: string}>;
  sharedStrengths: Array<{to: Types.ObjectId; strength: StrengthSlug}>;
  updatedAt: Date;
};

const CROW_NAMES: Record<LanguageCode, string> = {
  fi: 'Vahvuusvaris',
  sv: 'Styrkekråkan',
  en: 'Strength Crow',
};

const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  fi: 'Finnish',
  sv: 'Swedish',
  en: 'English',
};

// Simplified translation maps for MVP (would ideally be shared)
const CHAPTER_TRANSLATIONS: Record<
  ArticleChapter,
  Record<LanguageCode, string>
> = {
  start: {fi: 'Startti', en: 'Start', sv: 'Lär dig'},
  speak: {fi: 'Viesti', en: 'Speak', sv: 'Prata'},
  act: {fi: 'Treeni', en: 'Act', sv: 'Använd'},
  assess: {fi: 'Mitä opit?', en: 'Assess', sv: 'Reflektera'},
};

// We need to fetch strength translations from DB or have a map.
// For now, loading a subset or relying on English if missing, but simpler to just fetch all translated content if possible.
// Actually, I can just use a placeholder map or fetch the Strength Translation from `Article`? No, simpler to inline common ones or fetch.
// Decision: I'll use a functional map for the Strength Names based on the one I saw in frontend/helpers/strengths.ts
const STRENGTH_TRANSLATIONS: Record<string, Record<LanguageCode, string>> = {
  kindness: {en: 'Kindness', fi: 'Ystävällisyys', sv: 'Vänlighet'},
  selfRegulation: {
    en: 'Self-regulation',
    fi: 'Itsesäätely',
    sv: 'Självreglering',
  },
  perseverance: {en: 'Perseverance', fi: 'Sinnikkyys', sv: 'Uthållighet'},
  teamwork: {en: 'Teamwork', fi: 'Ryhmätyötaidot', sv: 'Samarbetsförmåga'},
  creativity: {en: 'Creativity', fi: 'Luovuus', sv: 'Kreativitet'},
  curiosity: {en: 'Curiosity', fi: 'Uteliaisuus', sv: 'Nyfikenhet'},
  socialIntelligence: {
    en: 'Social Intelligence',
    fi: 'Sosiaalinen älykkyys',
    sv: 'Social intelligens',
  },
  hope: {en: 'Hope', fi: 'Toiveikkuus', sv: 'Hopp'},
  fairness: {en: 'Fairness', fi: 'Reiluus', sv: 'Rättvisa'},
  courage: {en: 'Courage', fi: 'Rohkeus', sv: 'Mod'},
  humour: {en: 'Humour', fi: 'Huumorintaju', sv: 'Humor'},
  compassion: {en: 'Compassion', fi: 'Myötätunto', sv: 'Medkänsla'},
  enthusiasm: {en: 'Enthusiasm', fi: 'Innostus', sv: 'Entusiasm'},
  gratitude: {en: 'Gratitude', fi: 'Kiitollisuus', sv: 'Tacksamhet'},
  honesty: {en: 'Honesty', fi: 'Rehellisyys', sv: 'Ärlighet'},
  forgiveness: {en: 'Forgiveness', fi: 'Anteeksiantavuus', sv: 'Förlåtelse'},
  leadership: {en: 'Leadership', fi: 'Johtajuus', sv: 'Ledarskap'},
  love: {en: 'Love', fi: 'Rakkaus', sv: 'Kärlek'},
  loveOfLearning: {
    en: 'Love of Learning',
    fi: 'Oppimisen ilo',
    sv: 'Lärandets glädje',
  },
  loveOfBeauty: {
    en: 'Love of Beauty',
    fi: 'Kauneuden arvostus',
    sv: 'Uppskatta skönhet',
  },
  perspective: {
    en: 'Perspective',
    fi: 'Näkökulmanottokyky',
    sv: 'Perspektivförmåga',
  },
  judgement: {en: 'Judgement', fi: 'Arviointikyky', sv: 'Omdöme'},
  modesty: {en: 'Modesty', fi: 'Vaatimattomuus', sv: 'Anspråkslöshet'},
  grit: {en: 'Grit', fi: 'Sisukkuus', sv: 'Ihärdighet'},
  spirituality: {en: 'Spirituality', fi: 'Hengellisyys', sv: 'Andlighet'},
  carefulness: {
    en: 'Carefulness',
    fi: 'Harkitsevaisuus',
    sv: 'Eftertänksamhet',
  },
};

const DIPLOMA_TRANSLATIONS: Record<LanguageCode, string> = {
  fi: 'Diplomi',
  en: 'Diploma',
  sv: 'Diplom',
};

// English descriptions for strengths (used in TERMINOLOGY section of prompt)
const STRENGTH_DESCRIPTIONS: Record<StrengthSlug, string> = {
  kindness:
    'Kindness reflects the will to act for the benefit of others. It is ability to see others in positive ways, speak nicely and help others.',
  selfRegulation:
    "Self-regulation is the ability to consciously control one's own actions. It is power to regulate behavior and emotions to suit the situation.",
  perseverance:
    'Perseverance is determination to hold on to the task. It is to continue in face of a seemingly impossible challenge.',
  teamwork:
    'Teamwork skills are reflected in active participation in the group. It is encouragement, enthusiasm and being active.',
  creativity:
    'Creativity involves having the courage to experiment and do things in your own way, being rich in ideas and artistic expression.',
  curiosity:
    'Curiosity means willingness to seek and try, to see and learn a variety of things.',
  socialIntelligence:
    "Social intelligence is the ability to understand one's own and others' feelings, thoughts, and behaviors.",
  hope: 'Hope means having a positive attitude to life and seeing opportunities in the future.',
  fairness:
    'A fair person treats everyone equal. Fairness means flexibility and justice.',
  courage:
    'Courage is the ability to act despite fear and insecurity. Courage opens up opportunities to experience and learn new things.',
  humour:
    'Humour means a tendency to bring playfulness and fun to everyday events.',
  compassion:
    "Compassion is the ability to recognize others' feelings. It means comforting another person in sorrow but also co-celebrating when things go fine.",
  enthusiasm:
    'An enthusiastic person is energetic and works towards the desired goal.',
  gratitude:
    'Gratitude bears the ability to admire small things and pay attention to the good.',
  honesty:
    'Honesty means having a strong sense of justice and defending the truth.',
  forgiveness:
    'A person with the strength of forgiveness is ready to forget the wrong doings she has faced.',
  leadership:
    'Leadership means responsibility for the task and the group. A leader takes care of others and shares the work based on strengths in others.',
  love: 'Love means deep, warm connection to other people, animals, nature or even a hobby.',
  loveOfLearning:
    'Love of learning is described by willingness to get knowledge and experience of something new.',
  loveOfBeauty:
    'Love of beauty describes the ability to recognize excellence in many places.',
  modesty:
    "Modesty shows in letting others shine and staying silent about one's own achievements.",
  grit: 'Grit is characterized by endurance in the face of obstacles, striving to reach a goal that may be far away.',
  spirituality:
    'Spirituality means believing in something bigger and having a sense of purpose in life.',
  carefulness:
    'Carefulness shows in cautiousness while making decisions. A careful person considers matters from many angles.',
  judgement:
    'Judgement means being able to find solutions based on the heaviest evidence.',
  perspective:
    'Perspective is the ability to perceive entities. It is judgment, wisdom, and often also knowledge and life experience.',
};

// Message templates for game analysis

function daysAgo(date: Date | undefined, baseDate: Date): number | undefined {
  if (!date) return undefined;
  return differenceInCalendarDays(baseDate, date);
}

function getGameAnalysisLines(context: AiGuidanceContext): string[] {
  const lines: string[] = [];
  if (context.gameAnalysis.memory) {
    const memoryTiming = context.gameAnalysis.memory.ago ?? 'recently';
    lines.push(`Memory game played ${memoryTiming}.`);
  }

  if (context.gameAnalysis.sprint) {
    const sprintTiming = context.gameAnalysis.sprint.ago ?? 'recently';
    lines.push(`Strength Sprint played ${sprintTiming}.`);
  }

  if (context.lastGamePlayers.length > 0) {
    // Only show up to 20 names to avoid token explosion
    const playerNames = context.lastGamePlayers.slice(0, 20).join(', ');
    lines.push(
      `Participants in the previous game: ${playerNames}. You can refer to them by using their names if the previous suggestions do not call anyone by name. Like "John and Mary must be waiting already for the next lesson!". These names are set by the students themselves so they may contain bad words or other offensive content. Don't use them without thinking.`,
    );
  }

  return lines;
}

function getActiveGoalsLines(context: AiGuidanceContext): string[] {
  const lines: string[] = [];
  if (context.activeGoals.length > 0) {
    for (const g of context.activeGoals) {
      const lastProgress = g.lastProgressAgo
        ? `, last progress ${g.lastProgressAgo}`
        : '';
      lines.push(
        `Active goal: ${g.strength} ${g.progress}, created ${g.createdAgo}${lastProgress}`,
      );
    }
  } else {
    lines.push('Active goal: none');
  }

  return lines;
}

function getPreviousSuggestionsLines(context: AiGuidanceContext): string[] {
  const lines: string[] = [];
  if (context.previousSuggestions.length > 0) {
    lines.push('Previous suggestions (oldest first, avoid repeating):');
    for (const previous of context.previousSuggestions) {
      const previousTiming = previous.ago ?? 'recently';
      const titlePart = previous.title ? `[Title: "${previous.title}"] ` : '';
      lines.push(`- ${titlePart}"${previous.text}" (${previousTiming})`, ''); // Blank line between items
    }
  }

  return lines;
}

function getDetailedActivityHistoryLines(context: AiGuidanceContext): string[] {
  const lines: string[] = [];

  // Last activity timing
  if (context.lastActivityType === 'none') {
    lines.push('Last activity: no recent activity for this group so far.');
  } else {
    const timing =
      context.lastActivityAgo ??
      (context.lastActivityDate
        ? formatTimeAgo(new Date(context.lastActivityDate), new Date())
        : 'recently');
    let activityDesc = `${context.lastActivityType} (${timing})`;

    if (context.lastActivityType === 'goal_progress') {
      activityDesc = `Progress made on a goal (${timing})`;
    } else if (context.lastActivityType === 'goal_completed') {
      activityDesc = `Completed a goal! (${timing})`;
    }

    lines.push(`Last activity: ${activityDesc}`);
  }

  // Last lesson details
  if (
    context.lastLessonStrengthLocalized &&
    context.lastLessonChapterLocalized
  ) {
    const lessonTiming =
      context.lastLessonAgo ??
      (context.lastLessonDate
        ? formatTimeAgo(new Date(context.lastLessonDate), new Date())
        : 'recently');
    lines.push(
      `Last completed lesson: ${context.lastLessonStrengthLocalized} - ${context.lastLessonChapterLocalized} (${lessonTiming})`,
    );
  } else {
    lines.push(
      "This group has not completed any lessons yet. Tell them, in your own words, that once they collect their very first trophy by completing a lesson — even if it's not the one you suggested — you will then be able to continue recommending lessons in the future, starting from where they left off. That's how their journey toward earning the first printable diploma begins! Also, remind them that it's up to the students and the teacher to decide when a lesson is finished and ready to earn its trophy. The definition isn't very strict, but it should reflect that the lesson goals have been meaningfully worked through.",
    );
  }

  // Next lesson
  if (context.next_article_id) {
    lines.push(
      `Next upcoming lesson: ${context.next_article_strength_localized} - ${context.next_article_chapter_localized} (id: ${context.next_article_id})`,
    );
  }

  // Diploma progress
  if (context.diplomaProgress) {
    const {strengthLocalized, lessonsCompleted, lessonsRemaining} =
      context.diplomaProgress;
    lines.push(
      `Current diploma progress: ${strengthLocalized} ${lessonsCompleted}/4 lessons (${lessonsRemaining} remaining)`,
    );
  }

  // Recent diploma celebration
  if (context.lastDiplomaStrength && context.lastDiplomaDaysAgo !== undefined) {
    const diplomaTiming =
      context.lastDiplomaAgo ??
      (context.lastDiplomaDate
        ? formatTimeAgo(new Date(context.lastDiplomaDate), new Date())
        : 'recently');
    lines.push(
      `Recent diploma: ${context.lastDiplomaStrength} ${context.lastDiplomaTitle} (${diplomaTiming})`,
    );
  }

  return lines;
}

function isAiGuidanceResponse(value: unknown): value is AiGuidanceResponse {
  if (!value || typeof value !== 'object') return false;

  const record = value as Record<string, unknown>;
  const {title, suggestionText, activityType} = record;
  const hasRequiredStrings =
    typeof title === 'string' &&
    typeof suggestionText === 'string' &&
    (activityType === 'lesson' ||
      activityType === 'game' ||
      activityType === 'goal');

  if (!hasRequiredStrings) {
    return false;
  }

  if (
    record.activityId !== undefined &&
    typeof record.activityId !== 'string'
  ) {
    return false;
  }

  return true;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AiGuidanceService {
  private static readonly client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY ?? '',
    dangerouslyAllowBrowser: true,
  });

  // eslint-disable-next-line @typescript-eslint/member-ordering, complexity
  static async getGuidanceForGroup(
    groupId: string,
    clientTime: {hour: number; weekday: string},
    userId: string,
  ): Promise<AiGuidanceResponse> {
    const group = (await Group.findById(groupId)
      .populate<{owner: DocumentType<User>}>('owner')
      .exec()) as PopulatedGroup | undefined;

    if (!group) throw new Error('Group not found');

    // 1. Fetch Timeline Articles first (needed for history calculation)
    const timelineArticlesRaw = await Article.find({
      isTimelineArticle: true,
      isHidden: false,
    })
      .select('_id timelineStrength timelineChapter timelineAgeGroup')
      .lean<
        Array<{
          _id: Types.ObjectId;
          timelineStrength: StrengthSlug;
          timelineChapter: ArticleChapter;
          timelineAgeGroup: AgeGroup;
        }>
      >()
      .exec();

    // Map to format expected by shared functions
    const timelineArticles = timelineArticlesRaw.map((a) => ({
      id: a._id.toString(),
      strength: a.timelineStrength,
      chapter: a.timelineChapter,
      ageGroup: a.timelineAgeGroup,
    }));

    const readArticles = group.articleProgress.map((p) => ({
      article: p.article._id.toJSON(),
      completionDate: new Date(p.completionDate).toISOString(),
    }));

    // 2. Aggregate History & Calc Streak
    const history = await this.getGroupHistory(
      group,
      timelineArticles,
      readArticles,
    );
    const sortedHistory = history.sort(
      (a, b) => b.date.getTime() - a.date.getTime(),
    );
    const lastActivity = sortedHistory[0];
    const lastLesson = sortedHistory.find((h) => h.type === 'lesson');
    const streakWeeks = this.calculateStreak(sortedHistory);

    // 3. Identify Next Article (Timeline Logic) - using shared function
    const nextSelection = getDefaultSelection(
      timelineArticles,
      readArticles,
      group.ageGroup,
    );

    // Find the actual article matching the selection
    const nextArticle = timelineArticles.find(
      (a) =>
        a.strength === nextSelection.strength &&
        a.chapter === nextSelection.chapter &&
        a.ageGroup === nextSelection.ageGroup,
    );

    // 3. Last Diploma
    const lastDiploma = sortedHistory.find((h) => h.type === 'diploma');

    // 4. Game Analysis
    const memoryAnalysis = await this.getLastMemoryGameAnalysis(group._id);
    const sprintAnalysis = await this.getLastSprintGameAnalysis(group._id);

    // 5. Active Goals - only latest per strength (matches frontend logic)
    const allGoals = await StrengthGoal.find({
      group: group._id,
    })
      .sort({createdAt: -1})
      .lean<StrengthGoalLean[]>()
      .exec();

    // 6. Last Game Players (for context)
    const lastGamePlayers = await this.getLastGroupGamePlayers(group._id);

    // 7. Previous AI Guidance Logs (for avoiding repetition)
    const previousLogs = await AiGuidanceLog.find({group: group._id})
      .sort({createdAt: -1})
      .limit(5)
      .lean<
        Array<{
          title: string;
          suggestionText: string;
          createdAt: Date;
          ageGroup?: AgeGroup;
          language?: LanguageCode;
        }>
      >()
      .exec();

    // Keep only latest goal per strength (skip system-created)
    const latestPerStrength = new Map<string, StrengthGoalLean>();
    for (const goal of allGoals) {
      if (goal.isSystemCreated) continue;
      if (!latestPerStrength.has(goal.strength)) {
        latestPerStrength.set(goal.strength, goal);
      }
    }

    // Filter to active (not completed, not expired)
    const activeGoalsFiltered = [...latestPerStrength.values()].filter(
      (g) => g.events.length < g.target && new Date(g.targetDate) >= new Date(),
    );

    // 6. Milestones
    const totalChapters = group.articleProgress.length;
    const totalDiplomas = calculateDiplomaCount(timelineArticles, readArticles);

    // 7. Calculate current strength progress towards diploma
    let currentStrengthProgress:
      | {
          strength: StrengthSlug;
          completed: number;
          total: number;
          remaining: number;
        }
      | undefined;
    if (nextArticle) {
      // Count how many lessons of this strength are completed
      const allArticlesForStrength = await Article.find({
        isTimelineArticle: true,
        timelineAgeGroup: group.ageGroup,
        timelineStrength: nextArticle.strength,
        isHidden: false,
      })
        .select('_id timelineStrength timelineChapter')
        .lean<Array<{_id: Types.ObjectId; timelineStrength: StrengthSlug}>>()
        .exec();

      const completedSet = new Set(
        group.articleProgress.map((progress) => progress.article._id.toJSON()),
      );

      const completedInStrength = allArticlesForStrength.filter((a) =>
        completedSet.has(a._id.toString()),
      ).length;

      currentStrengthProgress = {
        strength: nextArticle.strength,
        completed: completedInStrength,
        total: 4, // Always 4 lessons per strength
        remaining: 4 - completedInStrength,
      };
    }

    // 8. Construct Context
    const now = new Date();
    const lastActivityDate = lastActivity?.date;
    const lastLessonDate = lastLesson?.date;
    const lastDiplomaDate = lastDiploma?.date;
    const lastLessonArticle = lastLesson?.id
      ? await Article.findById(lastLesson.id)
          .select('timelineStrength timelineChapter')
          .lean<{
            timelineStrength: StrengthSlug;
            timelineChapter: ArticleChapter;
          }>()
          .exec()
      : undefined;
    const lastLessonStrengthLocalized = lastLessonArticle
      ? (STRENGTH_TRANSLATIONS[lastLessonArticle.timelineStrength]?.[
          group.language
        ] ?? lastLessonArticle.timelineStrength)
      : undefined;
    const lastLessonChapterLocalized = lastLessonArticle
      ? (CHAPTER_TRANSLATIONS[lastLessonArticle.timelineChapter]?.[
          group.language
        ] ?? lastLessonArticle.timelineChapter)
      : undefined;

    const context: AiGuidanceContext = {
      currentWeekday: clientTime.weekday,
      teacherName: group.owner?.firstName ?? 'Teacher',
      characterName: CROW_NAMES[group.language] ?? 'Strength Crow',
      streakWeeks,
      streakDescription: streakWeeks > 0 ? `${streakWeeks} weeks` : '',
      language: group.language,
      ageGroup: group.ageGroup,
      lastActivityType: lastActivity?.type ?? 'none',
      lastActivityDate: lastActivityDate?.toISOString(),
      lastActivityAgo: formatTimeAgo(lastActivityDate, now),
      lastActivityDaysAgo: daysAgo(lastActivityDate, now),
      lastLessonDate: lastLessonDate?.toISOString(),
      lastLessonAgo: formatTimeAgo(lastLessonDate, now),
      lastLessonDaysAgo: daysAgo(lastLessonDate, now),
      lastLessonStrengthLocalized,
      lastLessonChapterLocalized,
      lastDiplomaDate: lastDiplomaDate?.toISOString(),
      lastDiplomaAgo: formatTimeAgo(lastDiplomaDate, now),
      lastDiplomaDaysAgo: daysAgo(lastDiplomaDate, now),
      lastDiplomaStrength: lastDiploma?.strength
        ? (STRENGTH_TRANSLATIONS[lastDiploma.strength]?.[group.language] ??
          lastDiploma.strength)
        : undefined,
      lastDiplomaTitle: DIPLOMA_TRANSLATIONS[group.language] ?? 'Diploma',

      gameAnalysis: {
        memory: memoryAnalysis,
        sprint: sprintAnalysis,
      },

      next_article_id: nextArticle?.id.toString(),
      next_article_strength_localized: nextArticle
        ? (STRENGTH_TRANSLATIONS[nextArticle.strength]?.[group.language] ??
          nextArticle.strength)
        : (STRENGTH_TRANSLATIONS.kindness?.[group.language] ?? 'Kindness'), // Fallback
      next_article_chapter_localized: nextArticle
        ? (CHAPTER_TRANSLATIONS[nextArticle.chapter]?.[group.language] ??
          nextArticle.chapter)
        : (CHAPTER_TRANSLATIONS.start?.[group.language] ?? 'Start'),

      activeGoals: activeGoalsFiltered.map((goal) => {
        const lastEvent =
          goal.events.length > 0 ? goal.events.at(-1) : undefined;
        return {
          strength:
            STRENGTH_TRANSLATIONS[goal.strength]?.[group.language] ??
            goal.strength,
          progress: `${goal.events.length}/${goal.target}`,

          // Use formatTimeAgo for creation time too
          createdAgo: formatTimeAgo(new Date(goal.createdAt), now) ?? 'unknown',
          lastProgressAgo: lastEvent
            ? formatTimeAgo(new Date(lastEvent.createdAt), now)
            : undefined,
          id: goal._id.toString(),
        };
      }),
      referencedStrengths: [
        // Collect all referenced strengths for definitions
        ...(nextArticle?.strength ? [nextArticle.strength] : []),
        ...activeGoalsFiltered.map((g) => g.strength),
        ...(lastDiploma?.strength ? [lastDiploma.strength] : []),
      ].filter((s, i, array) => array.indexOf(s) === i) as StrengthSlug[], // Dedupe
      milestones: {
        totalLessonsCompleted: totalChapters,
        totalDiplomas,
        streakWeeks,
      },
      // Diploma progress for current strength (undefined if all done)
      diplomaProgress: currentStrengthProgress
        ? {
            strengthLocalized:
              STRENGTH_TRANSLATIONS[currentStrengthProgress.strength]?.[
                group.language
              ] ?? currentStrengthProgress.strength,
            lessonsCompleted: currentStrengthProgress.completed,
            lessonsRemaining: currentStrengthProgress.remaining,
          }
        : undefined,
      previousSuggestions: previousLogs.reverse().map((log) => {
        const entryDate = new Date(log.createdAt);
        return {
          title: log.title,
          text: log.suggestionText,
          date: entryDate.toISOString(),
          ago: formatTimeAgo(entryDate, now),
          daysAgo: daysAgo(entryDate, now),
        };
      }),
      currentDate: now.toISOString(),
      timeContext: {
        hour: clientTime.hour,
        phase: (() => {
          const h = clientTime.hour;
          if (h >= 0 && h < 5) return 'Night';
          if (h >= 5 && h < 10) return 'Early Morning';
          if (h >= 10 && h < 11) return 'Mid-Morning';
          if (h >= 11 && h < 13) return 'Lunch Time';
          if (h >= 13 && h < 16) return 'Afternoon';
          if (h >= 16 && h < 18) return 'Late Afternoon';
          return 'Evening'; // 18+
        })(),
      },
      lastGamePlayers,
      userCreatedAgo: group.owner?.createdAt
        ? formatTimeAgo(new Date(group.owner.createdAt), now)
        : undefined,
      groupCreatedAgo: group.createdAt
        ? formatTimeAgo(new Date(group.createdAt), now)
        : undefined,
    };
    const {
      response: suggestion,
      prompt: systemPrompt,
      rawResponse: content,
      usage,
    } = await this.generateSuggestion(
      context,
      group.language,
      previousLogs.at(-1),
    );

    // 7. Convert activityId
    let {activityId} = suggestion;
    switch (suggestion.activityType) {
      case 'lesson': {
        // Use the actual article ID from nextArticle, not the slug from AI
        activityId = nextArticle?.id.toString();

        break;
      }

      case 'game': {
        activityId = suggestion.activityId;

        break;
      }

      case 'goal': {
        // If activityId is a strength slug, check if we have an active goal for it
        const targetStrength = suggestion.activityId as StrengthSlug;

        // Validate that it's actually a valid strength slug
        if (STRENGTH_TRANSLATIONS[targetStrength]) {
          // Find if we have an active goal for this strength
          // Note: activeGoalsFiltered contains goals that are NOT completed and NOT expired
          const existingGoal = activeGoalsFiltered.find(
            (g) => g.strength === targetStrength,
          );

          activityId = existingGoal
            ? existingGoal._id.toString()
            : targetStrength;
        } else {
          // If not, fall back to the original value
          activityId = suggestion.activityId;
        }

        break;
      }
    }

    // 8. Save log for super-admin review
    const log = await AiGuidanceLog.create({
      user: userId,
      group: group._id,
      community: group.community,
      title: suggestion.title,
      suggestionText: suggestion.suggestionText,
      prompt: systemPrompt,
      response: content,
      ageGroup: group.ageGroup,
      language: group.language,
      promptTokens: usage.promptTokens,
      completionTokens: usage.completionTokens,
      totalTokens: usage.totalTokens,
    });
    const logId = log._id.toString();

    // 10. Return with corrected ID
    return {
      ...suggestion,
      activityId,
      logId,
    };
  }

  private static async getLastMemoryGameAnalysis(
    groupId: Types.ObjectId,
  ): Promise<{daysAgo: number; ago?: string} | undefined> {
    const {MemoryGame} = await import('../../models/index.js');
    const lastGame = await MemoryGame.findOne({
      group: groupId,
      gameType: 'memory-game',
      isEnded: true,
    })
      .sort({updatedAt: -1})
      .limit(1)
      .lean<MemoryGameLean>()
      .exec();

    if (!lastGame?.foundPairs?.length) return undefined;

    // Calculate how many days ago
    const gameDate = new Date(lastGame.updatedAt);
    const now = new Date();
    const gameDaysAgo = differenceInCalendarDays(now, gameDate);

    // Count pairs per player
    const playerScores: Record<string, number> = {};
    const playerNicknames: Record<string, string> = {};
    // Map IDs to nicknames
    for (const p of lastGame.players) {
      playerNicknames[p._id.toString()] = p.nickname;
    }

    for (const pair of lastGame.foundPairs) {
      const pid = pair.player.toString();
      playerScores[pid] = (playerScores[pid] ?? 0) + 1;
    }

    const ago = formatTimeAgo(gameDate, now);
    return {daysAgo: gameDaysAgo, ago};
  }

  private static async getLastSprintGameAnalysis(
    groupId: Types.ObjectId,
  ): Promise<{daysAgo: number; ago?: string} | undefined> {
    const {Sprint} = await import('../../models/index.js');

    // Only consider games from the last 24 hours as "recent"
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const lastGame = await Sprint.findOne({
      group: groupId,
      gameType: 'sprint',
      isEnded: true,
      updatedAt: {$gte: oneDayAgo},
    })
      .sort({updatedAt: -1})
      .limit(1)
      .lean<SprintGameLean>()
      .exec();

    if (!lastGame?.sharedStrengths?.length) return undefined;

    const playerNicknames: Record<string, string> = {};
    for (const p of lastGame.players) {
      playerNicknames[p._id.toString()] = p.nickname;
    }

    // Who received most strengths?
    const receivedCounts: Record<string, number> = {};

    for (const share of lastGame.sharedStrengths) {
      const tid = share.to.toString();
      receivedCounts[tid] = (receivedCounts[tid] ?? 0) + 1;
    }

    // Find top receiver
    let topId = '';
    let maxRec = -1;
    for (const [tid, count] of Object.entries(receivedCounts)) {
      if (count > maxRec) {
        maxRec = count;
        topId = tid;
      }
    }

    if (!topId) return undefined;

    // Calculate how many days ago
    const gameDate = new Date(lastGame.updatedAt);
    const now = new Date();
    const gameDaysAgo = differenceInCalendarDays(now, gameDate);

    const ago = formatTimeAgo(gameDate, now);
    return {daysAgo: gameDaysAgo, ago};
  }

  private static async getGroupHistory(
    group: PopulatedGroup,
    timelineArticles: Array<{
      id: string;
      strength: StrengthSlug;
      chapter: ArticleChapter;
      ageGroup: AgeGroup;
    }>,
    readArticles: Array<{article: string; completionDate: string}>,
  ): Promise<ActivityRecord[]> {
    const activities: ActivityRecord[] = [];

    if (group.articleProgress) {
      for (const entry of group.articleProgress) {
        activities.push({
          date: new Date(entry.completionDate),
          type: 'lesson',
          id: entry.article?.toString(),
        });
      }
    }

    // 2a. Goal Progress (events within active/completed goals)
    const strengthGoals = await StrengthGoal.find({group: group._id});
    for (const goal of strengthGoals) {
      for (const event of goal.events) {
        activities.push({
          date: new Date(event.createdAt),
          type: 'goal_progress',
          strength: goal.strength,
        });
      }

      // 2b. Goal Completion - derived from when events reach target
      if (goal.events.length >= goal.target) {
        // Use the last event's date as the completion date
        const lastEvent = goal.events.at(-1);
        if (lastEvent) {
          activities.push({
            date: new Date(lastEvent.createdAt),
            type: 'goal_completed',
            strength: goal.strength,
          });
        }
      }
    }

    // 3. Diplomas - derived from article progress (all 4 chapters completed)
    const completedDiplomas = getCompletedDiplomas(
      timelineArticles,
      readArticles,
    );
    for (const diploma of completedDiplomas) {
      activities.push({
        date: diploma.completionDate,
        type: 'diploma',
        strength: diploma.strength,
      });
    }

    // Games (Memory Game, Sprint, Quiz) from GroupGame model
    const games = await GroupGame.findOne({
      group: group._id,
      isEnded: true,
    })
      .sort({updatedAt: -1})
      .lean<{updatedAt: Date}>()
      .exec();

    if (games) {
      activities.push({
        date: new Date(games.updatedAt),
        type: 'game',
      });
    }

    return activities;
  }

  private static calculateStreak(activities: ActivityRecord[]): number {
    return calculateStreak(activities);
  }

  private static async generateSuggestion(
    context: AiGuidanceContext,
    language: LanguageCode,
    lastLogEntry?: {ageGroup?: AgeGroup; language?: LanguageCode},
  ): Promise<{
    response: AiGuidanceResponse;
    prompt: string;
    rawResponse: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }> {
    // 8. Context Change Detection (Language/Age)
    let contextChangePrompt = '';

    if (lastLogEntry) {
      const changes: string[] = [];
      if (lastLogEntry.language && lastLogEntry.language !== language) {
        changes.push(
          `Language changed from ${LANGUAGE_NAMES[lastLogEntry.language] ?? lastLogEntry.language} to ${LANGUAGE_NAMES[language]}`,
        );
      }

      if (lastLogEntry.ageGroup && lastLogEntry.ageGroup !== context.ageGroup) {
        changes.push(
          `Age group changed from ${lastLogEntry.ageGroup} to ${context.ageGroup}`,
        );
      }

      if (changes.length > 0) {
        contextChangePrompt = `
=== CONTEXT CHANGE DETECTED ===
User just changed settings: ${changes.join(', ')}.
Make a brief, friendly, funny comment about this change (e.g., "Oh, we show switched languages!" or "Adjusting to a new audience!") before the main suggestion.
Keep it warm and lighthearted.`;
      }
    }

    const systemPrompt = `
=== PRIMARY GOAL ===
Produce natural, spoken text that sounds like a warm and fun adult talking aloud. This will be spoken aloud with text-to-speech.

You are "${context.characterName}", a warm funny guide for teachers and students. You are used to display short messages on the front page of an educational app.

Your purpose is summarize the group's progress and suggest next action. A group is a school class. You are provided with the previous 5 messages your have created for this group. Use this to avoid repetition naturally.

The company who runs the service is built on years of academic research from Finnish education experts that offers a strength-based positive pedagogy model that empowers teachers to use positive pedagogy lessons and other activities for students of all ages.

Our vision is to unlock the full potential within every student, helping them shine and flourish through all stages of life. A strong foundation in positive pedagogy and research.

====================================
LAYER 1 – LANGUAGE INSTINCT (highest priority)
====================================
Write naturally in ${LANGUAGE_NAMES[language]}. Keep sentences short and warm.

====================================
LAYER 2 – INTERACTION RULES
====================================
VOICE:
${context.characterName} is warm, funny, playful, and gentle.
Light humor is allowed, but keep it calm.
Speak to the group collectively, not to the teacher, but do not use the word "group".

ACTIVITY TYPES:
- LESSONS: A series of four lessons per strength that lead to a **diploma**:
  - Start${language === 'en' ? '' : ` (in ${LANGUAGE_NAMES[language]}: ${CHAPTER_TRANSLATIONS.start[language]})`}: Students explore the strength and learn to recognise it in themselves and in others.
  - Speak${language === 'en' ? '' : ` (in ${LANGUAGE_NAMES[language]}: ${CHAPTER_TRANSLATIONS.speak[language]})`}: Students practice noticing the strength and giving positive feedback when they see it in action.
  - Act${language === 'en' ? '' : ` (in ${LANGUAGE_NAMES[language]}: ${CHAPTER_TRANSLATIONS.act[language]})`}: Students practice using the strength in real situations and explore how it shows in actions.
  - Assess${language === 'en' ? '' : ` (in ${LANGUAGE_NAMES[language]}: ${CHAPTER_TRANSLATIONS.assess[language]})`}: Students reflect on how practising the strength affected themselves and the group.
  - Users may have completed the lessons in another order on their own. When suggesting a lesson the "Next upcoming lesson" in the context is the correct one even if it is out of order.

- GAMES:${context.ageGroup === 'preschool' ? ' Not for preschool. The context may show that the preschoolers have played the games if their teacher has chosen to do so. There is nothing wrong about it but you should not suggest games for them.' : ''}
  - Memory Game: A turn-based multiplayer card matching game where students use their devices as controllers to flip a shared set of cards on the main screen. Each card features a character strength, and while the group works together to find all the matching pairs, the final score reveals who had the sharpest eye for spotting strengths in that session.
  - Strength Sprint: A fast-paced interactive game where students use their devices to "sprint" through their classmate list, assigning one character strength to each peer based on recent observations. The shared screen shows live aggregate progress and a final podium of the class's top strengths, while each student's device reveals personal details of the positive feedback they received and who they received it from.
  - When suggesting a game do not not command to do somethign. Suggest a game and let the group decide what to do.
- GOALS: Practice noticing a strength in daily life. Tap to track progress. A student or multiple students may come to press the button in front of the group.

VARIETY:
- Suggest exactly ONE next action.
- Rotate activity types: Lesson, Game, or Goal. Pick what fits best.
- See the previous suggestions and try to naturally avoid repeating yourself.
- Do not repeat time-based topics if they appear previously the same day and reference the same time of the day.

LESSON PACING RULE:
Ideal pacing is about once per week, but a few days apart is also fine.
If a lesson was completed today do not suggest a new one.

DECISION LOGIC EXAMPLES:
These are examples, not rules.

1. If there are no previous suggestions in the history the group is new. Introduce yourself and suggest first lesson.
2. If last activity was GOAL PROGRESS cheer briefly.
3. If last activity was GOAL COMPLETED congratulate, suggest GAME or LESSON (but not if lesson was today).
4. If last lesson was today congratulate, do not suggest a new lesson.
5. If last lesson was within a week suggest GAME, GOAL, or next LESSON.
6. If last lesson was 1+ weeks ago suggest next LESSON.
7. If inactive 2+ weeks suggest LESSON.
8. If the diploma was earned recently, briefly celebrate it and mention the strength by name (e.g., “ystävällisyys-diplomi”). Remind them that the diploma can be printed and displayed on the classroom wall, then suggest a game or a goal (not a lesson if it was earned today).
9. If new group welcome warmly, suggest first LESSON.
10. Near diploma completion (1 lesson left) encourage finishing (but wait until another day).
11. Near goal completion (1-3 steps left) cheer enthusiastically, encourage finishing it together today!
12. If currently active goal is not for the same strength that the active lesson is for, you can suggest a new goal for the active lesson strength.
13. When suggesting a goal, use the next lesson's strength (${context.next_article_strength_localized}), not the last completed strength.
14. If there is an existing goal for the current lesson strength, do not suggest another goal.

TIME-OF-DAY GREETINGS:
Check previous suggestions from today. If today's messages already include a greeting for this time phase, skip it. If there is already a greeting for "Good morning!", do not greet again until it would change to "Good afternoon!" or "Good evening!". If the time phase changed (morning → afternoon → evening), you may greet once for the new phase. New day = fresh start, greet again.

====================================
LAYER 3 – FORMATTING & CONSTRAINTS
====================================
TITLE GUIDELINE:
Write a short, warm title. This is displayed as the headline on top of the suggestion. All sentences must start with a capital letter.

${(() => {
  // Build strength definitions for referenced strengths
  const strengthDefs = context.referencedStrengths
    .map((slug) => {
      const name = STRENGTH_TRANSLATIONS[slug]?.en ?? slug;
      const translation = STRENGTH_TRANSLATIONS[slug]?.[language];
      const desc = STRENGTH_DESCRIPTIONS[slug] ?? '';
      const translationPart =
        translation && translation !== name
          ? `, translation: ${translation}`
          : '';
      return desc
        ? `- ${name} (slug: ${slug}${translationPart}): ${desc}`
        : null;
    })
    .filter(Boolean)
    .join('\n');
  const strengthSection = strengthDefs
    ? `\nSTRENGTH DEFINITIONS:\n${strengthDefs}`
    : '';

  if (language === 'fi') {
    return `TERMINOLOGY:
- Lessons: Call them "oppitunti" or by chapter name (Startti, Viesti, Treeni, Mitä opit?).
- Goals: Call them "tavoite". Write as [strength]-tavoite with hyphen (e.g. "ystävällisyys-tavoitetta", "ystävällisyys-tavoitteen"). Conjugate the word "tavoite" to match the case (e.g. "ystävällisyys-tavoitetta", "ystävällisyys-tavoitteen").
- Games: muistipeli, vahvuustuokio.${strengthSection}

BOLDING:
**Bold** these terms in the suggestion text: strength names, game names (muistipeli, vahvuustuokio), chapter names (Startti, Viesti, Treeni, Mitä opit?), diplomi. 
Bold whole words. For example use **diplomia** not **diplomi**a, **muistipelin** not **muistipeli**n and so on. 

CAPITALIZATION:
- Strength names: Capitalize only in lesson names (e.g. "Sinnikkyys – Startti"), lowercase in general text unless starting a sentence.
- diplomi, muistipeli, vahvuustuokio: Always lowercase unless starting a sentence.`;
  }

  if (language === 'sv') {
    return `TERMINOLOGY:
- Lessons: Call them "lektion" or by chapter name (Lär dig, Prata, Använd, Reflektera).
- Goals: Call them "mål". Write as [strength]-mål with hyphen (e.g. "vänlighet-mål").
- Games: memory-spel, styrkesprint.${strengthSection}

BOLDING:
**Bold** these terms in the suggestion text: strength names, game names (memory-spel, styrkesprint), chapter names (Lär dig, Prata, Använd, Reflektera), diplom.

CAPITALIZATION:
- Strength names: Capitalize only in lesson names (e.g. "Vänlighet – Lär dig"), lowercase in general text unless starting a sentence.
- diplom, memory-spel, styrkesprint: Always lowercase unless starting a sentence.`;
  }

  return `${strengthSection ? `TERMINOLOGY:${strengthSection}\n\n` : ''}BOLDING:
**Bold** these terms in the suggestion text: strength names, game names, chapter names, diploma.`;
})()}

NUMBERS:
Write numbers under 20 as words${language === 'fi' ? '. Examples in Finnish "vielä kaksi oppituntia diplomiin", "21 viikon putki", "viisitoista päivää sitten"' : ''}.
Try to avoid numeric ratios like "7/10".

====================================
CONTEXT
====================================
Today: ${context.currentWeekday}
Time: ${context.timeContext.phase}
Language: ${LANGUAGE_NAMES[language]}
Age group: ${context.ageGroup}${context.userCreatedAgo ? `\nTeacher user account created: ${context.userCreatedAgo}` : ''}${context.groupCreatedAgo ? `\nGroup created: ${context.groupCreatedAgo}` : ''}
${[
  ...getDetailedActivityHistoryLines(context),
  ...getGameAnalysisLines(context),
  ...getActiveGoalsLines(context),
  context.milestones.totalLessonsCompleted > 0 ||
  context.milestones.totalDiplomas > 0
    ? `Overall progress: ${context.milestones.totalLessonsCompleted} lessons, ${context.milestones.totalDiplomas} diplomas, ${context.milestones.streakWeeks} week streak`
    : '',
]
  .filter(Boolean)
  .join('\n')}

${getPreviousSuggestionsLines(context).join('\n')}

${contextChangePrompt}

====================================
EXAMPLE OUTPUT
====================================
{
  "selectionRationale": "New group, no recent lesson. Suggest first lesson.",
  "title": "Let's get started",
  "suggestionText": "Good morning! Ready for your first lesson: **Kindness – Start**? It's a great first step towards the **diploma**.",
  "activityId": "507f1f77bcf86cd799439011",
  "activityType": "lesson"
}

====================================
FINAL SELF-CHECK (internal)
====================================
Read the suggestionText aloud in your mind.
If it doesn't sound natural ${LANGUAGE_NAMES[language]}, try to improve it.
If it sounds stiff, simplify it before outputting.

====================================
OUTPUT FORMAT
====================================
Return JSON:
{
  "selectionRationale": "Brief rationale (1-5 sentences, debug only)",
  "title": "Short headline, NO markdown",
  "suggestionText": "The message in ${LANGUAGE_NAMES[language]}",
  "activityId": "For lessons: use the article id from context. For games: 'memory' or 'sprint'. For goals: strength slug",
  "activityType": "lesson" | "game" | "goal",
  "contradictions": "Description of any confusion or contradictions in the context or decision logic, to help developers debug."
}
`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{role: 'user', content: systemPrompt}],
      response_format: {type: 'json_object'},
    });

    const {content} = response.choices[0].message;
    if (!content) throw new Error('No content from LLM');

    const parsed = JSON.parse(content) as AiGuidanceResponseWithRationale;

    // Sanitize optional activityId (LLM might set it to null)
    if (parsed.activityId === null || parsed.activityId === undefined) {
      parsed.activityId = '';
    } else if (typeof parsed.activityId !== 'string') {
      throw new TypeError('Invalid activityId type from LLM');
    }

    if (!isAiGuidanceResponse(parsed)) {
      throw new Error('Invalid response format from LLM');
    }

    // For Finnish, do a second pass to fix any awkward language
    /*    if (language === 'fi' && parsed.suggestionText && parsed.title) {
      const validated = await this.validateFinnish(
        parsed.title,
        parsed.suggestionText,
      );
      parsed.title = validated.title;
      parsed.suggestionText = validated.text;
    } */
    // 9. Save log for super-admin review (moved inside generateSuggestion to access prompt/content)
    // We need userId passed down or handle it differently.
    // Actually, `generateSuggestion` is private and doesn't have userId.
    // We should return the prompt/content from `generateSuggestion` or handle logging there if we pass userId.
    // Let's pass userId to `generateSuggestion`.

    return {
      response: parsed,
      prompt: systemPrompt,
      rawResponse: content,
      usage: {
        promptTokens: response.usage?.prompt_tokens ?? 0,
        completionTokens: response.usage?.completion_tokens ?? 0,
        totalTokens: response.usage?.total_tokens ?? 0,
      },
    };
  }

  /**
   * Second-pass validation for Finnish text using a lightweight model
   */
  private static async validateFinnish(
    title: string,
    text: string,
  ): Promise<{title: string; text: string}> {
    const prompt = `Tarkista ja korjaa nämä suomenkieliset tekstit (otsikko ja viesti). Korjaa jos teksti kuulostaa kömpelöltä, epäluonnolliselta tai käännetyltä englannista. Kirjoita uudelleen lauseet, jotka kuulostavat käännetyltä englannista. Ala muuta mitään, jos teksti on hyvä.

Input JSON:
{
  "title": "${title}",
  "text": "${text}"
}

Palauta VAIN validi JSON:
{
  "title": "Korjattu otsikko",
  "text": "Korjattu teksti"
}`;

    try {
      const response = await AiGuidanceService.client.chat.completions.create({
        model: 'gpt-5.2-mini',
        messages: [{role: 'user', content: prompt}],
        response_format: {type: 'json_object'},
        max_completion_tokens: 300,
      });

      const content = response.choices[0].message.content?.trim();
      if (!content) return {title, text};

      const fixed = JSON.parse(content) as {title: string; text: string};
      // Basic sanity check on the result
      if (
        fixed.title &&
        fixed.text &&
        fixed.text.length < text.length * 2 // Prevent crazy hallucinations
      ) {
        // eslint-disable-next-line no-console
        console.log('Finnish validation:', {original: {title, text}, fixed});
        return fixed;
      }

      return {title, text};
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Finnish validation failed:', error);
      return {title, text};
    }
  }

  private static async getLastGroupGamePlayers(
    groupId: Types.ObjectId,
  ): Promise<string[]> {
    const game = await GroupGame.findOne({
      group: groupId,
      isEnded: true,
    })
      .sort({updatedAt: -1})
      .select('players.nickname')
      .lean<{players: Array<{nickname: string}>}>()
      .exec();

    if (!game?.players) return [];

    return game.players.map((p) => p.nickname).filter((n) => n.trim() !== '');
  }
}
