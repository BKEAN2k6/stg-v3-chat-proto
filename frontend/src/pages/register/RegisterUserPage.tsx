import {msg} from '@lingui/core/macro';
import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import NamesForm from './components/NamesForm.js';
import OrganizationForm from './components/OrganizationForm.js';
import EmailForm from './components/EmailForm.js';
import PasswordForm from './components/PasswordForm.js';
import ConfirmJoin from './components/ConfirmJoin.js';
import EmailSent from './components/EmailSent.js';
import ConfirmOnboarding from './components/ConfirmOnboarding.js';
import {useToasts} from '@/components/toasts/index.js';
import CommunityAvatar from '@/pages/register/CommunityAvatar.js';
import LoginModal from '@/components/LoginModal.js';
import {colorFromId} from '@/helpers/avatars.js';
import {useLanguage} from '@/context/languageContext.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';

export default function RegisterUserPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [currentStep, setCurrentStep] = useState<
    | 'email'
    | 'names'
    | 'organization'
    | 'password'
    | 'emailSent'
    | 'confirmJoin'
    | 'existingMember'
  >();
  const [community, setCommunity] = useState<
    | {
        color: string;
        name: string;
        avatar: string;
        code: string;
        id: string;
      }
    | undefined
  >(undefined);
  const [email, setEmail] = useState<undefined | string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('');
  const [organization, setOrganization] = useState('');
  const [organizationType, setOrganizationType] = useState('');
  const [organizationRole, setOrganizationRole] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const {currentLanguage} = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const showErrorToast = () => {
    toasts.danger({
      header: _(msg`Oops!`),
      body: _(msg`Something did not work as expected. Please try again later.`),
    });
  };

  useEffect(() => {
    (async () => {
      const searchParameters = new URLSearchParams(location.search);
      const code = searchParameters.get('invitationCode');
      if (!code) {
        try {
          await api.getMe();
          navigate('/');
          return;
        } catch {
          setCurrentStep('email');
          return;
        }
      }

      try {
        const community = await api.getCommunityInvitationWithCode({code});
        setCommunity({
          color: colorFromId(community.id),
          code,
          ...community,
        });
        try {
          const user = await api.getMe();

          if (user.communities.some((c) => c.id === community.id)) {
            setCurrentStep('existingMember');
            return;
          }

          setCurrentStep('confirmJoin');
        } catch {
          setCurrentStep('email');
        }
      } catch {
        navigate('/register/code');
      }
    })();
  }, [location, navigate]);

  const handleNamesSubmit = (firstNameInput: string, lastNameInput: string) => {
    setFirstName(firstNameInput);
    setLastName(lastNameInput);
    setCurrentStep('organization');
  };

  const handleOrganizationSubmit = async (
    countryInput: string,
    organizationInput: string,
    organizationTypeInput: string,
    organizationRoleInput: string,
  ) => {
    setCountry(countryInput);
    setOrganization(organizationInput);
    setOrganizationType(organizationTypeInput);
    setOrganizationRole(organizationRoleInput);

    if (community) {
      setCurrentStep('password');
      return;
    }

    if (!email || !firstName || !lastName) {
      return;
    }

    try {
      await api.register({
        email,
        firstName,
        lastName,
        country: countryInput,
        organization: organizationInput,
        organizationType: organizationTypeInput,
        organizationRole: organizationRoleInput,
        language: currentLanguage,
      });

      setCurrentStep('emailSent');
    } catch {
      showErrorToast();
    }
  };

  const handleEmailSubmit = async (emailInput: string) => {
    setEmail(emailInput);

    try {
      const {exists} = await api.checkEmailExists({email: emailInput});

      if (exists) {
        setIsLoginModalOpen(true);
        return;
      }

      setCurrentStep('names');
    } catch {
      showErrorToast();
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!community || !email) {
      return;
    }

    try {
      await api.codeAuth({
        invitationCode: community.code,
        password,
        email,
        firstName,
        lastName,
        country,
        organization,
        organizationType,
        organizationRole,
        language: currentLanguage,
      });

      gotToFrontPage();
    } catch {
      showErrorToast();
    }
  };

  const gotToFrontPage = () => {
    if (!community) {
      navigate('/');
      return;
    }

    navigate(`/?c=${community.id}`);
  };

  const handleConfirmJoin = async () => {
    if (!community) {
      return;
    }

    try {
      await api.createMyCommunityJoin({
        code: community.code,
      });

      gotToFrontPage();
    } catch {
      showErrorToast();
    }
  };

  const steps: Record<
    | 'email'
    | 'names'
    | 'organization'
    | 'password'
    | 'emailSent'
    | 'confirmJoin'
    | 'existingMember',
    React.JSX.Element | undefined
  > = {
    email: (
      <>
        <EmailForm onSubmit={handleEmailSubmit} />
        <div className="mt-5">
          <GlobalLanguagePicker />
        </div>
      </>
    ),
    names: <NamesForm onSubmit={handleNamesSubmit} />,
    organization: <OrganizationForm onSubmit={handleOrganizationSubmit} />,
    password: <PasswordForm onSubmit={handlePasswordSubmit} />,
    emailSent: <EmailSent email={email!} />,
    confirmJoin: <ConfirmJoin onConfirm={handleConfirmJoin} />,
    existingMember: <ConfirmOnboarding onConfirm={gotToFrontPage} />,
  };

  if (!currentStep) {
    return null;
  }

  return (
    <>
      {community ? (
        <CommunityAvatar
          avatarColor={colorFromId(community.id)}
          avatarName={community.name}
          avatarPath={community.avatar}
        />
      ) : null}
      {steps[currentStep]}
      <LoginModal
        isOpen={isLoginModalOpen}
        targetCommunityName={community?.name}
        prefilledEmail={email}
        invitationCode={community?.code}
        onClose={() => {
          setIsLoginModalOpen(false);
        }}
        onLogin={async () => {
          gotToFrontPage();
        }}
      />
    </>
  );
}
