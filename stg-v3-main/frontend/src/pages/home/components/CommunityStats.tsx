import {msg} from '@lingui/core/macro';
import {Plural, Trans} from '@lingui/react/macro';
import {useLingui} from '@lingui/react';
import {useState, useEffect} from 'react';
import {Button, Card} from 'react-bootstrap';
import {
  type UpdateCommunityStatsEvent,
  type GetCommunityStatsResponse,
  type LanguageCode,
} from '@client/ApiTypes';
import api from '@client/ApiClient';
import TopContributorsModal from './TopContributorsModal.js';
import TopStrengthsModal from './TopStrengthsModal.js';
import {useToasts} from '@/components/toasts/index.js';
import Avatar from '@/components/ui/Avatar.js';
import {colorFromId, formatName, formatShortName} from '@/helpers/avatars.js';
import {strengthTranslationMap} from '@/helpers/strengths.js';
import StrengthAvatar from '@/components/ui/StrengthAvatar.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';

type Properties = {
  readonly communityId?: string;
};

export default function CommunityStats(properties: Properties) {
  const {_, i18n} = useLingui();
  const toasts = useToasts();
  const {communityId} = properties;

  const [communityStats, setCommunityStats] =
    useState<GetCommunityStatsResponse>();
  const [isTopStrengthsModalOpen, setIsTopStrengthsModalOpen] = useState(false);
  const [isTopContributorsModalOpen, setIsTopContributorsModalOpen] =
    useState(false);

  const onStatsUpdate = (stats: UpdateCommunityStatsEvent) => {
    setCommunityStats(stats);
  };

  const joinStatsRoom = () => {
    socket.emit(JOIN, `/communities/${communityId}/stats`);
  };

  useEffect(() => {
    if (!communityId) return;
    joinStatsRoom();
    socket.on('UpdateCommunityStatsEvent', onStatsUpdate);
    socket.on(CONNECT, joinStatsRoom);
    return () => {
      socket.emit(LEAVE, `/communities/${communityId}/stats`);
      socket.off('UpdateCommunityStatsEvent', onStatsUpdate);
      socket.off(CONNECT, joinStatsRoom);
    };
  }, [communityId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const fetchStats = async () => {
      if (!communityId) return;
      try {
        const stats = await api.getCommunityStats({id: communityId});
        setCommunityStats(stats);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while fetching community stats`),
        });
      }
    };

    void fetchStats();
  }, [communityId, toasts, _]);

  const handleTopStrengthsModalOpen = () => {
    setIsTopStrengthsModalOpen(true);
  };

  const handleTopStrengthsModalClose = () => {
    setIsTopStrengthsModalOpen(false);
  };

  const handleTopContributorsModalOpen = () => {
    setIsTopContributorsModalOpen(true);
  };

  const handleTopContributorsModalClose = () => {
    setIsTopContributorsModalOpen(false);
  };

  const totalStrengths =
    communityStats?.topStrengths.reduce(
      (total, strength) => total + strength.count,
      0,
    ) ?? 0;

  const totalContributors =
    communityStats?.leaderboard.filter((user) => user.count > 0).length ?? -1;

  return (
    <>
      <div className="d-flex flex-column gap-3">
        {totalStrengths > 0 && (
          <Card className="bg-body-tertiary">
            <Card.Header className="fw-bold">
              <span className="me-1">{totalStrengths}</span>
              <Plural
                value={totalStrengths}
                one="Strength this week"
                other="Strengths this week"
              />
            </Card.Header>
            <Card.Body>
              <ul className="m-0 mb-2 p-0 list-style-none">
                {communityStats?.topStrengths
                  .filter((strength) => strength.count > 0)
                  .splice(0, 5)
                  .map((topStrength) => (
                    <li
                      key={topStrength.strength}
                      className="d-flex align-items-center gap-2 mb-2"
                    >
                      <StrengthAvatar strength={topStrength.strength} />
                      {
                        strengthTranslationMap[topStrength.strength][
                          i18n.locale as LanguageCode
                        ]
                      }{' '}
                      • {topStrength.count}
                    </li>
                  ))}
              </ul>
              <Button
                variant="link"
                className="ps-0 pb-0 text-decoration-none fw-semibold"
                onClick={handleTopStrengthsModalOpen}
              >
                <Trans>View all</Trans>
              </Button>
            </Card.Body>
          </Card>
        )}
        {totalContributors > 0 && (
          <Card className="bg-body-tertiary">
            <Card.Header className="fw-bold">
              <span className="me-1">{totalContributors}</span>
              <Plural
                value={totalContributors}
                one="Contributor this week"
                other="Contributors this week"
              />
            </Card.Header>
            <Card.Body>
              <ul className="m-0 mb-2 p-0 list-style-none">
                {communityStats?.leaderboard
                  .filter((user) => user.count > 0)
                  .splice(0, 3)
                  .map((user) => (
                    <li
                      key={user.id}
                      className="d-flex align-items-center gap-2 mb-2 overflow-hidden"
                      title={formatName(user)}
                    >
                      <Avatar
                        size={32}
                        name={formatName(user)}
                        path={user.avatar}
                        color={colorFromId(user.id)}
                      />
                      {formatShortName(user)} • {user.count}
                    </li>
                  ))}
              </ul>
              <Button
                variant="link"
                className="ps-0 pb-0 text-decoration-none fw-semibold"
                onClick={handleTopContributorsModalOpen}
              >
                <Trans>View all</Trans>
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>
      <TopStrengthsModal
        strengthList={communityStats?.topStrengths ?? []}
        totalStrengths={totalStrengths}
        isOpen={isTopStrengthsModalOpen}
        onClose={handleTopStrengthsModalClose}
      />
      <TopContributorsModal
        contributorList={communityStats?.leaderboard ?? []}
        totalContributors={totalContributors}
        isOpen={isTopContributorsModalOpen}
        onClose={handleTopContributorsModalClose}
      />
    </>
  );
}
