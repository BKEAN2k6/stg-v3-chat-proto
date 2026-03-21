import type {GetHostQuizResponse} from '@client/ApiTypes';
import StartScreen from './StartScreen.js';
import RunScreen from './RunScreen.js';
import ResultScreen from './ResultScreen.js';

export function HostQuizScreens({
  quiz,
  screen,
  handleStart,
  handleEnd,
  handleRestart,
  handleNext,
  handleRemovePlayer,
}: {
  readonly quiz: GetHostQuizResponse;
  readonly screen: 'start' | 'run' | 'result';
  readonly handleStart: () => Promise<void> | void;
  readonly handleEnd: () => Promise<void> | void;
  readonly handleRestart: () => Promise<void> | void;
  readonly handleNext: () => Promise<void> | void;
  readonly handleRemovePlayer: (playerId: string) => Promise<void> | void;
}) {
  switch (screen) {
    case 'start': {
      return (
        <StartScreen
          quiz={quiz}
          handleRemovePlayer={async (playerId) => handleRemovePlayer(playerId)}
          handleStart={async () => {
            await handleStart();
          }}
        />
      );
    }

    case 'run': {
      return (
        <RunScreen
          quiz={quiz}
          handleEndQuiz={async () => {
            await handleEnd();
          }}
          handleMoveToNextQuestion={async () => {
            await handleNext();
          }}
          handleRestartQuiz={async () => {
            await handleRestart();
          }}
        />
      );
    }

    case 'result': {
      return <ResultScreen quiz={quiz} />;
    }
  }
}
