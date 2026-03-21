import {Alert, Button} from 'react-bootstrap';
import {useState} from 'react';
import api from '@client/ApiClient.js';
import {type AgeGroup, type LanguageCode} from '@client/ApiTypes.js';
import {Trans} from '@lingui/react/macro';
import {useUpdateGroupMutation} from '@client/ApiHooks.js';
import OnboardingModal from './OnboardingModal.js';
import {useCurrentUser} from '@/context/currentUserContext.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {track} from '@/helpers/analytics.js';

export default function OnboardingBanner() {
  const updateGroup = useUpdateGroupMutation();
  const {activeGroup} = useActiveGroup();
  const {currentUser, setCurrentUser} = useCurrentUser();
  const [showModal, setShowModal] = useState(true);

  if (!activeGroup || !currentUser || currentUser.introSlidesRead) {
    return null;
  }

  const onSaveGroup = async ({
    name,
    language,
    ageGroup,
  }: {
    name: string;
    language: LanguageCode;
    ageGroup: AgeGroup;
  }) => {
    await updateGroup.mutateAsync({
      pathParameters: {id: activeGroup.id},
      payload: {
        name,
        ageGroup,
        language,
      },
    });
  };

  const onSaveCookieConsent = async (consents: {vimeo: boolean}) => {
    const updatedUser = await api.updateMe({
      consents,
      hasSetConsents: true,
    });

    setCurrentUser({...currentUser, ...updatedUser});
  };

  const onFinish = async () => {
    const introSlidesRead = new Date().toJSON();
    await api.updateMe({introSlidesRead});
    setCurrentUser({
      ...currentUser,
      introSlidesRead,
    });
    setShowModal(false);
    track('Onboarding finished');
  };

  return (
    <>
      <OnboardingModal
        group={activeGroup}
        isOpen={showModal}
        cookieConsents={currentUser?.consents}
        onClose={() => {
          setShowModal(false);
          track('Onboarding closed');
        }}
        onSaveGroup={onSaveGroup}
        onSaveCookieConsent={onSaveCookieConsent}
        onFinish={onFinish}
      />

      {!showModal && (
        <Alert className="pb-2">
          <Alert.Heading>
            <Trans>Hey, nice to see you!</Trans>
          </Alert.Heading>
          <p>
            <Trans>
              You left the introduction early — no problem! You can always come
              back to the onboarding whenever you&#39;d like to explore more
              about how See the Good works. Glad to have you with us!
            </Trans>
          </p>
          <hr className="my-2" />
          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setShowModal(true);
                track('Onboarding reopened');
              }}
            >
              <Trans>Open</Trans>
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowModal(false);
                void api.updateMe({introSlidesRead: new Date().toJSON()});
                setCurrentUser({
                  ...currentUser,
                  introSlidesRead: new Date().toJSON(),
                });

                track('Onboarding dismissed');
              }}
            >
              <Trans>Dismiss</Trans>
            </Button>
          </div>
        </Alert>
      )}
    </>
  );
}
