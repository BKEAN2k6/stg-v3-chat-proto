export const ProxyPostData = {
  type: 'object',
  discriminator: {propertyName: 'postType'},
  required: ['postType'],
  oneOf: [
    {$ref: '#/definitions/ChallengeData'},
    {$ref: '#/definitions/CoachPostData'},
  ],
} as const;
