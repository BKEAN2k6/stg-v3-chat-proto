import {expect, it, describe} from '@jest/globals';
import convertToTimeZone from './convertToTimeZone';

describe('convertToTimeZone', () => {
  it('returns the correct time when it is not daylight saving time in Finland', () => {
    const date = new Date('2021-01-01T07:00:00Z');
    const timeZone = 'Europe/Helsinki';
    const result = convertToTimeZone(date, timeZone);
    expect(result.toISOString()).toBe('2021-01-01T05:00:00.000Z');
  });

  it('returns the correct time when it is daylight saving time in Finland', () => {
    const date = new Date('2021-07-07T07:00:00Z');
    const timeZone = 'Europe/Helsinki';
    const result = convertToTimeZone(date, timeZone);
    expect(result.toISOString()).toBe('2021-07-07T04:00:00.000Z');
  });

  it('returns the correct time when the result is in a another day', () => {
    const date = new Date('2021-07-07T00:00:00Z');
    const timeZone = 'Europe/Helsinki';
    const result = convertToTimeZone(date, timeZone);
    expect(result.toISOString()).toBe('2021-07-06T21:00:00.000Z');
  });
});
