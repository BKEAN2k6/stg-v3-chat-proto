import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useRef,
  type ReactNode,
} from 'react';
import api from '@client/ApiClient.js';
import type {GetAiGuidanceResponse} from '@client/ApiTypes.js';

type AiGuidanceData = {
  guidance: GetAiGuidanceResponse | undefined;
  audioBlob: Blob | undefined;
  audioUrl: string | undefined;
};

type CacheEntry = {
  groupId: string;
  data: AiGuidanceData;
  language?: string;
  ageGroup?: string;
};

type AiGuidanceContextValue = {
  getGuidance: (groupId: string) => AiGuidanceData | undefined;
  fetchGuidance: (
    groupId: string,
    context?: {language?: string; ageGroup?: string},
  ) => Promise<AiGuidanceData | undefined>;
  refetch: (
    groupId: string,
    context?: {language?: string; ageGroup?: string},
  ) => Promise<AiGuidanceData | undefined>;
  fetchAudio: (
    groupId: string,
    text: string,
    language: string,
  ) => Promise<string | undefined>;
  invalidate: (groupId: string) => void;
  invalidateAll: () => void;
  isLoading: boolean;
  hasError: boolean;
};

const AiGuidanceContext = createContext<AiGuidanceContextValue | undefined>(
  undefined,
);

export function useAiGuidance(): AiGuidanceContextValue {
  const context = useContext(AiGuidanceContext);
  if (!context) {
    throw new Error('useAiGuidance must be used within an AiGuidanceProvider');
  }

  return context;
}

type ProviderProperties = {readonly children: ReactNode};

export function AiGuidanceProvider({children}: ProviderProperties) {
  const [cache, setCache] = useState<Map<string, CacheEntry>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const abortControllerReference = useRef<AbortController | undefined>(
    undefined,
  );

  const getGuidance = useCallback(
    (groupId: string): AiGuidanceData | undefined => {
      const entry = cache.get(groupId);
      return entry?.data;
    },
    [cache],
  );

  const refetch = useCallback(
    async (
      groupId: string,
      context?: {language?: string; ageGroup?: string},
    ): Promise<AiGuidanceData | undefined> => {
      // Cancel any previous request
      if (abortControllerReference.current) {
        abortControllerReference.current.abort();
      }

      const abortController = new AbortController();
      abortControllerReference.current = abortController;

      setIsLoading(true);
      setHasError(false);
      try {
        const now = new Date();
        const clientHour = String(now.getHours());
        const clientWeekday = new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
        }).format(now);

        const guidance = await api.getAiGuidance(
          {id: groupId},
          {clientHour, clientWeekday},
        );

        // If this request was aborted, don't update state
        if (abortController.signal.aborted) {
          return undefined;
        }

        const data: AiGuidanceData = {
          guidance,
          audioBlob: undefined,
          audioUrl: undefined,
        };

        setCache((previous) => {
          const next = new Map(previous);
          const existing = previous.get(groupId);
          if (existing?.data.audioUrl) {
            URL.revokeObjectURL(existing.data.audioUrl);
          }

          next.set(groupId, {
            groupId,
            data,
            language: context?.language,
            ageGroup: context?.ageGroup,
          });
          return next;
        });

        return data;
      } catch (error) {
        // Don't set error state if request was aborted
        if (error instanceof Error && error.name === 'AbortError') {
          return undefined;
        }

        console.error('Failed to refetch AI guidance:', error);
        setHasError(true);
        return undefined;
      } finally {
        // Only clear loading if this is still the current request
        if (abortControllerReference.current === abortController) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  const fetchGuidance = useCallback(
    async (
      groupId: string,
      context?: {language?: string; ageGroup?: string},
    ): Promise<AiGuidanceData | undefined> => {
      const cached = cache.get(groupId);
      if (cached) {
        const languageMatch =
          !context?.language || cached.language === context.language;
        const ageGroupMatch =
          !context?.ageGroup || cached.ageGroup === context.ageGroup;

        if (languageMatch && ageGroupMatch) {
          return cached.data;
        }
      }

      // Fetch from API
      return refetch(groupId, context);
    },
    [cache, refetch],
  );

  const fetchAudio = useCallback(
    async (
      groupId: string,
      text: string,
      language: string,
    ): Promise<string | undefined> => {
      const entry = cache.get(groupId);

      if (entry?.data.audioUrl) {
        return entry.data.audioUrl;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/v1/animation-assets/voiceover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({text, language}),
        });

        if (!response.ok) {
          throw new Error('Voiceover request failed');
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        setCache((previous) => {
          const next = new Map(previous);
          const existing = next.get(groupId);
          if (existing) {
            next.set(groupId, {
              ...existing,
              data: {
                ...existing.data,
                audioBlob: blob,
                audioUrl: url,
              },
            });
          }

          return next;
        });

        return url;
      } catch (error) {
        console.error('Failed to generate audio:', error);
        return undefined;
      }
    },
    [cache],
  );

  const invalidate = useCallback((groupId: string) => {
    setCache((previous) => {
      const next = new Map(previous);
      const entry = next.get(groupId);
      if (entry?.data.audioUrl) {
        URL.revokeObjectURL(entry.data.audioUrl);
      }

      next.delete(groupId);
      return next;
    });
  }, []);

  const invalidateAll = useCallback(() => {
    setCache((previous) => {
      for (const entry of previous.values()) {
        if (entry.data.audioUrl) {
          URL.revokeObjectURL(entry.data.audioUrl);
        }
      }

      return new Map();
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      getGuidance,
      fetchGuidance,
      refetch,
      fetchAudio,
      invalidate,
      invalidateAll,
      isLoading,
      hasError,
    }),
    [
      getGuidance,
      fetchGuidance,
      refetch,
      fetchAudio,
      invalidate,
      invalidateAll,
      isLoading,
      hasError,
    ],
  );

  return (
    <AiGuidanceContext.Provider value={contextValue}>
      {children}
    </AiGuidanceContext.Provider>
  );
}
