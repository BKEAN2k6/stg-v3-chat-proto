export const Moment = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
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
    content: {type: 'string', maxLength: 5000},
    images: {
      type: 'array',
      items: {$ref: '#/definitions/UserImage'},
      maxItems: 5,
    },
    strengths: {type: 'array', items: {$ref: '#/definitions/StrengthSlug'}},
    isReference: {type: 'boolean'},
  },
  required: [
    '_id',
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
