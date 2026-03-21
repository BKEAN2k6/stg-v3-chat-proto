export const UserInfo = {
  type: 'object',
  properties: {
    _id: {
      type: 'string',
    },
    firstName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    avatar: {
      type: 'string',
    },
  },
  required: ['_id', 'firstName', 'lastName', 'avatar'],
} as const;
