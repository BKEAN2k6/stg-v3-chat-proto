import {useState, useEffect, useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import {PersonFill, X} from 'react-bootstrap-icons';
import {useLingui} from '@lingui/react';
import {Trans, Plural, msg} from '@lingui/macro';
import TopStrength from './TopStrength';
import api from '@/api/ApiClient';
import {Loader} from '@/components/ui/Loader';
import {socket} from '@/socket';
import {
  type GetHostSprintResponse,
  type PatchHostSprintEvent,
  type StrengthSlug,
} from '@/api/ApiTypes';
import {CenterAligned} from '@/components/ui/CenterAligned';
import {useToasts} from '@/components/toasts';
import useBreakpoint from '@/hooks/useBreakpoint';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker';
import {confirm} from '@/components/ui/confirm';

const calculateTopStrengths = (sprint: GetHostSprintResponse) => {
  const strengthCount: Partial<Record<StrengthSlug, number>> = {};

  for (const sharedStrength of sprint.sharedStrengths) {
    const {strength} = sharedStrength;
    if (strengthCount[strength]) {
      strengthCount[strength]++;
    } else {
      strengthCount[strength] = 1;
    }
  }

  const topStrengths = Object.keys(strengthCount)
    .map((strength) => ({
      strength,
      count: strengthCount[strength as StrengthSlug] ?? 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return topStrengths;
};

// eslint-disable-next-line complexity
export default function HostSprintPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {sprintId} = useParams();
  const [sprint, setSprint] = useState<GetHostSprintResponse>();
  const breakpoint = useBreakpoint();

  const onSprintPatch = useCallback(async (patch: PatchHostSprintEvent) => {
    setSprint((previous) => {
      if (!previous) {
        return;
      }

      return {...previous, ...patch};
    });
  }, []);

  const joinSprintRoom = useCallback(() => {
    socket.emit('join', `/sprints/${sprintId}/host`);
  }, [sprintId]);

  const getSprint = useCallback(async () => {
    if (!sprintId) {
      return;
    }

    try {
      const sprint = await api.getHostSprint({id: sprintId});
      setSprint(sprint);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while loading the sprint`),
      });
    }
  }, [sprintId, toasts, _]);

  useEffect(() => {
    joinSprintRoom();
    socket.on('PatchHostSprintEvent', onSprintPatch);
    socket.on('connect', joinSprintRoom);
    return () => {
      socket.emit('leave', `/sprints/${sprintId}/host`);
      socket.off('PatchHostSprintEvent', onSprintPatch);
      socket.off('connect', joinSprintRoom);
    };
  }, [sprintId, joinSprintRoom, onSprintPatch]);

  useEffect(() => {
    void getSprint();
  }, [sprintId, sprint?.isStarted, getSprint]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void getSprint();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [sprintId, getSprint]);

  const handleStartSprint = async () => {
    try {
      if (!sprint) {
        return;
      }

      await api.updateSprint(
        {id: sprint._id},
        {
          isStarted: true,
          isEnded: false,
        },
      );

      setSprint({...sprint, isStarted: true, isEnded: false});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while starting sprint`),
      });
    }
  };

  const handleEndSprint = async () => {
    try {
      if (!sprint) {
        return;
      }

      await api.updateSprint(
        {id: sprint._id},
        {
          isStarted: true,
          isEnded: true,
        },
      );

      setSprint({...sprint, isStarted: true, isEnded: true});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while ending sprint`),
      });
    }
  };

  const handleRemovePlayer = async (playerId: string) => {
    try {
      if (!sprint) {
        return;
      }

      const confirmed = await confirm({
        title: _(msg`Remove player`),
        text: _(msg`Are you sure you want to remove the player.`),
        cancel: _(msg`No, cancel`),
        confirm: _(msg`Yes, remove`),
      });

      if (!confirmed) {
        return;
      }

      await api.removeSprintPlayer({id: sprint._id, playerId});
      setSprint((previousSprint) => {
        if (!previousSprint) {
          return;
        }

        const updatedPlayers = previousSprint.players.filter(
          (player) => player._id !== playerId,
        );
        return {...previousSprint, players: updatedPlayers};
      });
      toasts.success({
        header: _(msg`Player removed`),
        body: _(msg`The player has been successfully removed from the sprint.`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Failed to remove player from the sprint.`),
      });
    }
  };

  if (!sprint) {
    return (
      <CenterAligned>
        <Loader />
      </CenterAligned>
    );
  }

  const codeLink = `${window.location.origin}/games/sprints/join?code=${sprint.code}`;

  let screen = 'start';
  if (sprint.isStarted && !sprint.isEnded) screen = 'run';
  if (sprint.isStarted && sprint.isEnded) screen = 'result';

  let topStrengths: Array<{strength: string; count: number}> = [];
  if (screen === 'result') topStrengths = calculateTopStrengths(sprint);

  switch (screen) {
    case 'start': {
      return (
        <div
          className="w-100"
          style={{
            backgroundColor: 'var(--primary-darker-1)',
            minHeight: '100%',
          }}
        >
          <div
            className="d-flex flex-column w-100 h-100 mx-auto"
            style={{maxWidth: 1200}}
          >
            <div className="d-flex w-100 justify-content-center p-5">
              <span className="text-white fs-6 fs-lg-4">
                <Trans>Strength sprint</Trans>
              </span>
            </div>
            <div className="d-flex flex-column flex-lg-row">
              <div
                style={{backgroundColor: '#fff'}}
                className="w-75 w-lg-100 mx-auto me-lg-4 ms-lg-5 my-3 mb-5 p-5 d-flex flex-column justify-content-center align-items-center rounded"
              >
                <div className="d-flex flex-column align-items-center h-100">
                  <span className="h2 text-center">
                    <Trans>Scan QR</Trans>
                  </span>
                  <QRCode value={codeLink} />
                  <span className="h2 mt-3 text-center">
                    <Trans>or enter code at</Trans>{' '}
                    <span className="text-primary fw-bold fs-5">
                      {/* NOTE: use shortlink stg.fun when available */}
                      {window.location.host}/games/sprints/join
                    </span>
                  </span>
                  <span className="display-1 fw-bold mt-3">{sprint.code}</span>
                </div>
                <div className="mt-3">
                  <GlobalLanguagePicker />
                </div>
              </div>
              <div
                style={{backgroundColor: '#fff'}}
                className="w-75 w-lg-100 mx-auto ms-lg-4 me-lg-5 my-3 mb-5 p-5 d-flex flex-column justify-content-between align-items-center rounded"
              >
                <div className="d-flex flex-column align-items-center">
                  <span className="display-5 fw-bold mt-3">
                    {sprint.players.length}
                  </span>
                  <span className="h4">
                    <PersonFill />{' '}
                    <Plural
                      value={sprint.players.length}
                      one="player"
                      other="players"
                    />
                  </span>
                  {sprint.players.length === 0 && (
                    <span className="h2 mt-5 text-center">
                      <Trans>Waiting for players to join...</Trans>
                    </span>
                  )}
                  <div className="d-flex flex-wrap align-items-center mt-3 mb-5">
                    {sprint.players.map((player) => (
                      <div
                        key={player._id}
                        className="rounded px-3 py-2 m-2 cursor-pointer"
                        style={{backgroundColor: player.color}}
                        role="button"
                        onClick={async () => handleRemovePlayer(player._id)}
                      >
                        <span className="fs-4 fw-bolder">
                          {player.nickname} <X size={24} />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Button
                    key="start-button"
                    style={{width: 120, backgroundColor: '#fff'}}
                    className="text-primary fw-semibold"
                    disabled={sprint.players.length < 2}
                    onClick={handleStartSprint}
                  >
                    <Trans>Start sprint</Trans>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'run': {
      return (
        <div
          className="w-100 h-100"
          style={{
            backgroundColor: 'var(--primary-darker-1)',
            backgroundImage: 'url(/images/backgrounds/balloons.png)',
          }}
        >
          <div className="d-flex flex-column w-100 h-100 mx-auto">
            <div
              className="w-100 h-100"
              style={{
                padding: ['xs', 'sm', 'md'].includes(breakpoint ?? '')
                  ? '2.5rem'
                  : '4rem 5rem',
              }}
            >
              <div className="p-5 bg-white h-100 rounded">
                <div className="d-flex h-100 flex-column justify-content-center align-items-center gap-5">
                  <h1 className="text-center">
                    {sprint.isCompleted ? (
                      <Trans>Everyone has completed!</Trans>
                    ) : (
                      <Trans>Time to send strengths!</Trans>
                    )}
                  </h1>
                  <div>
                    <h2 className="display-1 fw-bold text-center text-primary">
                      {sprint.sharedStrengths.length} /{' '}
                      {sprint.expectedStrengthCount}
                    </h2>
                    <h3 className="fw-bold text-center">
                      <Trans>Strengths sent</Trans>
                    </h3>
                  </div>
                  <div>
                    <Button
                      key="end-button"
                      style={{width: 120}}
                      onClick={handleEndSprint}
                    >
                      <Trans>End Sprint</Trans>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    case 'result': {
      return (
        <div className="w-100" style={{minHeight: '100%'}}>
          <div
            className="d-flex flex-column w-100 h-100 mx-auto"
            style={{maxWidth: 1200}}
          >
            <div className="d-flex w-100 justify-content-center p-5">
              <h2 className="text-center">
                <Trans>Top strengths from session...</Trans>
              </h2>
            </div>
            {['xs', 'sm', 'md'].includes(breakpoint ?? '') ? (
              <div className="d-flex w-100 h-100 justify-content-between align-items-end gap-5">
                <div className="w-100 d-flex flex-column align-items-center gap-5 mb-5">
                  <div className="w-100 d-flex flex-column align-items-center">
                    {topStrengths[0] && (
                      <TopStrength topStrength={topStrengths[0]} width="50%" />
                    )}
                  </div>
                  <div className="w-100 d-flex flex-column align-items-center">
                    {topStrengths[1] && (
                      <TopStrength topStrength={topStrengths[1]} width="50%" />
                    )}
                  </div>
                  <div className="w-100 d-flex flex-column align-items-center">
                    {topStrengths[2] && (
                      <TopStrength topStrength={topStrengths[2]} width="50%" />
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="d-flex w-100 h-100 justify-content-between align-items-end gap-5 px-3">
                <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
                  {topStrengths[1] && (
                    <TopStrength topStrength={topStrengths[1]} width="90%" />
                  )}
                </div>
                <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
                  {topStrengths[0] && (
                    <TopStrength topStrength={topStrengths[0]} width="100%" />
                  )}
                </div>
                <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
                  {topStrengths[2] && (
                    <TopStrength topStrength={topStrengths[2]} width="90%" />
                  )}
                </div>
              </div>
            )}
            <div className="d-flex w-100 h-50" />
          </div>
        </div>
      );
    }

    default: {
      return null;
    }
  }
}
