export const CommunityInvitationNotification = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    notificationType: {
      type: 'string',
      enum: ['community-invitation-notification'],
    },
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
    community: {
      type: 'object',
      properties: {
        id: {type: 'string'},
        name: {type: 'string'},
      },
      required: ['id', 'name'],
    },
    createdAt: {type: 'string'},
  },
  required: [
    'id',
    'notificationType',
    'isRead',
    'actor',
    'community',
    'createdAt',
  ],
} as const;
