import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState, useEffect, useCallback} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useLingui} from '@lingui/react';
import api, {ApiError} from '@client/ApiClient';
import {
  type GetPlayerQuizResponse,
  type PatchPlayerQuizEvent,
} from '@client/ApiTypes';
import {Button, Container} from 'react-bootstrap';
import 'react-circular-progressbar/dist/styles.css';
import ResultScreen from './ResultScreen.js';
import {CenterAligned} from '@/components/ui/CenterAligned.js';
import {Loader} from '@/components/ui/Loader.js';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {useToasts} from '@/components/toasts/index.js';
import GlobalLanguagePicker from '@/components/ui/GlobalLanguagePicker.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

export default function PlayerQuizPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const navigate = useNavigate();
  const {quizId} = useParams();
  const [quiz, setQuiz] = useState<GetPlayerQuizResponse>();
  const {i18n} = useLingui();
  const language = i18n.locale;

  const onQuizPatch = useCallback(async (patch: PatchPlayerQuizEvent) => {
    setQuiz((quiz) => {
      if (!quiz) return;
      return {...quiz, ...patch};
    });
  }, []);

  const joinQuizRoom = useCallback(() => {
    socket.emit(JOIN, `/quizzes/${quizId}/player`);
  }, [quizId]);

  useEffect(() => {
    joinQuizRoom();
    socket.on('PatchPlayerQuizEvent', onQuizPatch);
    socket.on(CONNECT, joinQuizRoom);
    return () => {
      socket.emit(LEAVE, `/quizzes/${quizId}/player`);
      socket.off('PatchPlayerQuizEvent', onQuizPatch);
      socket.off(CONNECT, joinQuizRoom);
    };
  }, [joinQuizRoom, onQuizPatch, quizId]);

  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [quiz?.currentQuestion]);

  const fetchQuizData = useCallback(async () => {
    try {
      if (!quizId) return;
      const fetchedQuiz = await api.getPlayerQuiz({id: quizId});
      setQuiz(fetchedQuiz);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        navigate('/games/quizzes/join');
        return;
      }

      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while fetching the quiz`),
      });
    }
  }, [quizId, toasts, _, navigate]);

  const isChoiceSelected = useCallback(
    (choiceId: string) => {
      const currentQuestionId = quiz?.currentQuestion;
      if (!currentQuestionId) return false;
      const ans = quiz?.answers.find((a) => a.question === currentQuestionId);
      return Boolean(ans?.choices?.includes(choiceId));
    },
    [quiz],
  );

  const getCurrentQuestion = useCallback(() => {
    if (!quiz?.currentQuestion) return undefined;
    return quiz.questionSet.questions.find(
      (q) => q.id === quiz.currentQuestion,
    );
  }, [quiz]);

  const handleToggleAnswer = useCallback(
    async (choiceId: string) => {
      if (!quizId || !quiz?.currentQuestion || !quiz.canAnswer) return;

      const currentQ = getCurrentQuestion();
      const isMultiSelect = Boolean(currentQ?.multiSelect);

      const existing = quiz.answers.find(
        (a) => a.question === quiz.currentQuestion,
      );

      const previousChoices = new Set(existing?.choices ?? []);

      if (!isMultiSelect && previousChoices.has(choiceId)) {
        return;
      }

      if (isMultiSelect) {
        if (previousChoices.has(choiceId)) {
          previousChoices.delete(choiceId);
        } else {
          previousChoices.add(choiceId);
        }
      } else {
        previousChoices.clear();
        previousChoices.add(choiceId);
      }

      const nextChoices = [...previousChoices];

      try {
        const created = await api.createQuizAnswer(
          {id: quizId},
          {
            question: quiz.currentQuestion,
            choices: nextChoices,
          },
        );

        setQuiz((q) => {
          if (!q) return q;
          const index = q.answers.findIndex(
            (a) => a.question === quiz.currentQuestion,
          );
          if (index === -1) {
            return {...q, answers: [...q.answers, created]};
          }

          const updated = [...q.answers];
          updated[index] = created;
          return {...q, answers: updated};
        });
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
          navigate('/games/quizzes/join');
          return;
        }

        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while submitting your answer`),
        });
      }
    },
    [quizId, quiz, getCurrentQuestion, toasts, _, navigate],
  );

  useEffect(() => {
    void fetchQuizData();
  }, [quiz?.isStarted, quiz?.isEnded, fetchQuizData]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        void fetchQuizData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchQuizData]);

  if (quiz && !quiz.players.some((player) => player.id === quiz.player.id)) {
    navigate('/games/quizzes/join');
    return null;
  }

  if (!quiz) {
    return (
      <CenterAligned>
        <h1>
          <Trans>Loading...</Trans>
        </h1>
      </CenterAligned>
    );
  }

  let screen: 'wait' | 'play' | 'result' = 'play';
  if (!quiz.isStarted) screen = 'wait';
  if (quiz.isEnded) screen = 'result';

  switch (screen) {
    case 'wait': {
      return (
        <CenterAligned>
          <div>
            <h3 style={{marginBottom: '2rem'}}>
              <Trans>You are ready to go!</Trans>
            </h3>
            <div
              className="rounded-circle mx-auto"
              style={{
                width: '4rem',
                height: '4rem',
                backgroundColor: quiz.player.color,
                margin: '0.5rem',
                border: 'none',
              }}
            >
              <SimpleLottiePlayer
                autoplay
                loop
                src={`/animations/avatars/${quiz.player.avatar}.json`}
              />
            </div>
            <h4 className="text-center mt-4">{quiz.player.nickname}</h4>
            <p className="mt-5">
              <Trans>Just a moment, waiting for the game to start.</Trans>
            </p>
            <div className="mt-5">
              <Loader />
            </div>
          </div>
        </CenterAligned>
      );
    }

    case 'play': {
      const currentQuestionIndex = quiz.questionSet.questions.findIndex(
        (q) => q.id === quiz.currentQuestion,
      );

      const currentQuestion = quiz.questionSet.questions[currentQuestionIndex];

      const questionText = currentQuestion.instruction.find(
        (translation) => translation.language === language,
      )?.text;

      const hasAnsweredThisQuestion = (() => {
        const a = quiz.answers.find(
          (ans) => ans.question === quiz.currentQuestion,
        );
        return Boolean(a && Array.isArray(a.choices) && a.choices.length > 0);
      })();

      return (
        <Container
          fluid
          className="h-100 d-flex flex-column p-3"
          style={{
            backgroundColor: 'var(--primary-darker-1)',
          }}
        >
          <div className="flex-grow-1 d-flex">
            <div className="w-100 d-flex flex-column justify-content-center">
              <h3 className="text-center text-white">
                {currentQuestionIndex + 1}/{quiz.questionSet.questions.length}
              </h3>
              <h4 className="text-center text-white">{questionText}</h4>
            </div>
          </div>

          <div className="mt-auto">
            <div className="d-flex flex-column align-items-center gap-2">
              {currentQuestion.choices.map((choice) => (
                <Button
                  key={choice.id}
                  size="lg"
                  style={{width: '100%', maxWidth: 600}}
                  variant={isChoiceSelected(choice.id) ? 'info' : 'white'}
                  disabled={!quiz.canAnswer}
                  onClick={async () => handleToggleAnswer(choice.id)}
                >
                  {
                    choice.label.find(
                      (translation) => translation.language === language,
                    )?.text
                  }
                </Button>
              ))}

              <div style={{height: '2.8em'}}>
                {hasAnsweredThisQuestion ? (
                  <p className="text-center mt-3 mb-0 text-white">
                    <Trans>
                      You can still change your answer until everyone is ready.
                    </Trans>
                  </p>
                ) : null}
              </div>
            </div>
            <div className="d-flex justify-content-center">
              <GlobalLanguagePicker />
            </div>
          </div>
        </Container>
      );
    }

    case 'result': {
      return <ResultScreen quiz={quiz} />;
    }
  }
}
