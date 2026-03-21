export const CommunityMemberInvitation = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    email: {type: 'string', format: 'email'},
    createdAt: {type: 'string', format: 'date-time'},
  },
  required: ['id', 'email', 'createdAt'],
} as const;
