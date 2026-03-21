import {type Ref, isDocument} from '@typegoose/typegoose';
import type {Community} from '../../../models/Community';
import type {User} from '../../../models/User';

type ActivityData = {
  date: Date;
  community: Ref<Community>;
  app: string;
  communityUserCount: number;
  users: Array<Ref<User>>;
};

type ActivityDataWithRetention = {
  app: string;
  community: string;
  date: string;
  communityUserCount: number;
  count: number;
  retention: number;
};

function subtractDays(date: Date, days: number): Date {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}

function firstDayInPreviousMonth(date: Date): Date {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth() - 1, 1));
}

function findPreviousPeriod(
  data: ActivityData[],
  current: ActivityData,
  periodType: 'daily' | 'weekly' | 'monthly',
): ActivityData | undefined {
  let previousDate: Date;

  switch (periodType) {
    case 'daily': {
      previousDate = subtractDays(current.date, 1);
      break;
    }

    case 'weekly': {
      previousDate = subtractDays(current.date, 7);
      break;
    }

    case 'monthly': {
      previousDate = firstDayInPreviousMonth(current.date);
      break;
    }
  }

  return data.find(
    (entry) =>
      entry.community._id.equals(current.community._id) &&
      new Date(entry.date).getTime() === previousDate.getTime(),
  );
}

export default function calculateRetention(
  data: ActivityData[],
  periodType: 'daily' | 'weekly' | 'monthly',
): ActivityDataWithRetention[] {
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return data.map((currentPeriod) => {
    const previousPeriod = findPreviousPeriod(data, currentPeriod, periodType);
    let retention = 0;

    if (previousPeriod) {
      const previousUsers = previousPeriod.users;
      const currentUsers = currentPeriod.users;

      for (const currentUser of currentUsers) {
        if (
          previousUsers.some((previousUser) =>
            previousUser._id.equals(currentUser._id),
          )
        ) {
          retention++;
        }
      }
    }

    const {app, community, date, communityUserCount} = currentPeriod;

    let communityName = 'Unknown';

    if (isDocument(community)) {
      communityName = community.name;
    }

    return {
      app,
      community: communityName,
      communityUserCount,
      date: date.toISOString(),
      count: currentPeriod.users.length,
      retention,
    };
  });
}
