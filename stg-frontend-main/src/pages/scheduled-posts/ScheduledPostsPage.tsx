import {Button} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PostList from './PostList';

export default function ScheduledPostsPage() {
  return (
    <div>
      <div className="d-flex gap-3 justify-content-end mb-3">
        <Link to="/scheduled-posts/challenge/create">
          <Button className="btn btn-primary">Add new Challenge</Button>
        </Link>
        <Link to="/scheduled-posts/coach-post/create">
          <Button className="btn btn-primary">Add new Coach Post</Button>
        </Link>
      </div>

      <PostList />
    </div>
  );
}
