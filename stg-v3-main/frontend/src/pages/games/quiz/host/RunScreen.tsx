import {Trans} from '@lingui/react/macro';
import {useMemo} from 'react';
import Button from 'react-bootstrap/Button';
import {useLingui} from '@lingui/react';
import {type GetHostQuizResponse} from '@client/ApiTypes';
import StrengthBalls from './StrengthBalls.js';
import BalloonFrame from './BalloonFrame.js';

type Properties = {
  readonly quiz: GetHostQuizResponse;
  readonly handleEndQuiz: () => Promise<void>;
  readonly handleMoveToNextQuestion: () => Promise<void>;
  readonly handleRestartQuiz: () => Promise<void>;
};

export default function RunScreen({
  quiz,
  handleEndQuiz,
  handleMoveToNextQuestion,
  handleRestartQuiz,
}: Properties) {
  const {i18n} = useLingui();
  const language = i18n.locale;

  const currentQuestionIndex = quiz.questionSet.questions.findIndex(
    (q) => q.id === quiz.currentQuestion,
  );
  const currentQuestion = quiz.questionSet.questions[currentQuestionIndex];

  const questionText =
    currentQuestion.instruction.find((t) => t.language === language)?.text ??
    currentQuestion.instruction[0]?.text;

  const answeredPlayersCount = useMemo(() => {
    if (!quiz) return 0;
    const currentQ = quiz.currentQuestion;
    const playersAnswered = new Set(
      quiz.answers.filter((a) => a.question === currentQ).map((a) => a.player),
    );
    return playersAnswered.size;
  }, [quiz]);

  const totalPlayers = quiz?.players.length ?? 0;

  return (
    <BalloonFrame>
      <div
        className="position-relative h-100 w-100"
        style={{
          overflow: 'hidden',
          borderRadius: 16,
        }}
      >
        <div
          className="bg-white h-100 w-100"
          style={{position: 'absolute', inset: 0, zIndex: 0}}
        />
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          <StrengthBalls quiz={quiz} />
        </div>

        <div
          className="h-100 d-flex flex-column position-relative p-5"
          style={{zIndex: 2}}
        >
          <div
            className="m-auto w-100 position-relative border pt-5 p-4"
            style={{
              maxWidth: 900,
              minHeight: 400,
              position: 'relative',
              textAlign: 'center',
              color: 'var(--dark)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              borderRadius: 12,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <div
              className="d-flex flex-column h-100"
              style={{position: 'relative', zIndex: 2}}
            >
              <div className="text-center">
                <h2 className="m-0">
                  {currentQuestionIndex + 1}/{quiz.questionSet.questions.length}
                </h2>
              </div>
              <div className="flex-grow-1 d-flex align-items-center justify-content-center">
                <h1 className="text-center">{questionText}</h1>
              </div>
              <div className="text-center">
                <h5 className="m-0">
                  <Trans>Answers</Trans>: {answeredPlayersCount}/{totalPlayers}
                </h5>
              </div>
            </div>
          </div>
          <div className="position-absolute bottom-0 start-50 translate-middle-x w-100 p-3">
            <div className="d-flex flex-row justify-content-center gap-2">
              <Button onClick={handleEndQuiz}>
                <Trans>End game</Trans>
              </Button>
              <Button onClick={handleMoveToNextQuestion}>
                <Trans>Next question</Trans>
              </Button>
              <Button onClick={handleRestartQuiz}>
                <Trans>Restart</Trans>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </BalloonFrame>
  );
}
