import {useContext} from 'react';
import {
  DashboardContext,
  type DashboardState,
} from '@/providers/DashboardContext';

export default function useDashboard() {
  const context = useContext(DashboardContext);

  if (!context) {
    throw new Error(
      'This component must be used within a DashboardContextProvider',
    );
  }

  const [dashboardState, setDashboardState] = context;

  const setState = (newState: Partial<DashboardState>) => {
    setDashboardState({...dashboardState, ...newState});
  };

  return {
    dashboardState,
    setDashboardState: setState,
  };
}
