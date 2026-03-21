export const CommentCommentNotification = {
  type: 'object',
  properties: {
    _id: {type: 'string'},
    notificationType: {type: 'string', enum: ['comment-comment-notification']},
    isRead: {type: 'boolean'},
    actor: {
      type: 'object',
      properties: {
        _id: {type: 'string'},
        firstName: {type: 'string'},
        lastName: {type: 'string'},
        avatar: {type: 'string'},
      },
      required: ['_id', 'firstName', 'lastName', 'avatar'],
    },
    targetComment: {
      type: 'object',
      properties: {
        _id: {type: 'string'},
        content: {type: 'string'},
      },
      required: ['_id', 'content'],
    },
    targetPost: {
      type: 'object',
      properties: {
        _id: {type: 'string'},
      },
      required: ['_id'],
    },
    comment: {
      type: 'object',
      properties: {
        _id: {type: 'string'},
        content: {type: 'string'},
      },
      required: ['_id', 'content'],
    },
    createdAt: {type: 'string'},
  },
  required: [
    '_id',
    'notificationType',
    'isRead',
    'actor',
    'targetComment',
    'targetPost',
    'comment',
    'createdAt',
  ],
} as const;
