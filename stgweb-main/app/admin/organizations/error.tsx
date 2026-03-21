'use client';

import {PATHS} from '@/constants.mjs';

const AdminOrganizationErrorBoundary = () => (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div className="text-center">
      <div>Something went wrong.</div>
      <a
        href={`${PATHS.logout}?source=admin`}
        className="text-primary underline"
      >
        logout
      </a>
    </div>
  </main>
);

export default AdminOrganizationErrorBoundary;
