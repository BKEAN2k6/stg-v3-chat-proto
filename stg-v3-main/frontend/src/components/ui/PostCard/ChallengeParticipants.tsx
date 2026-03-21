import {useState} from 'react';
import {useLingui} from '@lingui/react';
import {type UserInfo, type LanguageCode} from '@client/ApiTypes';
import ChallengeParticipantModal from './ChallengeParticipantModal.js';
import Avatar from '@/components/ui/Avatar.js';
import {colorFromId, formatName} from '@/helpers/avatars.js';
import {languages} from '@/i18n.js';

type Properties = {
  readonly participants: UserInfo[];
};

export default function ChallengeParticipants(properties: Properties) {
  const {participants} = properties;
  const {i18n} = useLingui();
  let locale = i18n.locale as LanguageCode;
  if (!Object.keys(languages).includes(locale)) {
    locale = 'en';
  }

  const [isChallengeParticipantModalOpen, setIsChallengeParticipantModalOpen] =
    useState(false);

  const showChallengeParticipantModal = () => {
    setIsChallengeParticipantModalOpen(true);
  };

  const hideChallengeParticipantModal = () => {
    setIsChallengeParticipantModalOpen(false);
  };

  return (
    <div className="d-flex flex-wrap align-items-center">
      {participants.slice(0, 3).map((acceptance, index) => (
        <Avatar
          key={acceptance.id}
          size={32}
          name={formatName(acceptance)}
          color={colorFromId(acceptance.id)}
          path={acceptance.avatar}
          marginLeft={index > 0 ? -12 : 0}
          onClick={showChallengeParticipantModal}
        />
      ))}
      {participants.length > 3 && (
        <div
          className="rounded-circle text-primary text-center bg-body-tertiary"
          style={{
            cursor: 'pointer',
            width: 32,
            height: 32,
            marginLeft: -12,
            minWidth: 32,
            minHeight: 32,
            lineHeight: `${32 + 4}px`,
            fontSize: 32 / 3,
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'center',
          }}
          onClick={showChallengeParticipantModal}
        >
          {`+${participants.length - 3} `}
        </div>
      )}
      <ChallengeParticipantModal
        isOpen={isChallengeParticipantModalOpen}
        users={participants}
        onClose={hideChallengeParticipantModal}
      />
    </div>
  );
}
