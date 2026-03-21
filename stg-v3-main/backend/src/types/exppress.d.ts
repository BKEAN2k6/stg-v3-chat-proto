type RequestUser = {
  id: string;
  sequenceNumber: number;
  roles: string[];
  firstName: string;
  lastName: string;
  avatar: string;
  language: string;
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

type RetentionResult = {
  date: string;
  interval: number;
  visitors: number;
  returnVisitors: number;
  percentage: number;
};

type RetentionResults = {
  daily: RetentionResult[];
  weekly: RetentionResult[];
  monthly: RetentionResult[];
};

type TopUser = {userId: number; visitCount: number};
type TopUsersResults = {
  daily: TopUser[];
  weekly: TopUser[];
  monthly: TopUser[];
};

declare namespace Express {
  export type Request = {
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
      getCommunityStats: (
        communityId: string,
        date: Date,
      ) => Promise<{
        topStrengths: Array<{strength: StrengthSlug; count: number}>;
        leaderboard: Array<{
          id: string;
          firstName: string;
          lastName: string;
          count: number;
          avatar: string;
        }>;
      }>;
    };
    user: RequestUser;
    error: any;
    roles: string[];
    retentionStats: {
      recordUserSeen(id: number, date: Date): Promise<void>;
      recordUserRegistered(id: number, date: Date): Promise<void>;
      getAllUsersRetention(): Promise<RetentionResults>;
      getExistingUsersRetention(): Promise<RetentionResults>;
      getRegisteredUsersRetention(): Promise<RetentionResults>;
      getTopUsers(): Promise<TopUsersResults>;
    };
    session: {
      allowPasswordChangeUntil?: number;
      groupGames?: Record<
        string,
        {
          playerId: string;
        }
      >;
      destroy: (callback: (error: any) => void) => void;
      cookie: {
        maxAge: number;
        expires: boolean;
      };
    };
    logout: (callback: (error: any) => void) => void;
    logIn: (user: RequestUser, callback: (error: any) => void) => void;
  };
  export type Response = {
    unsafeJson: (body: any) => Response;
  };
}
