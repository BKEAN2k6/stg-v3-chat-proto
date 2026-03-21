import {redirect} from 'next/navigation';
import {PATHS} from '@/constants.mjs';

export default async function DashboardPage() {
  redirect(PATHS.home);
}
