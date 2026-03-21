import {type NextRequest, NextResponse} from 'next/server';
import {PUBLIC_URL} from '@/constants.mjs';
import {getUrlFromRequest} from '@/lib/server-only-utils';
import {cookieDomain} from '@/lib/utils';

type Context = {
  params: {
    locale: 'fi-FI' | 'en-US' | 'sv-SE';
  };
};

export async function GET(request: NextRequest, ctx: Context) {
  const url = getUrlFromRequest(request);
  const target = url.searchParams.get('target');
  const responseRedirect = NextResponse.redirect(
    target ? `${PUBLIC_URL}/${target}` : PUBLIC_URL,
  );

  if (['fi-FI', 'en-US', 'sv-SE'].includes(ctx.params.locale)) {
    responseRedirect.cookies.set({
      name: 'locale',
      value: ctx.params.locale,
      httpOnly: false,
      maxAge: 2147483647, // "never" expire
      domain: cookieDomain(),
    });
    return responseRedirect;
  }

  return NextResponse.json({locale: ctx.params.locale});
}
