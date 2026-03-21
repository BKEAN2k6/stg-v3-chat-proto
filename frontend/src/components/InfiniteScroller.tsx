// Modified from https://www.npmjs.com/package/better-react-infinite-scroll
// License: MIT
import {forwardRef, useRef, useEffect} from 'react';

type Properties = {
  readonly loadMore: () => void;
  readonly hasMore: () => boolean;
  readonly loader: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const InfiniteScroller = forwardRef<HTMLDivElement, Properties>(
  ({loadMore, hasMore, loader, children, ...properties}, reference) => {
    const observerTarget = useRef(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) loadMore();
        },
        {threshold: 1},
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }

      return () => {
        observer.disconnect();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={reference} {...properties} style={{overflowAnchor: 'none'}}>
        {children}

        {hasMore() && (
          <div
            ref={observerTarget}
            style={{display: 'flex', justifyContent: 'center'}}
          >
            {loader}
          </div>
        )}
      </div>
    );
  },
);

export default InfiniteScroller;
