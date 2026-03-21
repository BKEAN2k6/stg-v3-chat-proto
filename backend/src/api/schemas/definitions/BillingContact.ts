export const BillingContact = {
  type: 'object',
  properties: {
    id: {type: 'string'},
    name: {type: 'string'},
    email: {type: 'string'},
    crmLink: {type: 'string'},
    notes: {type: 'string'},
  },
  required: ['id', 'name', 'email'],
} as const;
