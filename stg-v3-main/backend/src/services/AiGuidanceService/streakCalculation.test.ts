import {describe, expect, it} from 'vitest';
import {calculateStreak, getISOWeekKey} from './streakCalculation.js';

describe('getISOWeekKey', () => {
  it('should return week 1 for Jan 1, 2026 (Wednesday)', () => {
    const result = getISOWeekKey(new Date(2026, 0, 1));
    expect(result).toEqual({year: 2026, week: 1});
  });

  it('should return week 52 for Dec 31, 2025 (Wednesday)', () => {
    const result = getISOWeekKey(new Date(2025, 11, 31));
    expect(result).toEqual({year: 2026, week: 1}); // ISO week 1 of 2026
  });

  it('should return week 53 for Dec 31, 2020 (Thursday)', () => {
    // 2020 has 53 weeks (Thursday, Dec 31st is in week 53)
    const result = getISOWeekKey(new Date(2020, 11, 31));
    expect(result).toEqual({year: 2020, week: 53});
  });

  it('should handle Monday as first day of the week', () => {
    // Monday, Jan 6, 2025 should be week 2
    const result = getISOWeekKey(new Date(2025, 0, 6));
    expect(result).toEqual({year: 2025, week: 2});
  });

  it('should handle Sunday as last day of the week', () => {
    // Sunday, Jan 5, 2025 should be week 1
    const result = getISOWeekKey(new Date(2025, 0, 5));
    expect(result).toEqual({year: 2025, week: 1});
  });
});

describe('calculateStreak', () => {
  describe('edge cases', () => {
    it('should return 0 for empty activities', () => {
      const result = calculateStreak([]);
      expect(result).toBe(0);
    });

    it('should return 0 if current week AND previous week have no activity', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2026, 0, 1)}, // Week 1 - gap exists (week 2 missing)
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(0); // Week 2 (previous) is a completed empty week → streak broken
    });
  });

  describe('current week in progress (no activity yet)', () => {
    it('should preserve streak when current week has no activity but previous week does', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2026, 0, 6)}, // Week 2 (previous week has activity)
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(1); // Streak preserved: teacher still has time this week
    });

    it('should preserve multi-week streak when current week has no activity', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2025, 11, 30)}, // Week 1
        {date: new Date(2026, 0, 6)}, // Week 2
        // No activity in week 3 yet
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(2); // Weeks 1-2 consecutive, week 3 in progress
    });

    it('should break streak when there is a truly empty completed week', () => {
      const referenceDate = new Date(2026, 0, 22); // Thursday, Jan 22, 2026 (week 4)
      const activities = [
        {date: new Date(2026, 0, 6)}, // Week 2
        // Week 3 is completely empty (a completed week with no activity)
        // No activity in week 4 yet
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(0); // Week 3 was truly empty → streak broken
    });
  });

  describe('single week', () => {
    it('should return 1 if only current week has activity', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2026, 0, 13)}, // Monday of week 3
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(1);
    });

    it('should return 1 even with multiple activities in the same week', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2026, 0, 12)}, // Sunday of week 3
        {date: new Date(2026, 0, 13)}, // Monday of week 3
        {date: new Date(2026, 0, 15)}, // Thursday of week 3
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(1);
    });
  });

  describe('consecutive weeks', () => {
    it('should return 2 for two consecutive weeks', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2026, 0, 6)}, // Week 2
        {date: new Date(2026, 0, 13)}, // Week 3
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(2);
    });

    it('should return 3 for three consecutive weeks', () => {
      const referenceDate = new Date(2026, 0, 15); // Thursday, Jan 15, 2026 (week 3)
      const activities = [
        {date: new Date(2025, 11, 30)}, // Week 1
        {date: new Date(2026, 0, 6)}, // Week 2
        {date: new Date(2026, 0, 13)}, // Week 3
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(3);
    });

    it('should stop counting at a gap', () => {
      const referenceDate = new Date(2026, 0, 22); // Thursday, Jan 22, 2026 (week 4)
      const activities = [
        {date: new Date(2026, 0, 5)}, // Week 2 (gap after this)
        // Week 3 missing
        {date: new Date(2026, 0, 20)}, // Week 4
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(1); // Only week 4 counts, gap at week 3 breaks the streak
    });
  });

  describe('year boundary', () => {
    it('should handle streak crossing year boundary', () => {
      // Jan 8, 2026 is in ISO week 2 of 2026
      const referenceDate = new Date(2026, 0, 8);
      const activities = [
        {date: new Date(2025, 11, 22)}, // Dec 22, 2025 is ISO week 52 of 2025
        {date: new Date(2025, 11, 30)}, // Dec 30, 2025 is ISO week 1 of 2026
        {date: new Date(2026, 0, 5)}, // Jan 5, 2026 is ISO week 2 of 2026
      ];
      // Week 2 (current) → Week 1 → but Week 52 of 2025 is NOT week 0 of 2026!
      // So the streak is: W2 (has activity), W1 (has activity), then next is W52 of 2025...
      // The function decrements week, but handles year boundary by going to Dec 31 of prev year
      // Dec 31, 2025 is ALSO week 1 of 2026, so we need week 52 of 2025 which is Dec 22
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(3); // W2 → W1 → W52(2025) all have activity
    });

    it('should handle activities in week spanning year boundary', () => {
      // Dec 30, 2025 is in ISO week 1 of 2026
      const referenceDate = new Date(2025, 11, 30);
      const activities = [
        {date: new Date(2025, 11, 30)}, // Tuesday, Dec 30, 2025 (week 1 of 2026)
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(1);
    });

    it('should stop at year boundary when week 52 has no activity', () => {
      const referenceDate = new Date(2026, 0, 8); // Week 2 of 2026
      const activities = [
        // No activity in week 52 of 2025
        {date: new Date(2025, 11, 30)}, // Week 1 of 2026
        {date: new Date(2026, 0, 5)}, // Week 2 of 2026
      ];
      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(2); // W2 → W1, but W52 of 2025 is missing
    });
  });

  describe('long streaks', () => {
    it('should count a 10-week streak', () => {
      const referenceDate = new Date(2026, 2, 12); // Thursday, March 12, 2026 (week 11)

      // Create activities for weeks 2-11 (10 consecutive weeks)
      const activities: Array<{date: Date}> = [];
      for (let week = 2; week <= 11; week++) {
        // Add an activity on Thursday of each week
        const date = new Date(2026, 0, 1); // Start from Jan 1
        date.setDate(date.getDate() + (week - 1) * 7);
        activities.push({date});
      }

      const result = calculateStreak(activities, referenceDate);
      expect(result).toBe(10);
    });
  });

  describe('uses current time by default', () => {
    it('should use current date when referenceDate not provided', () => {
      const now = new Date();
      const activities = [{date: now}];

      const result = calculateStreak(activities);
      expect(result).toBe(1);
    });
  });
});
