export const GroupGamePlayer = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    nickname: {type: 'string'},
    color: {type: 'string'},
    avatar: {type: 'string'},
  },
  required: ['id', 'nickname', 'color', 'avatar'],
} as const;
