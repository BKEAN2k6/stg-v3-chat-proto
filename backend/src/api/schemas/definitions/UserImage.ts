export const UserImage = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    originalImageUrl: {type: 'string'},
    resizedImageUrl: {type: 'string'},
    thumbnailImageUrl: {type: 'string'},
    aspectRatio: {type: 'number'},
  },
  required: [
    'id',
    'originalImageUrl',
    'resizedImageUrl',
    'thumbnailImageUrl',
    'aspectRatio',
  ],
} as const;
