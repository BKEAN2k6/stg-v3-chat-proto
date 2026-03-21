import {useContext} from 'react';
import {DashboardContext} from '@/providers/DashboardContext';

export default function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      'This component must be used within a DashboardContextProvider',
    );
  }

  const [dashboardState, setDashboardState] = context;

  return {
    dashboardState,
    setDashboardState,
  };
}
