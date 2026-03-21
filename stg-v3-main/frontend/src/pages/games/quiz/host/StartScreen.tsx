import {Trans, Plural} from '@lingui/react/macro';
import Button from 'react-bootstrap/Button';
import QRCode from 'react-qr-code';
import {PersonFill, X} from 'react-bootstrap-icons';
import {useMemo} from 'react';
import {type GetHostQuizResponse} from '@client/ApiTypes';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import BounsingBalls from '@/components/ui/BounsingBalls.js';

type Properties = {
  readonly quiz: GetHostQuizResponse;
  readonly handleRemovePlayer: (playerId: string) => Promise<void>;
  readonly handleStart: () => Promise<void>;
};

export default function StartScreen({
  quiz,
  handleRemovePlayer,
  handleStart: handleStartQuiz,
}: Properties) {
  const codeLink = `${globalThis.location.origin}/games/quizzes/join?code=${quiz?.code}`;

  const ballsData = useMemo(() => {
    return quiz.players.map((player) => ({
      id: player.id,
      label: player.nickname,
      ballColor: player.color,
      percentage: 100,
      lottiePath: `/animations/avatars/${player.avatar}.json`,
    }));
  }, [quiz.players]);

  return (
    <div
      className="w-100 position-absolute top-0 start-0 h-100"
      style={{
        backgroundColor: 'var(--primary-darker-1)',
      }}
    >
      <div
        className="position-absolute"
        aria-hidden="true"
        style={{
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
        }}
      >
        <BounsingBalls
          data={ballsData}
          ballScale={Math.min(30 / ballsData.length, 2)}
          textScale={0.7}
        />
      </div>
      <div
        className="d-flex flex-column w-100 h-100 mx-auto"
        style={{maxWidth: 1200, position: 'relative', zIndex: 1}}
      >
        <div className="d-flex flex-column flex-lg-row">
          <div
            style={{backgroundColor: 'rgba(255 255 255 / 0.8)'}}
            className="w-75 w-lg-100 mx-auto me-lg-4 ms-lg-5 my-3 p-3 d-flex flex-column justify-content-center align-items-center rounded"
          >
            <div className="d-flex flex-column align-items-center h-100">
              <span className="h2 text-center">
                {quiz.isCodeActive ? (
                  <Trans>Scan QR</Trans>
                ) : (
                  <Trans>The game has expired.</Trans>
                )}
              </span>
              <div
                className="bg-white p-3 rounded"
                style={{opacity: quiz.isCodeActive ? 1 : 0.3}}
              >
                <QRCode value={codeLink} />
              </div>

              {quiz.isCodeActive ? (
                <>
                  <span className="h2 mt-3 text-center">
                    <Trans>or enter code at</Trans>{' '}
                    <span className="text-primary fw-bold fs-5">
                      {globalThis.location.host}/games/quizzes/join
                    </span>
                  </span>
                  <span className="display-1 fw-bold mt-3">
                    {`${quiz.code.slice(0, 3)}-${quiz.code.slice(3)}`}
                  </span>
                </>
              ) : null}
            </div>
            <div className="mt-3">
              <GlobalLanguagePicker />
            </div>
          </div>
          <div
            style={{backgroundColor: 'rgba(255 255 255 / 0.8)'}}
            className="w-75 w-lg-100 mx-auto ms-lg-4 me-lg-5 my-3 p-3 d-flex flex-column justify-content-between align-items-center rounded"
          >
            <div className="d-flex flex-column align-items-center">
              <span className="display-5 fw-bold mt-3">
                {quiz.players.length}
              </span>
              <span className="h4">
                <PersonFill />{' '}
                <Plural
                  value={quiz.players.length}
                  one="participant"
                  other="participants"
                />
              </span>
              {quiz.players.length === 0 && (
                <span className="h2 mt-5 text-center">
                  <Trans>Waiting for participants to join...</Trans>
                </span>
              )}
              <div className="d-flex flex-wrap align-items-center mt-3 mb-5">
                {quiz.players.map((player) => (
                  <div
                    key={player.id}
                    className="rounded px-3 py-2 m-2 cursor-pointer"
                    style={{backgroundColor: player.color}}
                    role="button"
                    onClick={async () => handleRemovePlayer(player.id)}
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
                disabled={quiz.players.length === 0}
                onClick={handleStartQuiz}
              >
                <Trans>Start</Trans>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
