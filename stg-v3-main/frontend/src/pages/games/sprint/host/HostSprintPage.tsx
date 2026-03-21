import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, useCallback} from 'react';
import Button from 'react-bootstrap/Button';
import {useParams} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {
  type GetHostSprintResponse,
  type PatchHostSprintEvent,
  type StrengthSlug,
} from '@client/ApiTypes';
import TopStrength from './TopStrength.js';
import {Loader} from '@/components/ui/Loader.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {useToasts} from '@/components/toasts/index.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';

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

export default function HostSprintPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {sprintId} = useParams();
  const [sprint, setSprint] = useState<GetHostSprintResponse>();
  const breakpoint = useBreakpoint();

  const onSprintPatch = useCallback(async (patch: PatchHostSprintEvent) => {
    setSprint((previous) => {
      if (!previous) return previous;

      if (
        new Date(patch.updatedAt).getTime() <
        new Date(previous.updatedAt).getTime()
      ) {
        return previous;
      }

      return {...previous, ...patch};
    });
  }, []);

  const joinSprintRoom = useCallback(() => {
    socket.emit(JOIN, `/sprints/${sprintId}/host`);
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
    socket.on(CONNECT, joinSprintRoom);
    return () => {
      socket.emit(LEAVE, `/sprints/${sprintId}/host`);
      socket.off('PatchHostSprintEvent', onSprintPatch);
      socket.off(CONNECT, joinSprintRoom);
    };
  }, [sprintId, joinSprintRoom, onSprintPatch]);

  useEffect(() => {
    void getSprint();
  }, [sprintId, getSprint]);

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

  const handleEndSprint = async () => {
    try {
      if (!sprint) {
        return;
      }

      await api.updateSprint(
        {id: sprint.id},
        {
          isEnded: true,
        },
      );

      setSprint({...sprint, isEnded: true});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while ending sprint`),
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

  if (!sprint.isEnded) {
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

  const topStrengths = calculateTopStrengths(sprint);

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
                {topStrengths[0] ? (
                  <TopStrength topStrength={topStrengths[0]} width="50%" />
                ) : null}
              </div>
              <div className="w-100 d-flex flex-column align-items-center">
                {topStrengths[1] ? (
                  <TopStrength topStrength={topStrengths[1]} width="50%" />
                ) : null}
              </div>
              <div className="w-100 d-flex flex-column align-items-center">
                {topStrengths[2] ? (
                  <TopStrength topStrength={topStrengths[2]} width="50%" />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex w-100 h-100 justify-content-between align-items-end gap-5 px-3">
            <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
              {topStrengths[1] ? (
                <TopStrength topStrength={topStrengths[1]} width="90%" />
              ) : null}
            </div>
            <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
              {topStrengths[0] ? (
                <TopStrength topStrength={topStrengths[0]} width="100%" />
              ) : null}
            </div>
            <div className="w-100 d-flex flex-column align-items-center overflow-hidden">
              {topStrengths[2] ? (
                <TopStrength topStrength={topStrengths[2]} width="90%" />
              ) : null}
            </div>
          </div>
        )}
        <div className="d-flex w-100 h-50" />
      </div>
    </div>
  );
}
