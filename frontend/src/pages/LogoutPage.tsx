import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {Loader} from '@/components/ui/Loader.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';

export default function LogoutPage() {
  const toasts = useToasts();
  const {logout} = useCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await logout();
        navigate('/start');
      } catch {
        navigate('/');
      }
    })();
  }, [logout, navigate, toasts]);

  return (
    <CenterAligned>
      <Loader />
    </CenterAligned>
  );
}
