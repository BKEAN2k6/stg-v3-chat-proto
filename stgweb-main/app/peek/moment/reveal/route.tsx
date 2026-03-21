import {type NextRequest} from 'next/server';
import {createServerSideAdminDirectusClient} from '@/lib/directus';
import {respond} from '@/lib/server-only-utils';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const adminDirectus = await createServerSideAdminDirectusClient();
    const moments = await adminDirectus.items('swl_moment').readByQuery({
      fields: ['id', 'files.directus_files.*'],
      filter: {
        peek_access_token: {
          _eq: body.peekAccessToken,
        },
      },
      limit: 1,
      sort: ['-date_created'] as never,
    });
    const moment: any = moments.data?.[0];
    if (moment) {
      await adminDirectus.items('swl_moment').updateOne(moment.id, {
        peek_accessed_at: new Date(),
      });
      const files: any = moment.files;

      await Promise.all(
        files.map(async (file: any) =>
          adminDirectus
            .items('directus_files')
            .updateOne(file.directus_files.id, {
              peek_accessed_at: new Date(),
            }),
        ),
      );
    }
  } catch (error) {
    console.log(error);
    return respond(400, 'failed-to-update');
  }

  return respond(200, 'ok');
}
