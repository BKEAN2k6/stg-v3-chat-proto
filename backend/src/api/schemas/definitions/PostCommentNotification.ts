export const PostCommentNotification = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    notificationType: {type: 'string', enum: ['post-comment-notification']},
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
    targetPost: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        postType: {type: 'string', enum: ['moment', 'sprint-result']},
        content: {type: 'string'},
      },
      required: ['id', 'postType'],
    },
    createdAt: {type: 'string'},
  },
  required: [
    'id',
    'notificationType',
    'isRead',
    'actor',
    'targetPost',
    'createdAt',
  ],
} as const;
