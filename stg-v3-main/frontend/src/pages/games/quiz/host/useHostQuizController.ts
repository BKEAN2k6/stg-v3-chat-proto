import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {msg} from '@lingui/core/macro';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {
  type GetHostQuizResponse,
  type PatchHostQuizEvent,
} from '@client/ApiTypes';
import {socket, CONNECT, JOIN, LEAVE} from '@/socket.js';
import {useToasts} from '@/components/toasts/index.js';
import {confirm} from '@/components/ui/confirm.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';

export type HostQuizScreen = 'start' | 'run' | 'result';

export type UseHostQuizArguments =
  | {quizId: string; questionSetId?: never}
  | {quizId?: never; questionSetId: string};

export function useHostQuizController(arguments_: UseHostQuizArguments) {
  const {_} = useLingui();
  const toasts = useToasts();
  const {activeGroup} = useActiveGroup();

  const [quiz, setQuiz] = useState<GetHostQuizResponse>();
  const lastAdvancedForQuestion = useRef<string | undefined>(undefined);
  const advancingReference = useRef(false);

  const roomId = useMemo(() => {
    return quiz?.id ?? arguments_.quizId;
  }, [quiz?.id, arguments_]);

  const screen: HostQuizScreen = useMemo(() => {
    if (quiz?.isStarted && !quiz?.isEnded) return 'run';
    if (quiz?.isStarted && quiz?.isEnded) return 'result';
    return 'start';
  }, [quiz?.isEnded, quiz?.isStarted]);

  const joinQuizRoom = useCallback(() => {
    if (!roomId) return;
    socket.emit(JOIN, `/quizzes/${roomId}/host`);
  }, [roomId]);

  const onQuizPatch = useCallback((patch: PatchHostQuizEvent) => {
    setQuiz((previous) => {
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

  useEffect(() => {
    if (!roomId) return;
    joinQuizRoom();
    socket.on('PatchHostQuizEvent', onQuizPatch);
    socket.on(CONNECT, joinQuizRoom);

    return () => {
      socket.emit(LEAVE, `/quizzes/${roomId}/host`);
      socket.off('PatchHostQuizEvent', onQuizPatch);
      socket.off(CONNECT, joinQuizRoom);
    };
  }, [roomId, joinQuizRoom, onQuizPatch]);

  const getQuizById = useCallback(
    async (id: string) => {
      try {
        const q = await api.getHostQuiz({id});
        setQuiz(q);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Something went wrong while loading the game`),
        });
      }
    },
    [toasts, _],
  );

  const refreshQuiz = useCallback(async () => {
    const id = quiz?.id ?? arguments_.quizId;
    if (!id) return;
    await getQuizById(id);
  }, [arguments_.quizId, getQuizById, quiz?.id]);

  useEffect(() => {
    if (arguments_.quizId) void getQuizById(arguments_.quizId);
  }, [arguments_.quizId, getQuizById]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshQuiz();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshQuiz]);

  const handleCreateQuiz = useCallback(async () => {
    if (!arguments_.questionSetId) return;
    try {
      if (!activeGroup) {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`No active group found for creating the game.`),
        });
        return;
      }

      const created = await api.createQuiz(
        {id: activeGroup.id},
        {questionSet: arguments_.questionSetId},
      );
      setQuiz(created);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating the game`),
      });
    }
  }, [activeGroup, arguments_, toasts, _]);

  const handleCreateQuizAndRedirect = async () => {
    if (!activeGroup || !arguments_.questionSetId) return;
    const created = await api.createQuiz(
      {id: activeGroup.id},
      {questionSet: arguments_.questionSetId},
    );
    const win = window.open(`/games/quizzes/${created.id}/host`, '_blank');
    win?.focus();
  };

  const handleStartQuiz = useCallback(async () => {
    if (!quiz) return;
    await api.updateQuiz({id: quiz.id}, {isStarted: true, isEnded: false});
    setQuiz({...quiz, isStarted: true, isEnded: false});
  }, [quiz]);

  const handleEndQuiz = useCallback(async () => {
    if (!quiz) return;
    const updateQuiz = await api.updateQuiz({id: quiz.id}, {isEnded: true});
    setQuiz(updateQuiz);
  }, [quiz]);

  const handleRemovePlayer = useCallback(
    async (playerId: string) => {
      try {
        if (!quiz) return;
        const confirmed = await confirm({
          title: _(msg`Remove player`),
          text: _(msg`Are you sure you want to remove the player.`),
          cancel: _(msg`No, cancel`),
          confirm: _(msg`Yes, remove`),
        });
        if (!confirmed) return;

        await api.removeQuizPlayer({id: quiz.id, playerId});
        setQuiz((previous) =>
          previous
            ? {
                ...previous,
                players: previous.players.filter((p) => p.id !== playerId),
              }
            : previous,
        );
        toasts.success({
          header: _(msg`Player removed`),
          body: _(msg`The player has been successfully removed from the game.`),
        });
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Failed to remove player from the game.`),
        });
      }
    },
    [quiz, toasts, _],
  );

  const handleRestartQuiz = useCallback(async () => {
    if (!quiz) return;
    const updatedQuiz = await api.updateQuiz(
      {id: quiz.id},
      {
        isStarted: false,
        isEnded: false,
        currentQuestion: quiz.questionSet.questions[0].id,
        answers: [],
      },
    );
    setQuiz(updatedQuiz);
    lastAdvancedForQuestion.current = undefined;
  }, [quiz]);

  const advanceToIndex = useCallback(
    async (index: number) => {
      if (!quiz) return;
      const {questions} = quiz.questionSet;
      const isLast = index === questions.length - 1;
      if (isLast) {
        const updated = await api.updateQuiz({id: quiz.id}, {isEnded: true});
        setQuiz(updated);
      } else {
        const nextId = questions[index + 1].id;
        const updated = await api.updateQuiz(
          {id: quiz.id},
          {currentQuestion: nextId},
        );
        setQuiz(updated);
      }
    },
    [quiz],
  );

  const handleMoveToNextQuestion = useCallback(async () => {
    if (!quiz) return;
    const {questions} = quiz.questionSet;
    const index = questions.findIndex((q) => q.id === quiz.currentQuestion);
    if (index === -1) return;

    try {
      advancingReference.current = true;
      await advanceToIndex(index);
    } finally {
      advancingReference.current = false;
      lastAdvancedForQuestion.current = undefined;
    }
  }, [advanceToIndex, quiz]);

  useEffect(() => {
    const maybeAutoAdvance = async () => {
      if (!quiz) return;
      if (!quiz.isStarted || quiz.isEnded) return;
      if (quiz.questionSet.type !== 'questionnaire') return;
      if (!quiz.players || quiz.players.length === 0) return;

      const currentQuestionIndex = quiz.currentQuestion;
      if (!currentQuestionIndex) return;
      if (lastAdvancedForQuestion.current === currentQuestionIndex) return;
      if (advancingReference.current) return;

      const answeredPlayers = new Set(
        (quiz.answers ?? [])
          .filter(
            (a) =>
              a.question === currentQuestionIndex &&
              Array.isArray((a as any).choices) &&
              (a as any).choices.length > 0,
          )
          .map((a) => a.player),
      );
      const allAnswered = answeredPlayers.size === quiz.players.length;
      if (!allAnswered) return;

      const {questions} = quiz.questionSet;
      const index = questions.findIndex((q) => q.id === currentQuestionIndex);
      if (index === -1) return;

      try {
        advancingReference.current = true;
        lastAdvancedForQuestion.current = currentQuestionIndex;
        await advanceToIndex(index);
      } catch {
        lastAdvancedForQuestion.current = undefined;
      } finally {
        advancingReference.current = false;
      }
    };

    void maybeAutoAdvance();
  }, [advanceToIndex, quiz]);

  return {
    quiz,
    screen,
    setQuiz,
    refreshQuiz,
    handleCreateQuiz,
    handleCreateQuizAndRedirect,
    handleStartQuiz,
    handleEndQuiz,
    handleRemovePlayer,
    handleRestartQuiz,
    handleMoveToNextQuestion,
  } as const;
}
