import {headers} from 'next/headers';
import {type NextRequest} from 'next/server';
import {type Directus, type IAuth} from '@directus/sdk';
import {ORG_CONTROLLER_ROLE_ID} from '@/constants.mjs';
import {
  createServerSideAdminDirectusClient,
  createServerSideDirectusClient,
} from '@/lib/directus';
import {getUrlFromRequest, respond} from '@/lib/server-only-utils';
import type {Moment} from '@/types/moment';

/* eslint no-await-in-loop: 0 */

type TypeMap = Record<string, unknown>;

// eslint-disable-next-line max-params
async function batchQuery<T>(
  directus: Directus<TypeMap, IAuth>,
  extraParameters: any,
  idArray: string[],
  batchSize: number,
  queryFunction: (
    ids: string[],
    extraParameters_: any,
    directus: any,
  ) => Promise<T[]>,
): Promise<T[]> {
  const totalBatches = Math.ceil(idArray.length / batchSize);
  let aggregatedResults: T[] = [];

  for (let i = 0; i < totalBatches; i++) {
    const startIdx = i * batchSize;
    const endIdx = startIdx + batchSize;
    const currentBatch = idArray.slice(startIdx, endIdx);

    try {
      const batchResults = await queryFunction(
        currentBatch,
        extraParameters,
        directus,
      );
      aggregatedResults = [...aggregatedResults, ...batchResults];
    } catch (error) {
      console.error(`Error in batch ${i + 1}:`, error);
    }
  }

  return aggregatedResults;
}

const queryOrgs = async (
  orgIdsToGet: string[],
  extraParameters: Record<string, unknown>,
  directus: Directus<TypeMap, IAuth>,
) => {
  const query = await directus.items('organization').readByQuery({
    fields: ['id', 'swl_wall'],
    limit: -1,
    filter:
      orgIdsToGet.length > 0
        ? {
            id: {
              _in: orgIdsToGet,
            },
          }
        : {},
  });
  return query.data ?? [];
};

const querySwlItems = async (
  wallIds: string[],
  extraParameters: {date: Date},
  directus: Directus<TypeMap, IAuth>,
) => {
  const query = await directus.items('swl_item').readByQuery({
    fields: ['id'],
    limit: -1,
    filter: {
      _and: [
        {
          swl_wall_links: {
            swl_wall: {
              id: {
                _in: wallIds,
              },
            },
          },
        },
        ...dateFilter(extraParameters.date),
      ],
    },
  });
  return query.data ?? [];
};

const queryMoments = async (
  itemIds: string[],
  extraParameters: Record<string, unknown>,
  directus: Directus<TypeMap, IAuth>,
) => {
  const momentsQuery = await directus.items('swl_moment').readByQuery({
    fields: ['id', 'strengths', 'user_created', 'created_by'],
    limit: -1,
    filter: {
      _and: [
        {
          swl_item: {
            id: {
              _in: itemIds,
            },
          },
        },
      ],
    },
  });
  return momentsQuery.data ?? [];
};

function dateFilter(date: Date) {
  return [
    {
      'year(date_created)': {
        _eq: date.getUTCFullYear(),
      },
    },
    {
      'month(date_created)': {
        _eq: date.getUTCMonth() + 1,
      },
    },
    {
      'day(date_created)': {
        _eq: date.getUTCDate(),
      },
    },
  ];
}

function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month}-${day}Z`;
}

// https://vercel.com/changelog/serverless-functions-can-now-run-up-to-5-minutes
export const maxDuration = 300;

// eslint-disable-next-line complexity
export async function POST(request: NextRequest) {
  const directus = await createServerSideAdminDirectusClient();
  const urlParts = getUrlFromRequest(request);
  const dateInput = urlParts.searchParams.get('date');
  const orgId = urlParts.searchParams.get('orgId');

  // See below, there's only two cases where this is flipped to true: either
  // this is coming from a cron job or a user with the "organization-controller"
  // role
  let allowAccess = false;

  const cookieAuthToken = request.cookies.get('auth_token')?.value;

  // if no auth token in cookies, try to auth with an authorization header
  // (vercel cron jobs do this:
  // https://github.com/orgs/vercel/discussions/1734#discussioncomment-6119286)
  if (cookieAuthToken) {
    // if we do have an auth cookie, confirm that user can do this based on that
    const userDirectus = await createServerSideDirectusClient({
      authToken: cookieAuthToken,
    });
    let loggedInUser;
    try {
      loggedInUser = await userDirectus.users.me.read();
    } catch (error) {
      console.error(error);
      return respond(400, 'failed-to-fetch-logged-in-user');
    }

    if (!loggedInUser.id) {
      return respond(400, 'invalid-user');
    }

    if (loggedInUser.role === ORG_CONTROLLER_ROLE_ID) {
      allowAccess = true;
    }
  } else {
    const headersList = headers();
    const authorizationHeader = headersList.get('authorization');
    const authToken = authorizationHeader?.replace('Bearer ', '');
    const secret = process.env.CRON_SECRET;
    if (authToken === secret) {
      allowAccess = true;
    }
  }

  if (!allowAccess) {
    return respond(401, 'unauthorized');
  }

  let date: Date;
  if (dateInput) {
    date = new Date(dateInput);
  } else {
    const formattedDate = formatDate(new Date());
    date = new Date(formattedDate);
  }

  // Step 1: Retrieve a subset (or all) of organizations and their swl_wall IDs.
  const orgs = await (orgId
    ? queryOrgs([orgId], {}, directus)
    : queryOrgs([], {}, directus));

  for (const org of orgs) {
    // Step 2: Retrieve all walls from users in this organization
    // @TODO add group walls here as well if that becomes a thing...
    const orgSwlWallIds = [org.swl_wall];
    let userSwlWallIds: string[] = [];
    try {
      const users = await directus.items('user_to_organization').readByQuery({
        fields: ['user.swl_wall'],
        limit: -1,
        filter: {
          _and: [
            {
              organization: {
                _eq: org.id,
              },
            },
            {
              user: {
                swl_wall: {
                  _nnull: true,
                },
              },
            },
          ],
        },
      });
      userSwlWallIds = [
        ...(users?.data?.map((link) => link.user.swl_wall) ?? []),
      ];
    } catch (error) {
      console.error(error);
      continue; // Skip to next organization
    }

    // Step 3: Fetch swl_items in previously gathered swlWallIds
    // do this in batches of 100 at a time to avoid requests that are too large
    const orgSwlItems = await batchQuery(directus, {date}, orgSwlWallIds, 100, querySwlItems); // prettier-ignore
    const userSwlItems = await batchQuery(directus, {date}, userSwlWallIds, 100, querySwlItems); // prettier-ignore

    // get the ids only
    const orgSwlItemIds = [...(orgSwlItems?.map((item) => item.id) || [])];
    const userSwlItemIds = [...(userSwlItems?.map((item) => item.id) || [])];

    // Step 4: fetch moments and count the strengths seen in those moments
    let orgStrengthCount = 0;
    if (orgSwlItemIds.length > 0) {
      // do this in batches of 100 at a time to avoid requests that are too large
      const moments: Moment[] = await batchQuery(
        directus,
        {},
        orgSwlItemIds,
        100,
        queryMoments,
      );
      // calculate the strength count for this organization
      for (const moment of moments) {
        orgStrengthCount += moment.strengths.length;
      }
    }

    // Step 5: fetch moments and count the strengths seen in those moments
    let selfStrengthCount = 0;
    let otherStrengthCount = 0;
    if (userSwlItemIds.length > 0) {
      // do this in batches of 100 at a time to avoid requests that are too large
      const moments: Moment[] = await batchQuery(directus, {}, userSwlItemIds, 100, queryMoments); // prettier-ignore
      // calculate the strength count for this organization
      for (const moment of moments) {
        // NOTE: this assumption can be made since when moments are added to
        // other users walls, the "user_created" record will be the Positive
        // Admin, and the "created_by" will be the actual sending user (since we
        // don't directly grant permissions to write to other peoples walls)
        if (moment.user_created === moment.created_by) {
          selfStrengthCount += moment.strengths.length;
        } else {
          otherStrengthCount += moment.strengths.length;
        }
      }
    }

    const latestQuery = await directus
      .items('organization_timeseries_data')
      .readByQuery({
        filter: {
          organization: {
            _eq: org.id,
          },
        },
        sort: ['-date_created'] as never[],
        limit: 2,
      });

    const latest = latestQuery.data?.[0] as any;
    const oneBeforeLatest = latestQuery.data?.[1] as any;

    const latestIsToday = latest
      ? formatDate(new Date(latest.date_created)) === formatDate(new Date())
      : false;

    let strengthsInOrgToDate = 0;
    let strengthsInSelfsToDate = 0;
    let strengthsInOthersToDate = 0;

    // when updating
    if (latestIsToday && oneBeforeLatest) {
      strengthsInOrgToDate = oneBeforeLatest.total_strengths_seen_in_org_to_date; // prettier-ignore
      strengthsInSelfsToDate = oneBeforeLatest.total_strengths_seen_in_selfs_to_date; // prettier-ignore
      strengthsInOthersToDate = oneBeforeLatest.total_strengths_seen_in_others_to_date; // prettier-ignore
    }

    // when creating a new one
    if (!latestIsToday && latest) {
      strengthsInOrgToDate = latest.total_strengths_seen_in_org_to_date; // prettier-ignore
      strengthsInSelfsToDate = latest.total_strengths_seen_in_selfs_to_date; // prettier-ignore
      strengthsInOthersToDate = latest.total_strengths_seen_in_others_to_date; // prettier-ignore
    }

    const newData = {
      // at date
      total_strengths_seen_in_org_at_date: orgStrengthCount,
      total_strengths_seen_in_selfs_at_date: selfStrengthCount,
      total_strengths_seen_in_others_at_date: otherStrengthCount,
      // cumulative
      total_strengths_seen_in_org_to_date: strengthsInOrgToDate + orgStrengthCount, // prettier-ignore
      total_strengths_seen_in_selfs_to_date: strengthsInSelfsToDate + selfStrengthCount, // prettier-ignore
      total_strengths_seen_in_others_to_date: strengthsInOthersToDate + otherStrengthCount, // prettier-ignore
    };

    // Step 6: Populate organization_timeseries_data table for this organization
    if (latestIsToday) {
      // update an existing record
      try {
        await directus
          .items('organization_timeseries_data')
          .updateOne(latest.id, {
            date_created: date,
            ...newData,
          });
      } catch (error) {
        console.error(error);
        continue; // Skip to next organization
      }
    } else {
      // create a new record
      try {
        await directus.items('organization_timeseries_data').createOne({
          organization: org.id,
          date_created: date,
          ...newData,
        });
      } catch (error) {
        console.error(error);
        continue; // Skip to next organization
      }
    }
  }
  // NOTE: ^ code above is executed for all organizations in a loop!

  return respond(200, 'ok', {orgs: orgs.length});
}
