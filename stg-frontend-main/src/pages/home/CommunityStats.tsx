import {Plural, Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import TopContributorsModal from './TopContributorsModal';
import TopStrengthsModal from './TopStrengthsModal';
import {useToasts} from '@/components/toasts';
import Avatar from '@/components/ui/Avatar';
import {colorFromId, formatName, formatShortName} from '@/helpers/avatars';
import {strengthTranslationMap} from '@/helpers/strengths';
import {
  type UpdateCommunityStatsEvent,
  type GetCommunityStatsResponse,
} from '@/api/ApiTypes';
import {type LanguageCode} from '@/i18n';
import StrengthAvatar from '@/components/ui/StrengthAvatar';
import api from '@/api/ApiClient';
import {socket} from '@/socket';

type Props = {
  readonly communityId?: string;
};

export default function CommunityStats(props: Props) {
  const {_, i18n} = useLingui();
  const toasts = useToasts();
  const {communityId} = props;

  const [communityStats, setCommunityStats] =
    useState<GetCommunityStatsResponse>();
  const [isTopStrengthsModalOpen, setIsTopStrengthsModalOpen] = useState(false);
  const [isTopContributorsModalOpen, setIsTopContributorsModalOpen] =
    useState(false);

  const onStatsUpdate = (stats: UpdateCommunityStatsEvent) => {
    setCommunityStats(stats);
  };

  const joinStatsRoom = () => {
    socket.emit('join', `/communities/${communityId}/stats`);
  };

  useEffect(() => {
    if (!communityId) return;
    joinStatsRoom();
    socket.on('UpdateCommunityStatsEvent', onStatsUpdate);
    socket.on('connect', joinStatsRoom);
    return () => {
      socket.emit('leave', `/communities/${communityId}/stats`);
      socket.off('UpdateCommunityStatsEvent', onStatsUpdate);
      socket.off('connect', joinStatsRoom);
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
          <div className="p-2 bg-body-tertiary rounded border w-100 overflow-y-auto">
            <div>
              <div className="d-flex flex-row gap-2">
                <h4>{totalStrengths}</h4>
                <span>
                  <Plural
                    value={totalStrengths}
                    one="Strength this week"
                    other="Strengths this week"
                  />
                </span>
              </div>
            </div>
            <hr className="my-0" />
            <div className="my-2">
              <Trans>Top strengths</Trans>
            </div>
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
              className="ps-0 text-decoration-none fw-semibold"
              onClick={handleTopStrengthsModalOpen}
            >
              <Trans>View all</Trans>
            </Button>
          </div>
        )}
        {totalContributors > 0 && (
          <div className="p-2 bg-body-tertiary rounded border w-100 overflow-y-auto">
            <div>
              <div className="d-flex flex-row gap-2">
                <h4>{totalContributors}</h4>
                <span>
                  <Plural
                    value={totalContributors}
                    one="Contributor this week"
                    other="Contributors this week"
                  />
                </span>
              </div>
            </div>
            <hr className="my-0" />
            <div className="my-2">
              <Trans>Top contributors</Trans>
            </div>
            <ul className="m-0 mb-2 p-0 list-style-none">
              {communityStats?.leaderboard
                .filter((user) => user.count > 0)
                .splice(0, 3)
                .map((user) => (
                  <li
                    key={user._id}
                    className="d-flex align-items-center gap-2 mb-2 overflow-hidden"
                    title={formatName(user)}
                  >
                    <Avatar
                      size={32}
                      name={formatName(user)}
                      path={user.avatar}
                      color={colorFromId(user._id)}
                    />
                    {formatShortName(user)} • {user.count}
                  </li>
                ))}
            </ul>
            <Button
              variant="link"
              className="ps-0 text-decoration-none fw-semibold"
              onClick={handleTopContributorsModalOpen}
            >
              <Trans>View all</Trans>
            </Button>
          </div>
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
