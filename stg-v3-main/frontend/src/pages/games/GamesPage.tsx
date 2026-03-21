import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import PageTitle from '@/components/ui/PageTitle.js';
import CreateSprintPage from '@/pages/games/sprint/host/CreateSprintPage.js';
import CreateMemoryGamePage from '@/pages/games/memory-game/host/CreateMemoryGamePage.js';

export default function GamesPage() {
  const {_} = useLingui();

  return (
    <div className="d-flex flex-column gap-4">
      <PageTitle title={_(msg`Games`)} />
      <CreateSprintPage />
      <hr />
      <CreateMemoryGamePage />
    </div>
  );
}
