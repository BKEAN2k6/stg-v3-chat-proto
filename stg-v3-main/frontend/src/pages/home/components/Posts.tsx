import {msg} from '@lingui/core/macro';
import {useState, useRef, useEffect, useCallback} from 'react';
import {useLingui} from '@lingui/react';
import api from '@client/ApiClient';
import {type Post} from '@client/ApiTypes';
import PostCard from '@/components/ui/PostCard/PostCard.js';
import MomentForm from '@/components/MomentForm.js';
import InfiniteScroller from '@/components/InfiniteScroller.js';
import {Loader} from '@/components/ui/Loader.js';
import {useToasts} from '@/components/toasts/index.js';
import MediaUpload from '@/components/MediaUpload.js';
import {usePostsRefresh} from '@/context/usePostsRefresh.js';

type Properties = {
  readonly communityId: string;
};

export default function Posts(properties: Properties) {
  const {communityId} = properties;
  const {_} = useLingui();
  const toasts = useToasts();
  const [postListItems, setPostListItems] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const startDateReference = useRef<string | undefined>(undefined);
  const batchSize = 20;
  const {onUpdateRequest} = usePostsRefresh();

  const onPostUpdate = (post: Post) => {
    setPostListItems((currentPostListItems) => {
      return currentPostListItems.map((currentPostListItem) =>
        currentPostListItem.id === post.id ? post : currentPostListItem,
      );
    });
  };

  const onPostCreate = (post: Post) => {
    setPostListItems((currentPostListItems) => {
      return [post, ...currentPostListItems];
    });
  };

  const onPostDelete = (postId: string) => {
    setPostListItems((currentPostListItems) =>
      currentPostListItems.filter((postListItem) => postListItem.id !== postId),
    );
  };

  const fetchData = useCallback(async () => {
    try {
      const startDate = startDateReference.current;
      const posts = await api.getCommunityPosts(
        {id: communityId},
        {
          limit: String(batchSize),
          ...(startDate && {startDate}),
        },
      );

      if (posts.length > 0) {
        startDateReference.current = posts.at(-1)!.createdAt;
        setPostListItems((current) => [...current, ...posts]);
      }

      if (posts.length < batchSize || posts.length === 0) {
        setHasMore(false);
      }
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while loading the moments`),
      });
    }
  }, [communityId, batchSize, toasts, _]);

  const refresh = useCallback(() => {
    console.log('Refreshing posts...');
    startDateReference.current = undefined;
    setPostListItems([]);
    setHasMore(true);
    void fetchData();
  }, [fetchData]);

  useEffect(() => onUpdateRequest(refresh), [onUpdateRequest, refresh]);

  return (
    <div>
      <div id="moment-form">
        <MediaUpload>
          <MomentForm
            communityId={communityId}
            className="mb-3"
            onSave={onPostCreate}
          />
        </MediaUpload>
      </div>
      <div id="feed" className="d-flex flex-column position-relative">
        <InfiniteScroller
          hasMore={() => hasMore}
          className="d-flex flex-column gap-3"
          loadMore={fetchData}
          loader={<Loader />}
        >
          {postListItems.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={onPostDelete}
              onUpdate={onPostUpdate}
            />
          ))}
        </InfiniteScroller>
      </div>
    </div>
  );
}
