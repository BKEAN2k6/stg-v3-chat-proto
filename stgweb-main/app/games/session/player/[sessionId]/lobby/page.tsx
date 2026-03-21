import {LobbyPage} from './LobbyPage';

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionPlayerSessionIdLobbyPage(
  props: Props,
) {
  const {sessionId} = props.params;

  return <LobbyPage sessionId={sessionId} />;
}
