import {NextResponse} from 'next/server';

export async function POST() {
  const response = NextResponse.json({message: 'ok'}, {status: 200});

  response.cookies.set({
    name: 'directus_refresh_token',
    value: '',
    httpOnly: true,
    maxAge: -1,
  });

  response.cookies.set({
    name: 'auth_token',
    value: '',
    httpOnly: true,
    maxAge: -1,
  });

  response.cookies.set({
    name: 'auth_expires_at',
    value: '',
    httpOnly: true,
    maxAge: -1,
  });

  response.cookies.set({
    name: 'auth_token_last_refreshed_at',
    value: '',
    httpOnly: true,
    maxAge: -1,
  });

  response.cookies.set({
    name: 'sessid',
    value: '',
    httpOnly: false,
    maxAge: -1,
  });

  response.cookies.set({
    name: 'user_type',
    value: '',
    httpOnly: false,
    maxAge: -1,
  });

  return response;
}
