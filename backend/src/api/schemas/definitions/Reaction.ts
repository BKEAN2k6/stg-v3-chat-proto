export const Reaction = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    type: {$ref: '#/definitions/ReactionType'},
    createdAt: {type: 'string'},
  },
  required: ['id', 'createdBy', 'type', 'createdAt'],
} as const;
