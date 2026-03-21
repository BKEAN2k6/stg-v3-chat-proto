import {type Redis} from 'ioredis';
import {format, getISOWeek, addDays, addWeeks, addMonths} from 'date-fns';

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

const periodCount = 12;

const usersSeenKey = 'users-seen';
const usersRegisteredKey = 'users-registered';

export class RetentionsStats {
  constructor(private readonly redis: Redis) {}

  async recordUserSeen(id: number, date: Date): Promise<void> {
    await this.recordEvent(usersSeenKey, id, date);
  }

  async recordUserRegistered(id: number, date: Date): Promise<void> {
    await this.recordEvent(usersRegisteredKey, id, date);
  }

  async getAllUsersRetention(): Promise<RetentionResults> {
    return this.getRetention(usersSeenKey);
  }

  async getRegisteredUsersRetention(): Promise<RetentionResults> {
    return this.getRetention(usersRegisteredKey);
  }

  async getExistingUsersRetention(): Promise<RetentionResults> {
    const now = new Date();
    const [daily, weekly, monthly] = await Promise.all([
      this.calculateExistingUsersRetention(
        'daily',
        addDays(now, -periodCount),
        now,
        this.getDayKey.bind(this),
        (date) => addDays(date, 1),
      ),
      this.calculateExistingUsersRetention(
        'weekly',
        addWeeks(now, -periodCount),
        now,
        this.getWeekKey.bind(this),
        (date) => addWeeks(date, 1),
      ),
      this.calculateExistingUsersRetention(
        'monthly',
        addMonths(now, -periodCount),
        now,
        this.getMonthKey.bind(this),
        (date) => addMonths(date, 1),
      ),
    ]);
    return {daily, weekly, monthly};
  }

  async getTopUsers(): Promise<TopUsersResults> {
    const now = new Date();

    const dayKeys: string[] = [];
    for (let i = 0; i < periodCount; i++) {
      dayKeys.push(this.getDayKey(usersSeenKey, addDays(now, -i)));
    }

    const weekKeys: string[] = [];
    for (let i = 0; i < periodCount; i++) {
      weekKeys.push(this.getWeekKey(usersSeenKey, addWeeks(now, -i)));
    }

    const monthKeys: string[] = [];
    for (let i = 0; i < periodCount; i++) {
      monthKeys.push(this.getMonthKey(usersSeenKey, addMonths(now, -i)));
    }

    const [daily, weekly, monthly] = await Promise.all([
      this.getTopUsersForPeriod(dayKeys, 200),
      this.getTopUsersForPeriod(weekKeys, 200),
      this.getTopUsersForPeriod(monthKeys, 200),
    ]);

    return {daily, weekly, monthly};
  }

  // eslint-disable-next-line max-params
  private async calculateExistingUsersRetention(
    keyPrefix: string,
    startDate: Date,
    endDate: Date,
    getKey: (event: string, date: Date) => string,
    incrementDate: (date: Date) => Date,
  ): Promise<RetentionResult[]> {
    const cohorts = this.buildExistingUsersCohorts(
      keyPrefix,
      startDate,
      endDate,
      getKey,
      incrementDate,
    );

    // Collect all temp keys for cleanup (only keys starting with "temp-")
    const allTemporaryKeys = [
      ...cohorts.map((c) => c.intersectionKey),
      ...cohorts.map((c) => c.existingKey),
      ...cohorts.flatMap((c) => c.comparisons.map((comp) => comp.temporaryKey)),
    ];

    try {
      // Phase 1: Compute intersection (seen AND registered) for all cohorts
      const intersectionPipeline = this.redis.pipeline();

      for (const cohort of cohorts) {
        const registeredKey = getKey(usersRegisteredKey, cohort.date);
        intersectionPipeline.bitop(
          'AND',
          cohort.intersectionKey,
          cohort.seenKey,
          registeredKey,
        );
      }

      await intersectionPipeline.exec();

      // Phase 2: Compute existing (seen XOR intersection) for all cohorts
      const existingPipeline = this.redis.pipeline();

      for (const cohort of cohorts) {
        existingPipeline.bitop(
          'XOR',
          cohort.existingKey,
          cohort.seenKey,
          cohort.intersectionKey,
        );
      }

      await existingPipeline.exec();

      // Phase 3: Compute return comparisons for all cohorts
      const comparisonPipeline = this.redis.pipeline();

      for (const cohort of cohorts) {
        for (const comparison of cohort.comparisons) {
          let currentDate = new Date(cohort.date);

          for (let j = 0; j < comparison.offset; j++) {
            currentDate = incrementDate(currentDate);
          }

          const comparisonKey = getKey(usersSeenKey, currentDate);
          comparisonPipeline.bitop(
            'AND',
            comparison.temporaryKey,
            cohort.existingKey,
            comparisonKey,
          );
        }
      }

      await comparisonPipeline.exec();

      // Phase 4: Count and process results
      return await this.countExistingUsersResults(cohorts);
    } finally {
      // Always clean up temp keys (all start with "temp-" prefix)
      if (allTemporaryKeys.length > 0) {
        try {
          await this.redis.del(...allTemporaryKeys);
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  private async countExistingUsersResults(
    cohorts: Array<{
      date: Date;
      seenKey: string;
      existingKey: string;
      intersectionKey: string;
      comparisons: Array<{temporaryKey: string; offset: number}>;
    }>,
  ): Promise<RetentionResult[]> {
    const results: RetentionResult[] = [];
    const countPipeline = this.redis.pipeline();

    for (const cohort of cohorts) {
      countPipeline.bitcount(cohort.existingKey);

      for (const comparison of cohort.comparisons) {
        countPipeline.bitcount(comparison.temporaryKey);
      }
    }

    const counts = await countPipeline.exec();

    let countIndex = 0;

    for (const cohort of cohorts) {
      const visitors = (counts?.[countIndex]?.[1] as number) ?? 0;
      countIndex++;

      for (const comparison of cohort.comparisons) {
        const returnCount = (counts?.[countIndex]?.[1] as number) ?? 0;
        countIndex++;

        results.push({
          date: cohort.date.toJSON(),
          interval: comparison.offset,
          visitors,
          returnVisitors: returnCount,
          percentage: visitors > 0 ? (returnCount / visitors) * 100 : 0,
        });
      }
    }

    return results;
  }

  // eslint-disable-next-line max-params
  private buildExistingUsersCohorts(
    keyPrefix: string,
    startDate: Date,
    endDate: Date,
    getKey: (event: string, date: Date) => string,
    incrementDate: (date: Date) => Date,
  ): Array<{
    date: Date;
    seenKey: string;
    existingKey: string;
    intersectionKey: string;
    comparisons: Array<{temporaryKey: string; offset: number}>;
  }> {
    const cohorts: Array<{
      date: Date;
      seenKey: string;
      existingKey: string;
      intersectionKey: string;
      comparisons: Array<{temporaryKey: string; offset: number}>;
    }> = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date = incrementDate(date)
    ) {
      const comparisons: Array<{temporaryKey: string; offset: number}> = [];

      for (
        let offset = 0, current = new Date(date);
        current <= endDate;
        offset++, current = incrementDate(current)
      ) {
        comparisons.push({
          temporaryKey: `temp-${keyPrefix}-return-${date.getTime()}-${offset}`,
          offset,
        });
      }

      cohorts.push({
        date: new Date(date),
        seenKey: getKey(usersSeenKey, date),
        existingKey: `temp-${keyPrefix}-existing-${date.getTime()}`,
        intersectionKey: `temp-${keyPrefix}-intersection-${date.getTime()}`,
        comparisons,
      });
    }

    return cohorts;
  }

  private async getTopUsersForPeriod(
    keys: string[],
    limit = 100,
  ): Promise<TopUser[]> {
    const pipeline = this.redis.pipeline();
    for (const k of keys) pipeline.getBuffer(k);
    const raw = await pipeline.exec();

    const counts = new Map<number, number>();

    for (const [error, buf] of raw ?? []) {
      if (error) continue;
      const buffer = buf as Uint8Array | undefined;
      if (!buffer) continue;

      for (const [byteIndex, byte] of buffer.entries()) {
        if (byte === 0) continue;

        for (let bit = 0; bit < 8; bit++) {
          // eslint-disable-next-line no-bitwise
          if (byte & (1 << (7 - bit))) {
            const userId = byteIndex * 8 + bit;
            counts.set(userId, (counts.get(userId) ?? 0) + 1);
          }
        }
      }
    }

    const ranked: TopUser[] = Array.from(counts, ([userId, visitCount]) => ({
      userId,
      visitCount,
    }))
      .sort((a, b) => b.visitCount - a.visitCount || a.userId - b.userId)
      .slice(0, limit);

    return ranked;
  }

  private async recordEvent(
    event: string,
    id: number,
    date: Date,
  ): Promise<void> {
    const dayKey = this.getDayKey(event, date);
    const weekKey = this.getWeekKey(event, date);
    const monthKey = this.getMonthKey(event, date);

    const pipeline = this.redis.pipeline();
    pipeline.setbit(dayKey, id, 1);
    pipeline.expire(dayKey, 60 * 60 * 24 * periodCount);
    pipeline.setbit(weekKey, id, 1);
    pipeline.expire(weekKey, 60 * 60 * 24 * 7 * periodCount);
    pipeline.setbit(monthKey, id, 1);
    pipeline.expire(monthKey, 60 * 60 * 24 * 31 * periodCount);
    await pipeline.exec();
  }

  private async getRetention(event: string): Promise<RetentionResults> {
    const now = new Date();
    const [daily, weekly, monthly] = await Promise.all([
      this.calculateRetention(
        'daily',
        event,
        addDays(now, -periodCount),
        now,
        this.getDayKey.bind(this),
        (date) => addDays(date, 1),
      ),
      this.calculateRetention(
        'weekly',
        event,
        addWeeks(now, -periodCount),
        now,
        this.getWeekKey.bind(this),
        (date) => addWeeks(date, 1),
      ),
      this.calculateRetention(
        'monthly',
        event,
        addMonths(now, -periodCount),
        now,
        this.getMonthKey.bind(this),
        (date) => addMonths(date, 1),
      ),
    ]);
    return {daily, weekly, monthly};
  }

  // eslint-disable-next-line max-params
  private async calculateRetention(
    keyPrefix: string,
    event: string,
    startDate: Date,
    endDate: Date,
    getKey: (event: string, date: Date) => string,
    incrementDate: (date: Date) => Date,
  ): Promise<RetentionResult[]> {
    const results: RetentionResult[] = [];
    const temporaryKeys: string[] = [];

    // Build cohort data structure
    const cohorts: Array<{
      date: Date;
      baseKey: string;
      comparisons: Array<{temporaryKey: string; offset: number}>;
    }> = [];

    for (
      let date = new Date(startDate);
      date <= endDate;
      date = incrementDate(date)
    ) {
      const baseKey = getKey(event, date);
      const comparisons: Array<{temporaryKey: string; offset: number}> = [];

      for (
        let offset = 0, current = new Date(date);
        current <= endDate;
        offset++, current = incrementDate(current)
      ) {
        const temporaryKey = `temp-${keyPrefix}-${event}-${date.getTime()}-${offset}`;
        comparisons.push({temporaryKey, offset});
        temporaryKeys.push(temporaryKey);
      }

      cohorts.push({date: new Date(date), baseKey, comparisons});
    }

    try {
      // Pipeline: all bitops
      const bitopPipeline = this.redis.pipeline();

      for (const cohort of cohorts) {
        for (const comparison of cohort.comparisons) {
          let currentDate = new Date(cohort.date);

          for (let j = 0; j < comparison.offset; j++) {
            currentDate = incrementDate(currentDate);
          }

          const comparisonKey = getKey(usersSeenKey, currentDate);
          bitopPipeline.bitop(
            'AND',
            comparison.temporaryKey,
            cohort.baseKey,
            comparisonKey,
          );
        }
      }

      await bitopPipeline.exec();

      // Pipeline: all bitcounts (base keys + temp keys)
      const countPipeline = this.redis.pipeline();

      for (const cohort of cohorts) {
        countPipeline.bitcount(cohort.baseKey);

        for (const comparison of cohort.comparisons) {
          countPipeline.bitcount(comparison.temporaryKey);
        }
      }

      const counts = await countPipeline.exec();

      // Process results
      let countIndex = 0;

      for (const cohort of cohorts) {
        const visitors = (counts?.[countIndex]?.[1] as number) ?? 0;
        countIndex++;

        for (const comparison of cohort.comparisons) {
          const returnCount = (counts?.[countIndex]?.[1] as number) ?? 0;
          countIndex++;

          results.push({
            date: cohort.date.toJSON(),
            interval: comparison.offset,
            visitors,
            returnVisitors: returnCount,
            percentage: visitors > 0 ? (returnCount / visitors) * 100 : 0,
          });
        }
      }

      return results;
    } finally {
      // Always clean up temp keys (all start with "temp-" prefix)
      if (temporaryKeys.length > 0) {
        try {
          await this.redis.del(...temporaryKeys);
        } catch {
          // Ignore cleanup errors
        }
      }
    }
  }

  private getDayKey(event: string, date: Date): string {
    return `${event}:day:${format(date, 'yyyy-MM-dd')}`;
  }

  private getWeekKey(event: string, date: Date): string {
    return `${event}:week:${format(date, 'yyyy')}-${String(getISOWeek(date)).padStart(2, '0')}`;
  }

  private getMonthKey(event: string, date: Date): string {
    return `${event}:month:${format(date, 'yyyy-MM')}`;
  }
}
