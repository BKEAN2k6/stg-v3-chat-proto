const PeriodRetention = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      date: {type: 'string'},
      interval: {type: 'number'},
      visitors: {type: 'number'},
      returnVisitors: {type: 'number'},
      percentage: {type: 'number'},
    },
    required: ['date', 'interval', 'visitors', 'returnVisitors', 'percentage'],
  },
};

export const UserRetention = {
  type: 'object',
  properties: {
    daily: PeriodRetention,
    weekly: PeriodRetention,
    monthly: PeriodRetention,
  },
  required: ['daily', 'weekly', 'monthly'],
} as const;
