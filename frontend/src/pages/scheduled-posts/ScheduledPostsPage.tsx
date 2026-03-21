import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PostList from './PostList.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ScheduledPostsPage() {
  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Posts">
        <div className="d-flex gap-2">
          <Link to="/scheduled-posts/challenge/create">
            <Button className="btn btn-primary">Add new Challenge</Button>
          </Link>
          <Link to="/scheduled-posts/coach-post/create">
            <Button className="btn btn-primary">Add new Coach Post</Button>
          </Link>
        </div>
      </PageTitle>

      <PostList />
    </div>
  );
}
