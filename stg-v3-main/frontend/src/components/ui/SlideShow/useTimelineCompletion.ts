import {useCallback, useState} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {useCreateGroupArticleProgressMutation} from '@client/ApiHooks.js';
import {usePostsRefresh} from '@/context/usePostsRefresh.js';
import {useAiGuidance} from '@/context/aiGuidanceContext.js';
import {track} from '@/helpers/analytics.js';

const delay = async (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

type Properties = {
  readonly groupId: string;
  readonly articleId: string;
  readonly onDone: () => void;
  readonly skipInitialDelay?: boolean;
};

type MarkAsReadOptions = {
  readonly skipInitialDelay?: boolean;
};

export function useTimelineCompletion({
  groupId,
  articleId,
  onDone,
  skipInitialDelay,
}: Properties) {
  const queryClient = useQueryClient();
  const createProgress = useCreateGroupArticleProgressMutation();
  const {refreshPosts} = usePostsRefresh();
  const aiGuidance = useAiGuidance();
  const [isAnimationRunning, setIsAnimationRunning] = useState(false);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [isSlidingDown, setIsSlidingDown] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const reset = useCallback(() => {
    setIsAnimationRunning(false);
    setShowBackdrop(false);
    setShowCard(false);
    setIsSlidingDown(false);
    setIsCompleted(false);
  }, []);

  const markAsRead = useCallback(
    async (options?: MarkAsReadOptions) => {
      if (isAnimationRunning) return;

      const shouldSkipInitialDelay =
        options?.skipInitialDelay ?? skipInitialDelay ?? false;

      setIsAnimationRunning(true);
      setIsSlidingDown(false);
      setShowCard(false);
      setShowBackdrop(false);
      setIsCompleted(false);
      track('Lesson completed');

      try {
        setShowBackdrop(true);
        setShowCard(true);
        if (!shouldSkipInitialDelay) {
          await delay(1000);
        }

        setIsCompleted(true);
        await delay(2000);
        setIsSlidingDown(true);
        await delay(500);
        setShowBackdrop(false);
        await delay(500);
        await createProgress.mutateAsync({
          pathParameters: {id: groupId},
          payload: {article: articleId, isSkipped: false},
        });

        aiGuidance.invalidate(groupId);
        await queryClient.invalidateQueries({queryKey: ['groupStats']});
        refreshPosts();
        onDone();
      } finally {
        setIsAnimationRunning(false);
      }
    },
    [
      articleId,
      createProgress,
      groupId,
      aiGuidance,
      isAnimationRunning,
      onDone,
      queryClient,
      refreshPosts,
      skipInitialDelay,
    ],
  );

  const dismissWithAnimation = useCallback(async () => {
    if (isAnimationRunning) return;

    setIsAnimationRunning(true);
    setShowBackdrop(true);
    setShowCard(true);

    // Slide down the card
    setIsSlidingDown(true);
    await delay(500);
    setShowBackdrop(false);
    await delay(300);

    setIsAnimationRunning(false);
    onDone();
  }, [isAnimationRunning, onDone]);

  return {
    isCompleted,
    isAnimationRunning,
    isMutationPending: createProgress.isPending,
    isMutationSuccessful: createProgress.isSuccess,
    showBackdrop,
    showCard,
    isSlidingDown,
    markAsRead,
    dismissWithAnimation,
    reset,
  };
}
