import React, {createContext, useContext, useRef, useMemo} from 'react';

type Listener = () => void;

const PostsRefreshContext = createContext<
  | {
      onUpdateRequest: (function_: Listener) => () => void;
      refreshPosts: () => void;
    }
  | undefined
>(undefined);

export function PostsRefreshProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const listenersReference = useRef<Set<Listener>>(new Set());

  const api = useMemo(
    () => ({
      onUpdateRequest(function_: Listener) {
        listenersReference.current.add(function_);
        return () => listenersReference.current.delete(function_);
      },
      refreshPosts() {
        for (const function_ of listenersReference.current) function_();
      },
    }),
    [],
  );

  return (
    <PostsRefreshContext.Provider value={api}>
      {children}
    </PostsRefreshContext.Provider>
  );
}

export function usePostsRefresh() {
  const context = useContext(PostsRefreshContext);
  if (!context)
    throw new Error('usePostsRefresh must be used within PostsRefreshProvider');
  return context;
}
