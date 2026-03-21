import {
  createClientSideDirectusClient,
  refreshAuthIfExpired,
} from '@/lib/directus';

const sessionUserFilter = (sessionId: string) => ({
  _and: [
    {
      active_strength_session: {
        _eq: sessionId,
      },
    },
    // NOTE: this is supposed to get rid of the host. If for some reason the
    // player users also start getting an an active_organization record, this
    // will fail.
    {
      active_organization: {
        _null: true,
      },
    },
    // this is to filter out users that might join, but never fill in their
    // name, thus kind of being part of the session, but not relevant in any way
    {
      first_name: {
        _nnull: true,
      },
    },
  ],
});

export function sp(path: string, strengthSessionId: string) {
  return path.replace('[sessionId]', strengthSessionId);
}

export async function fetchStrengthSession(sessionId: string, directus: any) {
  const strengthSession = await directus
    .items('strength_session')
    .readOne(sessionId);
  return strengthSession;
}

export async function fetchStrengthSessionUsers(
  sessionId: string,
  directus: any,
) {
  const sessionUsers = await directus.items('directus_users').readByQuery({
    limit: -1,
    filter: sessionUserFilter(sessionId),
  });
  return sessionUsers?.data || [];
}

export async function fetchStrengthSessionStrengths(
  sessionId: string,
  directus: any,
) {
  const strengthSession = await directus
    .items('strength_session_strength')
    .readByQuery({
      limit: -1,
      filter: {
        strength_session: {
          _eq: sessionId,
        },
      },
    });
  return strengthSession?.data || [];
}

// just gets more data with one call
export async function fetchStrengthSessionWithRelatedData(
  sessionId: string,
  directus: any,
) {
  const strengthSessionWithRelatedData = await directus
    .items('strength_session')
    .readOne(sessionId, {
      fields: [
        'id',
        'date_created',
        'group.name',
        'users.id',
        'users.first_name',
        'strength_session_strengths.*',
      ],
      deep: {
        users: {
          _filter: sessionUserFilter(sessionId),
          _limit: -1,
        },
        strength_session_strengths: {
          _limit: -1,
        },
      },
    });
  return strengthSessionWithRelatedData;
}

type WseventParameters = {
  sessionId: string;
  eventType:
    | 'session_player_joined'
    | 'session_activated'
    | 'session_completed'
    | 'session_strength_seen';
  lookupValue?: string | undefined;
};
export async function wsevent(parameters: WseventParameters) {
  const {sessionId, eventType, lookupValue} = parameters;
  const directus = createClientSideDirectusClient();
  try {
    await refreshAuthIfExpired({force: true});
    if (eventType === 'session_activated') {
      directus.items('strength_session_new_status').createOne({
        strength_session: sessionId,
        new_status: 'active',
      });
    }

    if (eventType === 'session_completed') {
      directus.items('strength_session_new_status').createOne({
        strength_session: sessionId,
        new_status: 'completed',
      });
    }

    if (eventType === 'session_player_joined') {
      directus.items('strength_session_new_player').createOne({
        strength_session: sessionId,
        user: lookupValue,
      });
    }

    if (eventType === 'session_strength_seen') {
      directus.items('strength_session_new_strength').createOne({
        strength_session: sessionId,
        strength_session_strength: lookupValue,
      });
    }
  } catch (error) {
    console.error(error);
  }
}
