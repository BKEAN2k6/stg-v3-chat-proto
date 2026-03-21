type RequestUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  roles: string[];
  allowPasswordChange?: boolean;
  save: () => Promise<void>;
  authenticate: (password: string) => Promise<{error?: string}>;
};

type StrengthSlug =
  | 'carefulness'
  | 'compassion'
  | 'courage'
  | 'creativity'
  | 'curiosity'
  | 'enthusiasm'
  | 'fairness'
  | 'forgiveness'
  | 'gratitude'
  | 'grit'
  | 'honesty'
  | 'hope'
  | 'humour'
  | 'judgement'
  | 'kindness'
  | 'leadership'
  | 'love'
  | 'loveOfBeauty'
  | 'loveOfLearning'
  | 'modesty'
  | 'perseverance'
  | 'perspective'
  | 'selfRegulation'
  | 'socialIntelligence'
  | 'spirituality'
  | 'teamwork';

declare namespace Express {
  export type Request = {
    logger: {
      log: (message?: any, ...optionalParameters: any[]) => void;
    };
    events: {
      emit: (room: string, event: EventType, data: any) => Promise<void>;
    };
    stats: {
      updateCommunityStrenghts: (
        communityId: string,
        date: Date,
        newStrengths: StrengthSlug[],
        oldStrengths: StrengthSlug[] = [],
      ) => Promise<void>;
      updateLeaderboard: (
        userId: string,
        communityId: string,
        date: Date,
        count: number,
      ) => Promise<void>;
      updateMoodMeter: (
        communityId: string,
        date: Date,
        mood: number,
      ) => Promise<void>;
      getCommunityStats: (
        communityId: string,
        date: Date,
      ) => Promise<{
        topStrengths: Array<{strength: StrengthSlug; count: number}>;
        leaderboard: Array<{
          _id: string;
          firstName: string;
          lastName: string;
          count: number;
          avatar: string;
        }>;
        moodMeter: Array<{mood: number; count: number}>;
      }>;
      getMooodMeter: (
        communityId: string,
        dayNumber: number,
      ) => Promise<Array<{mood: number; count: number}>>;
    };
    user: RequestUser;
    roles: string[];
    session: {
      allowPasswordChangeUntil?: number;
      sprints?: Record<
        string,
        {
          sprintPlayerId: string;
        }
      >;
      memoryGames?: Record<
        string,
        {
          memoryGamePlayerId: string;
        }
      >;
      destroy: (callback: (error: any) => void) => void;
    };
    logout: (callback: (error: any) => void) => void;
    logIn: (user: RequestUser, callback: (error: any) => void) => void;
  };
  export type Response = {
    unsafeJson: (body: any) => Response;
  };
}
