export const Reaction = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    type: {$ref: '#/definitions/ReactionType'},
    createdAt: {type: 'string'},
  },
  required: ['_id', 'createdBy', 'type', 'createdAt'],
} as const;
