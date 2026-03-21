export const Community = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    name: {type: 'string', maxLength: 50},
    description: {type: 'string', maxLength: 500},
    language: {type: 'string', enum: ['en', 'fi', 'sv']},
    avatar: {type: 'string'},
    timezone: {type: 'string'},
  },
  required: ['_id', 'name', 'description', 'language', 'timezone'],
} as const;
