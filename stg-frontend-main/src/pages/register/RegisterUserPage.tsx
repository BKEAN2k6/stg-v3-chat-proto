import {useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import NamesForm from './components/NamesForm';
import EmailForm from './components/EmailForm';
import PasswordForm from './components/PasswordForm';
import RegisterAvatar from './components/RegisterAvatar';
import ConfirmJoin from './components/ConfirmJoin';
import EmailSent from './components/EmailSent';
import ConfirmOnboarding from './components/ConfirmOnboarding';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import OnboardingFlowLayout from '@/layouts/OnboardingFlowLayout';
import CommunityAvatar from '@/pages/register/CommunityAvatar';
import LoginModal from '@/components/LoginModal';
import {colorFromId} from '@/helpers/avatars';
import {useLanguage} from '@/context/languageContext';

export default function RegisterUserPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const [currentStep, setCurrentStep] = useState<
    | 'email'
    | 'names'
    | 'password'
    | 'emailSent'
    | 'avatar'
    | 'confirmJoin'
    | 'existingMember'
  >();
  const [community, setCommunity] = useState<
    | {
        color: string;
        name: string;
        avatar: string;
        code: string;
        _id: string;
      }
    | undefined
  >(undefined);
  const [email, setEmail] = useState<undefined | string>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
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
        const community = await api.getCommunityInvitationWithCode({
          code,
        });
        setCommunity({
          color: colorFromId(community._id),
          code,
          ...community,
        });
        try {
          const user = await api.getMe();

          if (user.communities.some((c) => c._id === community._id)) {
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

  const handleNamesSubmit = async (firstName: string, lastName: string) => {
    setFirstName(firstName);
    setLastName(lastName);

    if (community) {
      setCurrentStep('password');
      return;
    }

    if (!email || !firstName || !lastName) {
      return;
    }

    try {
      await api.createUser({
        email,
        firstName,
        lastName,
        language: currentLanguage,
      });

      setCurrentStep('emailSent');
    } catch {
      showErrorToast();
    }
  };

  const handleEmailSubmit = async (email: string) => {
    setEmail(email);

    try {
      const {exists} = await api.checkEmailExists({email});

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
        language: currentLanguage,
      });

      setCurrentStep('avatar');
    } catch {
      showErrorToast();
    }
  };

  const handleLogin = async () => {
    if (!community) {
      navigate('/');
      return;
    }

    try {
      const user = await api.getMe();
      if (user.communities.some((c) => c._id === community._id)) {
        setCurrentStep('existingMember');
        return;
      }

      setCurrentStep('confirmJoin');
    } catch {
      showErrorToast();
    }
  };

  const handleConfirmJoin = async () => {
    if (!community) {
      return;
    }

    try {
      await api.createMyCommunityJoin({
        code: community.code,
      });

      navigate(`/register/moment?communityId=${community._id}`);
    } catch {
      showErrorToast();
    }
  };

  const goToMomentCreation = () => {
    if (!community) {
      return;
    }

    navigate(`/register/moment?communityId=${community._id}`);
  };

  const handleSkipOnboarding = () => {
    navigate(`/?c=${community?._id}`);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  const steps: Record<
    | 'email'
    | 'names'
    | 'password'
    | 'avatar'
    | 'emailSent'
    | 'confirmJoin'
    | 'existingMember',
    JSX.Element | undefined
  > = {
    email: <EmailForm onSubmit={handleEmailSubmit} />,
    names: <NamesForm onSubmit={handleNamesSubmit} />,
    password: <PasswordForm onSubmit={handlePasswordSubmit} />,
    avatar: (
      <RegisterAvatar
        firstName={firstName}
        lastName={lastName}
        onComplete={goToMomentCreation}
      />
    ),
    emailSent: <EmailSent email={email!} />,
    confirmJoin: <ConfirmJoin onConfirm={handleConfirmJoin} />,
    existingMember: (
      <ConfirmOnboarding
        onConfirm={goToMomentCreation}
        onSkip={handleSkipOnboarding}
      />
    ),
  };

  if (!currentStep) {
    return null;
  }

  return (
    <>
      <OnboardingFlowLayout>
        {community && (
          <CommunityAvatar
            avatarColor={colorFromId(community._id)}
            avatarName={community.name}
            avatarPath={community.avatar}
          />
        )}
        {steps[currentStep]}
      </OnboardingFlowLayout>
      <LoginModal
        isOpen={isLoginModalOpen}
        targetCommunityName={community?.name}
        prefilledEmail={email}
        invitationCode={community?.code}
        onClose={handleLoginModalClose}
        onLogin={handleLogin}
      />
    </>
  );
}
