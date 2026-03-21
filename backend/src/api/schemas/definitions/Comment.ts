export const Comment = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    content: {type: 'string'},
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
      maxItems: 5,
    },
    reactions: {
      type: 'array',
      items: {$ref: '#/definitions/Reaction'},
    },
    comments: {
      type: 'array',
      items: {$ref: '#/definitions/Comment'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
  },
  required: [
    'id',
    'createdBy',
    'content',
    'images',
    'reactions',
    'comments',
    'createdAt',
    'updatedAt',
  ],
} as const;
