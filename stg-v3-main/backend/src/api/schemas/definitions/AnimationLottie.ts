export const AnimationLottie = {
  type: 'object',
  properties: {
    assets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {type: 'string'},
          p: {
            type: 'string',
          },
          w: {
            type: 'number',
          },
          h: {
            type: 'number',
          },
          u: {
            type: 'string',
          },
        },
        required: ['id'],
      },
    },
    nm: {
      type: 'string',
    },
    op: {
      type: 'number',
    },
    customSegments: {
      type: 'array',
      items: {},
    },
    fr: {
      type: 'number',
    },
    loop: {
      type: 'boolean',
    },
  },
  required: ['assets'],
} as const;
