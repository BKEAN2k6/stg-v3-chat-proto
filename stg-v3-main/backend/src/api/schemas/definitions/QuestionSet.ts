export const QuestionSet = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    type: {
      type: 'string',
      enum: ['quiz', 'questionnaire'],
    },
    title: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: {$ref: '#/definitions/LanguageCode'},
          text: {type: 'string'},
        },
        required: ['language', 'text'],
      },
    },
    description: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          language: {$ref: '#/definitions/LanguageCode'},
          text: {type: 'string'},
        },
        required: ['language', 'text'],
      },
    },
    questions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
          instruction: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          explanation: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                language: {$ref: '#/definitions/LanguageCode'},
                text: {type: 'string'},
              },
              required: ['language', 'text'],
            },
          },
          strength: {$ref: '#/definitions/StrengthSlug'},
          multiSelect: {
            type: 'boolean',
          },
          choices: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: {
                  type: 'string',
                },
                points: {
                  type: 'number',
                },
                label: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      language: {$ref: '#/definitions/LanguageCode'},
                      text: {type: 'string'},
                    },
                    required: ['language', 'text'],
                  },
                },
                isCorrect: {type: 'boolean'},
              },
              required: ['id', 'points', 'label', 'isCorrect'],
            },
          },
        },
        required: [
          'id',
          'instruction',
          'explanation',
          'multiSelect',
          'choices',
        ],
      },
    },
  },
  required: ['id', 'type', 'title', 'description', 'questions'],
} as const;
