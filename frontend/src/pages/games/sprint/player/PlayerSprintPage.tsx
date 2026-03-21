import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import {useLingui} from '@lingui/react';
import clsx from 'clsx';
import {ChevronLeft, ChevronRight} from 'react-bootstrap-icons';
import {Button} from 'react-bootstrap';
import api, {ApiError} from '@client/ApiClient';
import {
  type StrengthSlug,
  type GetPlayerSprintResponse,
  type PatchPlayerSprintEvent,
} from '@client/ApiTypes';
import PlayerResults from './PlayerResults.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {Loader} from '@/components/ui/Loader.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {useToasts} from '@/components/toasts/index.js';
import {
  type StrengthListItem,
  slugToListItem,
  strengthSlugs,
} from '@/helpers/strengths.js';
import ListItem from '@/components/ui/ListItem.js';
import Logo from '@/components/ui/Logo.js';
import useBreakpoint from '@/hooks/useBreakpoint.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

export default function PlayerSprintPage() {
  const {_, i18n} = useLingui();
  const toasts = useToasts();
  const navigate = useNavigate();
  const {sprintId} = useParams();
  const [sprint, setSprint] = useState<GetPlayerSprintResponse>();
  const [selectedPlayerIndex, setSelectedPlayerIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSavingStrength, setIsSavingStrength] = useState(false);

  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === 'xs';

  const strengths: StrengthListItem[] = strengthSlugs
    .map((slug) => slugToListItem(slug, i18n.locale))
    .sort((a, b) => a.title.localeCompare(b.title));

  const getStrengthsSharesLeft = () => {
    if (!sprint) return -1;
    return sprint.room.filter((m) => !m.strength).length;
  };

  const getSelectedPlayer = () => {
    if (sprint?.room[selectedPlayerIndex]) {
      return sprint?.room[selectedPlayerIndex];
    }

    return {
      color: '',
      nickname: '',
      avatar: '',
    };
  };

  const onSprintPatch = useCallback(async (patch: PatchPlayerSprintEvent) => {
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
    socket.emit(JOIN, `/sprints/${sprintId}/player`);
  }, [sprintId]);

  useEffect(() => {
    joinSprintRoom();
    socket.on('PatchPlayerSprintEvent', onSprintPatch);
    socket.on(CONNECT, joinSprintRoom);
    return () => {
      socket.emit(LEAVE, `/sprints/${sprintId}/player`);
      socket.off('PatchPlayerSprintEvent', onSprintPatch);
      socket.off(CONNECT, joinSprintRoom);
    };
  }, [joinSprintRoom, onSprintPatch, sprintId]);

  const fetchSprintData = useCallback(async () => {
    try {
      if (!sprintId) {
        return;
      }

      const fetchedSprint = await api.getPlayerSprint({id: sprintId});
      setSprint(fetchedSprint);
      if (
        fetchedSprint.room.length > 0 &&
        fetchedSprint.room.filter((m) => !m.strength).length === 0
      ) {
        setIsCompleted(true);
      }
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        navigate('/games/join');
        return;
      }

      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while fetching the sprint`),
      });
    }
  }, [sprintId, toasts, _, navigate]);

  useEffect(() => {
    void fetchSprintData();
  }, [sprint?.isEnded, fetchSprintData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchSprintData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStrengthChange = async (strength: StrengthSlug, to: string) => {
    if (isSavingStrength) {
      return;
    }

    setIsSavingStrength(true);
    try {
      if (!sprint) {
        return;
      }

      const previousStrengthSharesLeft = getStrengthsSharesLeft();
      await api.createSprintStrength({id: sprint.id}, {strength, to});

      sprint.room[selectedPlayerIndex].strength = strength;

      if (sprint.room.some((m) => !m.strength)) {
        let nextIndex = sprint.room.findIndex(
          (m, index) => !m.strength && index > selectedPlayerIndex,
        );

        if (nextIndex === -1) {
          nextIndex = sprint.room.findIndex((m) => !m.strength);
        }

        if (nextIndex !== -1) {
          setSelectedPlayerIndex(nextIndex);
        } else if (selectedPlayerIndex !== sprint.room.length - 1) {
          setSelectedPlayerIndex(selectedPlayerIndex + 1);
        }
      } else if (previousStrengthSharesLeft > 0) {
        setIsCompleted(true);
      }

      setSprint({...sprint});
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the strength`),
      });
    } finally {
      setTimeout(() => {
        setIsSavingStrength(false);
      }, 1000);
    }
  };

  if (sprint && !sprint.players.includes(sprint.player.id)) {
    navigate('/games/join');
    return null;
  }

  if (!sprint) {
    return (
      <CenterAligned>
        <h1>
          <Trans>Loading...</Trans>
        </h1>
      </CenterAligned>
    );
  }

  const hasPreviousPlayer = selectedPlayerIndex > 0;

  const handleGoToPreviousPlayer = () => {
    if (selectedPlayerIndex > 0) {
      setSelectedPlayerIndex((index) => index - 1);
    }
  };

  const hasNextPlayer = selectedPlayerIndex < sprint.room.length - 1;

  const handleGoToNextPlayer = () => {
    if (hasNextPlayer) {
      setSelectedPlayerIndex((index) => index + 1);
    }
  };

  if (!sprint.isEnded) {
    if (isCompleted) {
      return (
        <CenterAligned>
          <div className="d-flex flex-column gap-2 align-items-center py-5">
            <Logo className="mb-5" color="#fdd662" height={64} width={64} />
            <h3>
              <Trans>Good job!</Trans>
            </h3>
            <h5>
              <Trans>Waiting for results...</Trans>
            </h5>
            <div className="mt-5">
              <Loader />
            </div>
          </div>
        </CenterAligned>
      );
    }

    return (
      <div className="d-flex flex-column safe-h-screen">
        <div className="text-center">
          {selectedPlayerIndex < sprint.room.length && (
            <>
              <span className="mt-3 d-block text-muted text-center">
                {selectedPlayerIndex + 1} <Trans>of</Trans> {sprint.room.length}
              </span>
              <h3 className="mt-2 px-2 text-center">
                <Trans>What have you seen in?</Trans>
              </h3>
            </>
          )}
        </div>
        <div className="p-2">
          <div className="mt-4">
            <div
              className="rounded-circle mx-auto"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: getSelectedPlayer().color,
                margin: '0.5rem',
                border: 'none',
              }}
            >
              <SimpleLottiePlayer
                autoplay
                loop
                src={`/animations/avatars/${getSelectedPlayer().avatar}.json`}
              />
            </div>
            <h2 className="text-center mt-4">{getSelectedPlayer().nickname}</h2>
          </div>
        </div>
        <div
          className="z-2 shadow-sm d-flex align-items-center justify-content-center"
          style={{clipPath: 'inset(0px -1rem -1rem -1rem)'}}
        >
          <div
            className="d-flex justify-content-between align-items-center w-100 px-4 pb-4"
            style={{maxWidth: 600}}
          >
            <Button
              className="rounded-circle p-0 me-2"
              variant="outline-primary"
              style={{width: 40, minWidth: 40, height: 40}}
              disabled={!hasPreviousPlayer}
              onClick={handleGoToPreviousPlayer}
            >
              <ChevronLeft />
            </Button>
            <div className="d-flex gap-2">
              {sprint.room.map((player, index) => (
                <div
                  key={`${player.id}-toggle`}
                  className={clsx(
                    'bg-primary rounded-circle m-0 p-0',
                    'border border-tertiary border-3',
                    index > selectedPlayerIndex && 'bg-body-tertiary',
                    index === selectedPlayerIndex && 'border-primary',
                  )}
                  style={{
                    width: isSmall ? 10 : 20,
                    height: isSmall ? 10 : 20,
                  }}
                  aria-label={`Select item ${index}`}
                  onClick={() => {
                    setSelectedPlayerIndex(index);
                  }}
                />
              ))}
            </div>
            <Button
              className="rounded-circle p-0 ms-2"
              variant="outline-primary"
              style={{width: 40, minWidth: 40, height: 40}}
              disabled={!hasNextPlayer}
              onClick={handleGoToNextPlayer}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
        <div className="d-flex flex-grow-1 overflow-hidden h-100 bg-body-tertiary z-1">
          <Carousel
            variant="dark"
            className="w-100 overflow-y-auto"
            interval={null}
            activeIndex={selectedPlayerIndex}
            indicators={false}
            controls={false}
            wrap={false}
            keyboard={false}
            touch={false}
            onSelect={(index) => {
              setSelectedPlayerIndex(index);
            }}
          >
            {sprint.room.map((player) => {
              return (
                <Carousel.Item key={player.id}>
                  <div
                    className="mx-auto d-flex py-3 px-2 px-sm-4 flex-column gap-2 w-100"
                    style={{
                      overflowY: 'auto',
                      maxWidth: 600,
                    }}
                  >
                    <p className="text-center fs-5 mb-2 text-muted">
                      <Trans>Select one strength</Trans>
                    </p>
                    {strengths.map((strength) => (
                      <ListItem
                        key={strength.slug}
                        className={clsx(
                          player.strength === strength.slug
                            ? 'bg-primary text-white'
                            : 'bg-white',
                        )}
                        imageUrl={strength.imageUrl}
                        imageAlt={strength.title}
                        imageBackgroundColor={strength.color}
                        title={strength.title}
                        description={strength.description}
                        onClick={() => {
                          void handleStrengthChange(strength.slug, player.id);
                        }}
                      />
                    ))}
                  </div>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
      </div>
    );
  }

  return <PlayerResults sprint={sprint} />;
}
