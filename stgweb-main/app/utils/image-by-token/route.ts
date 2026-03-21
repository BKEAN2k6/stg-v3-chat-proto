// This can access any image in the system if user has the UUID and the
// peek_access_token of the image in question

import path from 'node:path';
import {type NextRequest, NextResponse} from 'next/server';
import {DATA_API_URL, PUBLIC_URL} from '@/constants.mjs';
import {createServerSideAdminDirectusClient} from '@/lib/directus';

const brokenImageUrl = `${PUBLIC_URL}/images/misc/broken-image.png`;

async function respondWithImage(imageUrl: string) {
  const response = await fetch(imageUrl);
  const contentLength = response.headers.get('content-length') ?? 'unknown';
  const contentType = response.headers.get('content-type') ?? 'image/png'; // default to png if type is unknown

  const data: ReadableStream<Uint8Array> = await streamFromURL(imageUrl);
  return new NextResponse(data, {
    status: 200,
    headers: new Headers({
      'content-disposition': `inline; filename=${path.basename(
        new URL(imageUrl).pathname,
      )}`,
      'content-type': contentType,
      'content-length': contentLength,
    }),
  });
}

async function streamFromURL(url: string): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch the URL: ${response.statusText}`);
  }

  return response.body!;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get('token');
  const uuid = request.nextUrl.searchParams.get('uuid');

  const adminDirectus = await createServerSideAdminDirectusClient();
  // NOTE: never share this with the client!!!
  const adminDirectusAccessToken = await adminDirectus.auth.token;

  let peekableImageQuery;
  try {
    peekableImageQuery = await adminDirectus
      .items('directus_files')
      .readByQuery({
        filter: {
          peek_access_token: {
            _eq: token,
          },
        },
      });
  } catch {
    return respondWithImage(brokenImageUrl);
  }

  if (peekableImageQuery?.data?.length !== 1) {
    return respondWithImage(brokenImageUrl);
  }

  const imageUrl = `${DATA_API_URL}/assets/${uuid}?access_token=${adminDirectusAccessToken}`;

  return respondWithImage(imageUrl);
}
