import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useToasts} from '@/components/toasts';
import {useCurrentUser} from '@/context/currentUserContext';
import {Loader} from '@/components/ui/Loader';
import {CenterAligned} from '@/components/ui/CenterAligned';

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
        // NOTE: toasts won't work if we navigate away
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
