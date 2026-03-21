export const Post = {
  type: 'object',
  discriminator: {propertyName: 'postType'},
  required: ['postType'],
  oneOf: [
    {$ref: '#/definitions/Challenge'},
    {$ref: '#/definitions/CoachPost'},
    {$ref: '#/definitions/Moment'},
    {$ref: '#/definitions/SprintResult'},
    {$ref: '#/definitions/LessonCompleted'},
    {$ref: '#/definitions/OnboardingCompleted'},
    {$ref: '#/definitions/GoalCompleted'},
    {$ref: '#/definitions/StrengthCompleted'},
  ],
} as const;
