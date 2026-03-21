export const AnimationImageAsset = {
  type: 'object',
  properties: {
    assetId: {
      type: 'string',
    },
    assetType: {
      type: 'string',
      enum: ['image'],
    },
    name: {
      type: 'string',
    },
    renderType: {
      type: 'string',
    },
    width: {
      type: 'number',
    },
    height: {
      type: 'number',
    },
    color: {
      type: 'object',
      properties: {
        r: {
          type: 'number',
          minimum: 0,
          maximum: 255,
        },
        g: {
          type: 'number',
          minimum: 0,
          maximum: 255,
        },
        b: {
          type: 'number',
          minimum: 0,
          maximum: 255,
        },
        a: {
          type: 'number',
          minimum: 0,
          maximum: 1,
        },
      },
      required: ['r', 'g', 'b', 'a'],
    },
    fontSize: {
      type: 'number',
      minimum: 0,
    },
    translations: {
      type: 'object',
      properties: {
        en: {
          type: 'string',
        },
        fi: {
          type: 'string',
        },
        sv: {
          type: 'string',
        },
      },
      required: ['en', 'fi', 'sv'],
    },
  },
  required: [
    'assetId',
    'assetType',
    'name',
    'renderType',
    'width',
    'height',
    'color',
    'fontSize',
    'translations',
  ],
} as const;
