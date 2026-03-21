export const UserInfo = {
  type: 'object',
  properties: {
    id: {
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
  required: ['id', 'firstName', 'lastName', 'avatar'],
} as const;
