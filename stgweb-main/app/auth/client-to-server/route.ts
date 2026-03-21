import {headers} from 'next/headers';
import {type NextRequest, NextResponse} from 'next/server';

export async function POST(request: NextRequest) {
  const headersList = headers();
  const authorizationHeader = headersList.get('authorization');
  const authToken = authorizationHeader?.replace('Bearer ', '');

  const body = (await request.json()) as {expires: number};

  const response = NextResponse.json({message: 'ok'}, {status: 200});

  if (authToken && body.expires) {
    response.cookies.set({
      name: 'auth_token',
      value: authToken || '',
      httpOnly: true,
      // This works similarly to the localStorage item, only on the server. So it
      // should not expire, the renewal logic is handled in a middleware.
      maxAge: 2147483647, // "never" expire
    });

    response.cookies.set({
      name: 'auth_expires_at',
      // body.expires is basically TTL value
      value: (Date.now() + body.expires).toString(),
      httpOnly: true,
      // This works similarly to the localStorage item, only on the server. So it
      // should not expire, the renewal logic is handled in a middleware.
      maxAge: 2147483647, // "never" expire
    });
  }

  return response;
}
