import {Outlet} from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout.js';
import {
  CurrentUserProvider,
  useCurrentUser,
} from '@/context/currentUserContext.js';
import {TitleProvider} from '@/context/pageTitleContext.js';
import {Loader} from '@/components/ui/Loader.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {ActiveGroupProvider} from '@/context/activeGroupContext.js';
import {AiGuidanceProvider} from '@/context/aiGuidanceContext.js';

function DashboardContent() {
  const {currentUser} = useCurrentUser();
  const community = currentUser?.selectedCommunity;
  const language = currentUser?.language;

  if (!community || !language) {
    return (
      <CenterAligned>
        <Loader />
      </CenterAligned>
    );
  }

  return (
    <TitleProvider>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </TitleProvider>
  );
}

export default function DashboardPage() {
  return (
    <CurrentUserProvider>
      <ActiveGroupProvider>
        <AiGuidanceProvider>
          <DashboardContent />
        </AiGuidanceProvider>
      </ActiveGroupProvider>
    </CurrentUserProvider>
  );
}
