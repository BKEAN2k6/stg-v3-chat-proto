import {msg} from '@lingui/core/macro';
import {useEffect} from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {useLingui} from '@lingui/react';
import PasswordForm from './PasswordForm.js';
import AvatarForm from './AvatarForm.js';
import DetailsForm from './DetailsForm.js';
import ConsentsForm from './ConsentsForm.js';
import EmailForm from './EmailForm.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useTitle} from '@/context/pageTitleContext.js';

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
      <Tab eventKey="consents" title={_(msg`Consents`)}>
        <ConsentsForm
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
