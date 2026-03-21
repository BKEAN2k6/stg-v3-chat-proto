import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {type ProxyPostData} from '@client/ApiTypes';
import api from '@client/ApiClient';
import {confirm} from '@/components/ui/confirm.js';
import {useToasts} from '@/components/toasts/index.js';

export default function PostList() {
  const [challengeDatas, setChallengeDatas] = useState<ProxyPostData[]>();
  const [isPolling, setIsPolling] = useState(true);
  const toasts = useToasts();

  useEffect(() => {
    const fetchChallengeDatas = async () => {
      if (!isPolling) {
        return;
      }

      try {
        const challengeDatas = await api.getProxyPosts();
        setChallengeDatas(challengeDatas);

        const hasUnprocessed = challengeDatas.some((data) => data.isProcessing);
        if (hasUnprocessed) {
          setTimeout(fetchChallengeDatas, 5000);
        } else {
          setIsPolling(false);
        }
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching challenge data',
        });
      }
    };

    void fetchChallengeDatas();
  }, [toasts, isPolling]);

  if (!challengeDatas) {
    return <div>Loading...</div>;
  }

  const removeChallengeData = async (challengeId: string) => {
    const confirmed = await confirm({
      title: 'Delete Post',
      text: 'Are you sure you want to delete this post?',
      confirm: 'Delete',
      cancel: 'Cancel',
    });

    if (!confirmed) {
      return;
    }

    try {
      await api.removeProxyPost({id: challengeId});
      setChallengeDatas(
        challengeDatas.filter((data) => data.id !== challengeId),
      );
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while deleting challenge data',
      });
    }
  };

  const renderControls = (challengeData: ProxyPostData) => {
    switch (challengeData.postType) {
      case 'challenge': {
        return (
          <Link to={`/scheduled-posts/challenge/${challengeData.id}`}>
            Edit
          </Link>
        );
      }

      case 'coach-post': {
        return (
          <Link to={`/scheduled-posts/coach-post/${challengeData.id}`}>
            Edit
          </Link>
        );
      }
    }
  };

  return (
    <div>
      {challengeDatas.map((challengeData) => (
        <div key={challengeData.id} className="d-flex">
          <div className="flex-shrink-0" style={{width: '10%'}}>
            {new Date(challengeData.showDate).toLocaleDateString()}
          </div>
          <div className="flex-shrink-0" style={{width: '10%'}}>
            {challengeData.postType === 'challenge'
              ? 'Challenge'
              : 'Coach Post'}
          </div>
          <div className="flex-grow-1">{challengeData.translations.en}</div>
          <div className="flex-shrink-0 text-end" style={{width: '10%'}}>
            {challengeData.isProcessing ? (
              'Processing...'
            ) : (
              <>
                {renderControls(challengeData)} |{' '}
                <a
                  href="#"
                  onClick={async () => {
                    await removeChallengeData(challengeData.id);
                  }}
                >
                  Delete
                </a>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
