export const Moment = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    createdBy: {$ref: '#/definitions/UserInfo'},
    comments: {
      type: 'array',
      items: {$ref: '#/definitions/Comment'},
    },
    reactions: {
      type: 'array',
      items: {$ref: '#/definitions/Reaction'},
    },
    createdAt: {type: 'string'},
    updatedAt: {type: 'string'},
    postType: {type: 'string', enum: ['moment']},
    content: {type: 'string'},
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
      maxItems: 5,
    },
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    isReference: {type: 'boolean'},
  },
  required: [
    'id',
    'comments',
    'reactions',
    'createdAt',
    'createdBy',
    'updatedAt',
    'postType',
    'content',
    'images',
    'strengths',
  ],
} as const;
