import {headers} from 'next/headers';
import {NextResponse} from 'next/server';
import {isObject} from '@/types/runtime';
import {getAccessTokenFromAuthorizationHeader} from '@/lib/skolon/getAccessTokenFromAuthorizationHeader';
import {SkolonService} from '@/lib/skolon/skolon';

export async function GET() {
  const headersList = headers();
  const authorizationHeader = headersList.get('authorization');

  // Get user session to get userId
  const fetchSessionCall = await fetch(
    'https://api.skolon.com/v2/partner/user/session',
    {
      headers: {
        Authorization: authorizationHeader ?? '',
      },
    },
  );

  const fetchSessionData = await fetchSessionCall.json();

  if (!isObject(fetchSessionData)) {
    console.log('no session data');
    return NextResponse.error();
  }

  const {userUuId} = fetchSessionData;

  if (typeof userUuId !== 'string') {
    console.log('no user uuid');
    return NextResponse.error();
  }

  const accessToken = getAccessTokenFromAuthorizationHeader(
    authorizationHeader ?? undefined,
  );

  if (!accessToken) {
    console.log('no access token');
    return NextResponse.error();
  }

  const skolon = new SkolonService();

  const userHasValidLicense = await skolon.checkUserHasValidLicense(
    userUuId,
    accessToken,
  );

  if (!userHasValidLicense) {
    // @TODO: handle this case, e.g. log user out and redirect to login page, display error message
    console.log('no valid license');
    return NextResponse.error();
  }

  await skolon.syncBasicUserData(userUuId, accessToken);

  return NextResponse.json(
    {
      // the key here needs to match AUTH_SKOLON_IDENTIFIER_KEY value!
      skolon_uuid: userUuId, // <- wtf on this casing o.O
    },
    {status: 200},
  );
}
