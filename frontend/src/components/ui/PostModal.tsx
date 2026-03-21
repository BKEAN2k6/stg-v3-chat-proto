import {msg} from '@lingui/core/macro';
import {useState, useEffect} from 'react';
import {useLingui} from '@lingui/react';
import Modal from 'react-bootstrap/Modal';
import {useSearchParams} from 'react-router-dom';
import {type Post} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {useToasts} from '@/components/toasts/index.js';
import PostCard from '@/components/ui/PostCard/PostCard.js';
import {useCurrentUser} from '@/context/currentUserContext.js';

export default function PostModal() {
  const toasts = useToasts();
  const {_} = useLingui();
  const [searchParameters, setSearchParameters] = useSearchParams();
  const [modalPost, setModalPost] = useState<Post | undefined>();
  const [showModal, setShowModal] = useState(false);
  const {currentUser} = useCurrentUser();

  useEffect(() => {
    const postId = searchParameters.get('showPost');
    const proxyPostId = searchParameters.get('showProxyPost');
    if (!currentUser) {
      return;
    }

    const getPost = async () => {
      let post;
      try {
        if (postId) {
          post = await api.getPost({id: postId});
        } else if (proxyPostId) {
          post = await api.getCommunityProxyPost({
            id: currentUser.selectedCommunity,
            postId: proxyPostId,
          });
        }

        setModalPost(post);
        setShowModal(true);
      } catch {
        toasts.danger({
          header: _(msg`Oops!`),
          body: _(msg`Failed to read the post`),
        });
        searchParameters.delete('showPost');
        searchParameters.delete('showProxyPost');
        setSearchParameters(searchParameters, {replace: true});
      }
    };

    void getPost();
  }, [searchParameters, setSearchParameters, _, toasts, currentUser]);

  const onClose = () => {
    setShowModal(false);
  };

  const onExited = () => {
    searchParameters.delete('showPost');
    searchParameters.delete('showProxyPost');
    setSearchParameters(searchParameters, {replace: true});
    setModalPost(undefined);
  };

  if (!modalPost) {
    return null;
  }

  return (
    <Modal scrollable centered show={showModal} size="lg" onExited={onExited}>
      <Modal.Body
        style={{
          padding: '0',
        }}
      >
        <PostCard
          post={modalPost}
          onUpdate={async (post) => {
            setModalPost(post);
          }}
          onDelete={onClose}
          onClose={onClose}
        />
      </Modal.Body>
    </Modal>
  );
}
