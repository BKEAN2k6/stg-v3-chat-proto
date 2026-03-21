import {DashboardLayoutMain} from '../DashboardLayout';
import {DevPage} from './DevPage';

const DEBUG = process.env.NODE_ENV === 'development';

export default async function DashboardDevPage() {
  if (!DEBUG) {
    return false;
  }

  return (
    <DashboardLayoutMain hasSidebarsOnSide="both">
      <DevPage />
    </DashboardLayoutMain>
  );
}
