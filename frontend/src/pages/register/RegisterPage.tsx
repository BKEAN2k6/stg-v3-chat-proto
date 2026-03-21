import {Outlet} from 'react-router-dom';
import RegisterLayout from '@/layouts/OnboardingFlowLayout.js';

export default function RegisterPage() {
  return (
    <RegisterLayout>
      <Outlet />
    </RegisterLayout>
  );
}
