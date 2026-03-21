import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {Trans} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import MomentForm from '@/components/MomentForm';
import OnboardingFlowLayout from '@/layouts/OnboardingFlowLayout';
import {type StrengthListItem, slugToListItem} from '@/helpers/strengths';
import {type StrengthSlug, type Community} from '@/api/ApiTypes';
import CommunityAvatar from '@/pages/register/CommunityAvatar';
import StrengthModal from '@/components/ui/StrengthModal';
import Callout from '@/components/ui/Callout';
import MediaUpload from '@/components/MediaUpload';
import api from '@/api/ApiClient';
import {colorFromId} from '@/helpers/avatars';

export default function RegisterMomentPage() {
  const {i18n} = useLingui();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | undefined>();
  const [activeStep, setActiveStep] = useState(1);
  const [isStrengthModalOpen, setIsStrengthModalOpen] = useState(false);
  const [selectedStrength, setSelectedStrength] = useState<
    StrengthListItem | undefined
  >();

  useEffect(() => {
    (async () => {
      const searchParameters = new URLSearchParams(location.search);
      const communityId = searchParameters.get('communityId');
      if (!communityId) {
        navigate('/register/code');
        return;
      }

      try {
        const community = await api.getCommunity({
          id: communityId,
        });

        setCommunity(community);
      } catch {
        navigate('/register/code');
      }
    })();
  }, [navigate]);

  const handleStrengthModalOpen = () => {
    setIsStrengthModalOpen(true);
  };

  const handleStrengthModalClose = () => {
    setIsStrengthModalOpen(false);
  };

  const handleStrengthSelected = (strength: StrengthSlug) => {
    if (!selectedStrength) {
      setActiveStep(2);
    }

    setSelectedStrength(slugToListItem(strength, i18n.locale));
    setIsStrengthModalOpen(false);
  };

  const handleMomentCreated = () => {
    navigate(`/?c=${community?._id}`);
  };

  if (!community) {
    return null;
  }

  const renderStep1Content = () => (
    <>
      <h1 className="display-6 my-5 text-center">
        <Trans>What strengths did you see in your community?</Trans>
      </h1>
      <p className="mb-5">
        <Trans>For example: Kindness, Creativity, Humour</Trans>
      </p>
      <Button
        variant="primary"
        className="px-4"
        onClick={handleStrengthModalOpen}
      >
        <Trans>Pick one</Trans>
      </Button>
    </>
  );

  const renderStep2Content = () => (
    <div
      className="d-flex flex-column w-100 gap-4 mt-3"
      style={{maxWidth: 640}}
    >
      <Callout>
        <Trans>
          Enrich the strength you picked with additional details. You can also
          add photos or more strengths you saw.
        </Trans>
      </Callout>
      <MediaUpload>
        <MomentForm
          communityId={community._id}
          className="mb-5"
          existingStrengths={selectedStrength && [selectedStrength?.slug]}
          onSave={handleMomentCreated}
        />
      </MediaUpload>
    </div>
  );

  if (!community) {
    return null;
  }

  return (
    <OnboardingFlowLayout>
      <CommunityAvatar
        avatarColor={colorFromId(community._id)}
        avatarName={community.name}
        avatarPath={community.avatar}
      />
      {activeStep === 1 && renderStep1Content()}
      {activeStep === 2 && renderStep2Content()}

      <StrengthModal
        hasSimpleStrengthsOnly
        isOpen={isStrengthModalOpen}
        selectedStrengthSlugs={selectedStrength ? [selectedStrength.slug] : []}
        onClose={handleStrengthModalClose}
        onStrengthSelected={handleStrengthSelected}
      />
    </OnboardingFlowLayout>
  );
}
