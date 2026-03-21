import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import {Button} from 'react-bootstrap';
import {useHostQuizController} from './useHostQuizController.js';
import {HostQuizScreens} from './HostQuizScreens.js';

export default function EmbeddedQuiz({
  questionSetId,
  opensInNewWindow,
}: {
  readonly questionSetId: string;
  // eslint-disable-next-line react/boolean-prop-naming
  readonly opensInNewWindow: boolean;
}) {
  const {_} = useLingui();
  const {
    quiz,
    screen,
    handleCreateQuiz,
    handleCreateQuizAndRedirect,
    handleStartQuiz,
    handleEndQuiz,
    handleRestartQuiz,
    handleMoveToNextQuestion,
    handleRemovePlayer,
  } = useHostQuizController({questionSetId});

  if (opensInNewWindow) {
    return (
      <Button variant="primary" onClick={handleCreateQuizAndRedirect}>
        {_(msg`Start`)}
      </Button>
    );
  }

  if (!quiz) {
    return (
      <Button variant="primary" size="lg" onClick={handleCreateQuiz}>
        {_(msg`Start`)}
      </Button>
    );
  }

  return (
    <HostQuizScreens
      quiz={quiz}
      screen={screen}
      handleStart={handleStartQuiz}
      handleEnd={handleEndQuiz}
      handleRestart={handleRestartQuiz}
      handleNext={handleMoveToNextQuestion}
      handleRemovePlayer={handleRemovePlayer}
    />
  );
}
