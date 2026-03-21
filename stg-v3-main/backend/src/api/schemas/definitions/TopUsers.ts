const TopUsersArray = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'},
      email: {type: 'string'},
      organization: {type: 'string'},
      visitCount: {type: 'number'},
      country: {type: 'string'},
    },
    required: [
      'id',
      'firstName',
      'lastName',
      'email',
      'organization',
      'visitCount',
      'country',
    ],
  },
};

export const TopUsers = {
  type: 'object',
  properties: {
    daily: TopUsersArray,
    weekly: TopUsersArray,
    monthly: TopUsersArray,
  },
  required: ['daily', 'weekly', 'monthly'],
} as const;
