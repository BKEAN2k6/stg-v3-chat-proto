import {msg} from '@lingui/core/macro';
import {useState} from 'react';
import {useLingui} from '@lingui/react';
import {type UserInfo, type ChallengeTheme} from '@client/ApiTypes';
import api from '@client/ApiClient';
import ChallengeThemeDefault from './ChallengeThemeDefault.js';
import ChallengeThemeHolidayCalendar from './ChallengeThemeHolidayCalendar.js';
import {useToasts} from '@/components/toasts/index.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

type Properties = {
  readonly participants: UserInfo[];
  readonly content: string;
  readonly theme: ChallengeTheme;
  readonly challengeId: string;
  readonly createdAt: string;
};

export default function ChallengeContent(properties: Properties) {
  const {_} = useLingui();
  const {participants, content, createdAt, challengeId, theme} = properties;
  const [isChallengeBeingAccpeted, setIsChallengeBeingAccpeted] =
    useState(false);
  const [participations, setParticipations] =
    useState<UserInfo[]>(participants);
  const {currentUser} = useCurrentUser();
  const toasts = useToasts();

  const handleAcceptChallenge = async () => {
    if (!currentUser) {
      return;
    }

    try {
      setIsChallengeBeingAccpeted(true);
      setParticipations((currentParticipations) => [
        ...currentParticipations,
        currentUser,
      ]);

      await api.createChallengeParticipation({
        id: challengeId,
      });
    } catch {
      setParticipations((currentParticipations) =>
        currentParticipations.filter(
          (acceptance) => acceptance.id !== currentUser.id,
        ),
      );
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while accepting the challenge`),
      });
    }
  };

  if (!currentUser) {
    return null;
  }

  const themes: Record<ChallengeTheme, React.JSX.Element> = {
    default: (
      <ChallengeThemeDefault
        participants={participations}
        content={content}
        handleAcceptChallenge={handleAcceptChallenge}
        isExploding={isChallengeBeingAccpeted}
        onExplosionComplete={() => {
          setIsChallengeBeingAccpeted(false);
        }}
      />
    ),
    'holiday-calendar': (
      <ChallengeThemeHolidayCalendar
        participants={participations}
        content={content}
        handleAcceptChallenge={handleAcceptChallenge}
        day={new Date(createdAt).getDate()}
      />
    ),
  };

  return <div className="gap-2">{themes[theme]}</div>;
}
