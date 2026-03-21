import {LogoutRedirect} from './LogoutRedirect';
import {Loader} from '@/components/atomic/atoms/Loader';

const LoginPage = () => (
  <>
    <div className="min-safe-h-screen flex w-screen items-center justify-center bg-primary">
      <Loader />
    </div>
    <LogoutRedirect />
  </>
);

export default LoginPage;
