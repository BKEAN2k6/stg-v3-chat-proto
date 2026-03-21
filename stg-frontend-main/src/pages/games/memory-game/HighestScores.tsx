import {Trans, Plural} from '@lingui/macro';
import {
  type GetHostMemoryGameResponse,
  type GetPlayerMemoryGameResponse,
} from '@/api/ApiTypes';
import Logo from '@/components/ui/Logo';

type Props = {
  readonly game: GetHostMemoryGameResponse | GetPlayerMemoryGameResponse;
};

export default function HighestScores(props: Props) {
  const {game} = props;

  const getPlayersWithMostPairs = (
    data: GetHostMemoryGameResponse | GetPlayerMemoryGameResponse,
  ) => {
    const pairCountMap: Record<string, number> = {};
    for (const pair of data.foundPairs) {
      if (pairCountMap[pair.player]) {
        pairCountMap[pair.player]++;
      } else {
        pairCountMap[pair.player] = 1;
      }
    }

    const maxPairs = Math.max(...Object.values(pairCountMap), 0);

    const playersWithMostPairs = Object.keys(pairCountMap).filter(
      (playerId) => pairCountMap[playerId] === maxPairs,
    );

    const result = playersWithMostPairs.map((playerId) => {
      const player = data.players.find((p) => p._id === playerId);
      return {
        nickname: player!.nickname,
        pairs: pairCountMap[playerId],
      };
    });

    return result;
  };

  const results = getPlayersWithMostPairs(game);

  return (
    <div className="text-center">
      <div className="mx-auto">
        <Logo className="mb-5" color="#fdd662" height={64} width={64} />
      </div>
      <h1>
        <Trans>Game Over</Trans>
      </h1>
      {results.length > 0 && (
        <>
          <h4 className="mt-5">
            <Trans>
              <Plural value={results.length} one="Winner" other="Winners" />
            </Trans>
          </h4>
          <div className="d-flex flex-column justify-content-center align-items-center gap-1">
            {results.map((result) => (
              <div key={result.nickname} className="d-flex gap-1">
                <Trans>
                  {result.nickname} with {result.pairs}{' '}
                  <Plural value={result.pairs} one="pair" other="pairs" />.
                </Trans>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
