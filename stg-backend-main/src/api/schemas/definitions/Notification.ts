export const Notification = {
  type: 'object',
  discriminator: {propertyName: 'notificationType'},
  required: ['notificationType'],
  oneOf: [
    {$ref: '#/definitions/PostReactionNotification'},
    {$ref: '#/definitions/PostCommentNotification'},
    {$ref: '#/definitions/CommentReactionNotification'},
    {$ref: '#/definitions/CommentCommentNotification'},
  ],
} as const;
