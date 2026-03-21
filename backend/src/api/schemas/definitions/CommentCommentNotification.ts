export const CommentCommentNotification = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    notificationType: {type: 'string', enum: ['comment-comment-notification']},
    isRead: {type: 'boolean'},
    actor: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        avatar: {type: 'string'},
      },
      required: ['id', 'firstName', 'lastName', 'avatar'],
    },
    targetComment: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        content: {type: 'string'},
      },
      required: ['id', 'content'],
    },
    targetPost: {
      type: 'object',
      properties: {
        id: {type: 'string'},
      },
      required: ['id'],
    },
    comment: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        content: {type: 'string'},
      },
      required: ['id', 'content'],
    },
    createdAt: {type: 'string'},
  },
  required: [
    'id',
    'notificationType',
    'isRead',
    'actor',
    'targetComment',
    'targetPost',
    'comment',
    'createdAt',
  ],
} as const;
