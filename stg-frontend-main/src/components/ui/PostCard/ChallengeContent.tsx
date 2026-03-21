import {useState} from 'react';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import ChallengeThemeDefault from './ChallengeThemeDefault';
import ChallengeThemeHolidayCalendar from './ChallengeThemeHolidayCalendar';
import {type UserInfo, type ChallengeTheme} from '@/api/ApiTypes';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {useCurrentUser} from '@/context/currentUserContext';

type Props = {
  readonly participants: UserInfo[];
  readonly content: string;
  readonly theme: ChallengeTheme;
  readonly challengeId: string;
  readonly createdAt: string;
};

export default function ChallengeContent(props: Props) {
  const {_} = useLingui();
  const {participants, content, createdAt, challengeId, theme} = props;
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
          (acceptance) => acceptance._id !== currentUser._id,
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

  const themes: Record<ChallengeTheme, JSX.Element> = {
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
