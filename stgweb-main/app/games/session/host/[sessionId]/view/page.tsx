import {fetchStrengthSessionStrengths, sp} from '../../../_utils';
import {ViewPage} from './ViewPage';
import {PATHS} from '@/constants.mjs';
import {serverDataQueryWrapper} from '@/lib/server-only-utils';

// @TODO error if session not started

const getData = async (sessionId: string) => {
  const PATH = sp(PATHS.strengthSessionActiveView, sessionId);
  return serverDataQueryWrapper(PATH, async (directus) =>
    fetchStrengthSessionStrengths(sessionId, directus),
  );
};

type Props = {
  params: {
    sessionId: string;
  };
};

export default async function GamesSessionHostSessionIdViewPage(props: Props) {
  const {sessionId} = props.params;
  const sessionStrengths = await getData(sessionId);

  return <ViewPage sessionId={sessionId} sessionStrengths={sessionStrengths} />;
}
