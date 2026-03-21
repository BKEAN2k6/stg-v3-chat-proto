import {type NextRequest, NextResponse} from 'next/server';
import {createServerSideDirectusClient} from '@/lib/directus';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const uid = body.uid;
  const event = body.event;
  const metadata = body.metadata;
  const browser = body.browser;

  const authToken = request.cookies.get('auth_token')?.value ?? '';
  let sessid = request.cookies.get('sessid')?.value;

  const response = NextResponse.json({message: 'ok'}, {status: 200});

  let directus;
  try {
    directus = await createServerSideDirectusClient({authToken});
  } catch {
    return NextResponse.json({message: 'failed auth'}, {status: 400});
  }

  if (!sessid) {
    sessid = `${Date.now()}_${uid}`;
    response.cookies.set({
      name: 'sessid',
      value: sessid,
      httpOnly: false,
      maxAge: 2147483647, // "never" expire
    });

    try {
      await directus.items('analytics_session').createOne({
        user_created: uid,
        sessid,
        browser,
      });
    } catch {
      // @TODO add warning to logging service
    }
  }

  try {
    await directus.items('analytics_event').createOne({
      user_created: uid,
      event,
      sessid,
      ...(metadata && {metadata}),
    });
    return response;
  } catch {
    return NextResponse.json({message: 'failed event'}, {status: 400});
  }
}
