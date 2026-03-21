export const UserImage = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    originalImageUrl: {type: 'string'},
    resizedImageUrl: {type: 'string'},
    thumbnailImageUrl: {type: 'string'},
    aspectRatio: {type: 'number'},
  },
  required: [
    '_id',
    'originalImageUrl',
    'resizedImageUrl',
    'thumbnailImageUrl',
    'aspectRatio',
  ],
} as const;
