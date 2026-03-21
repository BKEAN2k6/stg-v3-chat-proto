import {useState, useRef} from 'react';
import {msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import PostCard from '@/components/ui/PostCard/PostCard';
import MomentForm from '@/components/MomentForm';
import InfiniteScroller from '@/components/InfiniteScroller';
import {Loader} from '@/components/ui/Loader';
import api from '@/api/ApiClient';
import {type Post} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import MediaUpload from '@/components/MediaUpload';

type Props = {
  readonly communityId: string;
};

export default function Posts(props: Props) {
  const {communityId} = props;
  const {_} = useLingui();
  const toasts = useToasts();
  const [postListItems, setPostListItems] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const startDateRef = useRef<string | undefined>(undefined);
  const batchSize = 20;

  const onPostUpdate = (post: Post) => {
    setPostListItems((currentPostListItems) => {
      return currentPostListItems.map((currentPostListItem) =>
        currentPostListItem._id === post._id ? post : currentPostListItem,
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
      currentPostListItems.filter(
        (postListItem) => postListItem._id !== postId,
      ),
    );
  };

  const fetchData = async () => {
    try {
      const startDate = startDateRef.current;
      const posts = await api.getCommunityPosts(
        {id: communityId},
        {
          limit: String(batchSize),
          ...(startDate && {startDate}),
        },
      );

      if (posts.length > 0) {
        startDateRef.current = posts.at(-1)!.createdAt;
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
  };

  return (
    <div>
      <div id="moment-form">
        <MediaUpload>
          <MomentForm
            communityId={communityId}
            className="mb-4"
            onSave={onPostCreate}
          />
        </MediaUpload>
      </div>
      <div id="feed" className="d-flex flex-column gap-4 position-relative">
        <InfiniteScroller
          hasMore={() => hasMore}
          className="d-flex flex-column gap-4"
          loadMore={fetchData}
          loader={<Loader />}
        >
          {postListItems.map((post) => (
            <PostCard
              key={post._id}
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
