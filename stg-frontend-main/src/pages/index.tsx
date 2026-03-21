import {Outlet} from 'react-router-dom';
import {useTracking} from 'react-tracking';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  CurrentUserProvider,
  useCurrentUser,
} from '@/context/currentUserContext';
import {TitleProvider} from '@/context/pageTitleContext';

function DashboardContent() {
  const {currentUser} = useCurrentUser();
  const community = currentUser?.selectedCommunity;
  const language = currentUser?.language;
  const {Track} = useTracking<Trackables>({community, language});

  if (!community || !language) {
    return null;
  }

  return (
    <Track>
      <TitleProvider>
        <DashboardLayout>
          <Outlet />
        </DashboardLayout>
      </TitleProvider>
    </Track>
  );
}

export default function DashboardPage() {
  return (
    <CurrentUserProvider>
      <DashboardContent />
    </CurrentUserProvider>
  );
}
