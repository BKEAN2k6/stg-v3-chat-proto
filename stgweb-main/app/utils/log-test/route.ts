import {logToSentry} from '@/lib/log';
import {respond} from '@/lib/server-only-utils';

export async function GET() {
  console.error('hello, this is a test error');
  console.info('hello, this is a test info');
  console.warn('hello, this is a test warn');
  await logToSentry(new Error('error from log-test route'));
  return respond(200, 'ok');
}
