import {type NextRequest, NextResponse} from 'next/server';
import {PUBLIC_URL} from '@/constants.mjs';
import {getLoggedInUser} from '@/lib/server-only-utils';

export async function GET(request: NextRequest) {
  const loggedInUser = await getLoggedInUser(request);

  if (loggedInUser?.organizations?.length > 1) {
    return NextResponse.redirect(`${PUBLIC_URL}/organization-picker`);
  }

  if (loggedInUser) {
    return NextResponse.redirect(`${PUBLIC_URL}/dashboard/community`);
  }

  return NextResponse.redirect(`${PUBLIC_URL}`);
}
