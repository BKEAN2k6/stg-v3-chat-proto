import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {confirm} from '@/components/ui/confirm';
import {type ProxyPostData} from '@/api/ApiTypes';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';

export default function PostList() {
  const [challengeDatas, setChallengeDatas] = useState<ProxyPostData[]>();
  const toasts = useToasts();

  useEffect(() => {
    const fetchChallengeDatas = async () => {
      try {
        const challengeDatas = await api.getProxyPosts();
        setChallengeDatas(challengeDatas);
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching challenge data',
        });
      }
    };

    void fetchChallengeDatas();
  }, [toasts]);

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
        challengeDatas.filter((data) => data._id !== challengeId),
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
          <Link to={`/scheduled-posts/challenge/${challengeData._id}`}>
            Edit
          </Link>
        );
      }

      case 'coach-post': {
        return (
          <Link to={`/scheduled-posts/coach-post/${challengeData._id}`}>
            Edit
          </Link>
        );
      }

      default: {
        return null;
      }
    }
  };

  return (
    <div>
      {challengeDatas
        .sort(
          (a, b) =>
            new Date(a.showDate).getTime() - new Date(b.showDate).getTime(),
        )
        .map((challengeData) => (
          <div key={challengeData._id} className="d-flex">
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
              {renderControls(challengeData)} |{' '}
              <a
                href="#"
                onClick={async () => {
                  await removeChallengeData(challengeData._id);
                }}
              >
                Delete
              </a>
            </div>
          </div>
        ))}
    </div>
  );
}
