import {expect, it, describe} from '@jest/globals';
import mongoose from 'mongoose';
import {Community, User} from '../../../models';
import calculateRetention from './calculateRetention';

describe('calculateRetention', () => {
  // Helper to generate mock ObjectId

  const community1 = new Community({
    name: 'Community 1',
  });
  const community2 = new Community({
    name: 'Community 2',
  });

  const user1 = new User();
  const user2 = new User();
  const user3 = new User();

  it('returns correct results for days', () => {
    const sampleData = [
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-01T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-02T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2, user3],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-03T00:00:00.000Z'),
        community: community2,
        app: 'test-app',
        communityUserCount: 3,
        users: [user2],
      },
    ];
    const result = calculateRetention(sampleData, 'daily');

    expect(result).toEqual([
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-10-01T00:00:00.000Z',
        count: 2,
        retention: 0,
      },
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-10-02T00:00:00.000Z',
        count: 3,
        retention: 2,
      },
      {
        app: 'test-app',
        community: 'Community 2',
        communityUserCount: 3,
        date: '2024-10-03T00:00:00.000Z',
        count: 1,
        retention: 0,
      },
    ]);
  });

  it('returns correct results for weeks', () => {
    const sampleData = [
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-01T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-08T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2, user3],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-08T00:00:00.000Z'),
        community: community2,
        app: 'test-app',
        communityUserCount: 3,
        users: [user2],
      },
    ];
    const result = calculateRetention(sampleData, 'weekly');

    expect(result).toEqual([
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-10-01T00:00:00.000Z',
        count: 2,
        retention: 0,
      },
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-10-08T00:00:00.000Z',
        count: 3,
        retention: 2,
      },
      {
        app: 'test-app',
        community: 'Community 2',
        communityUserCount: 3,
        date: '2024-10-08T00:00:00.000Z',
        count: 1,
        retention: 0,
      },
    ]);
  });

  it('returns correct results for months', () => {
    const sampleData = [
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-10-01T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-11-01T00:00:00.000Z'),
        community: community1,
        app: 'test-app',
        communityUserCount: 5,
        users: [user1, user2, user3],
      },
      {
        _id: new mongoose.Types.ObjectId(),
        date: new Date('2024-11-01T00:00:00.000Z'),
        community: community2,
        app: 'test-app',
        communityUserCount: 3,
        users: [user2],
      },
    ];
    const result = calculateRetention(sampleData, 'monthly');

    expect(result).toEqual([
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-10-01T00:00:00.000Z',
        count: 2,
        retention: 0,
      },
      {
        app: 'test-app',
        community: 'Community 1',
        communityUserCount: 5,
        date: '2024-11-01T00:00:00.000Z',
        count: 3,
        retention: 2,
      },
      {
        app: 'test-app',
        community: 'Community 2',
        communityUserCount: 3,
        date: '2024-11-01T00:00:00.000Z',
        count: 1,
        retention: 0,
      },
    ]);
  });
});
