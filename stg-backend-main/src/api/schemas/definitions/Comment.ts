export const Comment = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    content: {type: 'string', maxLength: 5000},
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
    '_id',
    'createdBy',
    'content',
    'images',
    'reactions',
    'comments',
    'createdAt',
    'updatedAt',
  ],
} as const;
