export const NewUsers = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {type: 'string'},
      firstName: {type: 'string'},
      lastName: {type: 'string'},
      email: {type: 'string'},
      organization: {type: 'string'},
      createdAt: {type: 'string'},
      country: {type: 'string'},
    },
    required: [
      'id',
      'firstName',
      'lastName',
      'email',
      'organization',
      'createdAt',
      'country',
    ],
  },
} as const;
