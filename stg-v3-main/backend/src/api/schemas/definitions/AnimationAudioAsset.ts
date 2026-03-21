export const AnimationAudioAsset = {
  type: 'object',
  properties: {
    assetId: {
      type: 'string',
    },
    assetType: {
      type: 'string',
      enum: ['audio'],
    },
    name: {
      type: 'string',
    },
    renderType: {
      type: 'string',
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
      additionalProperties: false,
    },
  },
  required: ['assetId', 'assetType', 'name', 'renderType', 'translations'],
} as const;
