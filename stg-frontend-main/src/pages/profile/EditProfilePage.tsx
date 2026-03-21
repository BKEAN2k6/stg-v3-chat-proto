import {useEffect} from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import PasswordForm from './PasswordForm';
import AvatarForm from './AvatarForm';
import DetailsForm from './DetailsForm';
import EmailForm from './EmailForm';
import {useCurrentUser} from '@/context/currentUserContext';
import {useTitle} from '@/context/pageTitleContext';

export default function EditProfilePage() {
  const {_} = useLingui();
  const {setTitle} = useTitle();
  const {currentUser, setCurrentUser} = useCurrentUser();

  useEffect(() => {
    setTitle(_(msg`Profile`));
  }, [setTitle, _]);

  if (!currentUser) {
    return null;
  }

  return (
    <Tabs defaultActiveKey="details" className="mb-3">
      <Tab eventKey="details" title={_(msg`Details`)}>
        <DetailsForm
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
        />
      </Tab>
      <Tab eventKey="avatar" title={_(msg`Avatar`)}>
        <AvatarForm currentUser={currentUser} setCurrentUser={setCurrentUser} />
      </Tab>
      <Tab eventKey="password" title={_(msg`Password`)}>
        <PasswordForm />
      </Tab>
      <Tab eventKey="email" title={_(msg`Email`)}>
        <EmailForm />
      </Tab>
    </Tabs>
  );
}
