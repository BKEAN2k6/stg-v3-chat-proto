import {describe, expect, it} from 'vitest';
import {CommunityStats} from './CommunityStats.js';

describe('CommunityStats', () => {
  describe('getWeek', () => {
    it('returns the expexted week number', async () => {
      expect(CommunityStats.getWeek(new Date('2024-01-01'))).toBe(1); // Is monday
      expect(CommunityStats.getWeek(new Date('2024-01-07'))).toBe(1); // Is sunday
      expect(CommunityStats.getWeek(new Date('2024-01-08'))).toBe(2); // Is monday
    });
  });
});
