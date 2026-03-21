import {useParams} from 'react-router-dom';
import {useHostQuizController} from './useHostQuizController.js';
import {HostQuizScreens} from './HostQuizScreens.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {Loader} from '@/components/ui/Loader.js';

export default function HostQuizById() {
  const {quizId} = useParams();
  const {
    quiz,
    screen,
    handleStartQuiz,
    handleEndQuiz,
    handleRestartQuiz,
    handleMoveToNextQuestion,
    handleRemovePlayer,
  } = useHostQuizController({quizId: quizId!});

  if (!quiz) {
    return (
      <CenterAligned>
        <Loader />
      </CenterAligned>
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
