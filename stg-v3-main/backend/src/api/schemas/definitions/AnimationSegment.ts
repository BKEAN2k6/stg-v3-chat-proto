export const AnimationSegment = {
  type: 'object',
  properties: {
    start: {
      type: 'integer',
      minimum: 0,
    },
    stop: {
      type: 'integer',
      minimum: 0,
    },
    autoplay: {
      type: 'boolean',
    },
    loop: {
      type: 'boolean',
    },
    showToolbar: {
      type: 'boolean',
    },
  },
  required: ['start', 'stop', 'autoplay', 'loop', 'showToolbar'],
} as const;
