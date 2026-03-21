import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom';
import CoachPostForm from './CoachPostForm';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type CreateCoachPostRequest} from '@/api/ApiTypes';

export default function CoachPostEditPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const [challengeData, setChallengeData] = useState<CreateCoachPostRequest>();
  const {id} = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchChallengeData = async () => {
      try {
        const challengeData = await api.getCoachPost({id});
        setChallengeData({
          ...challengeData,
          images: challengeData.images.map(({_id}) => _id),
        });
      } catch {
        toasts.danger({
          header: 'Oops!',
          body: 'Something went wrong while fetching challenge data',
        });
      }
    };

    void fetchChallengeData();
  }, [id, toasts]);

  if (!challengeData) {
    return <div>Loading...</div>;
  }

  const onSave = async () => {
    if (!id) {
      return;
    }

    try {
      const showDate = new Date(challengeData.showDate);
      showDate.setUTCHours(7);
      await api.updateCoachPost(
        {id},
        {
          ...challengeData,
          showDate: showDate.toISOString(),
        },
      );
      navigate('/scheduled-posts');
      toasts.success({
        header: 'Success!',
        body: 'Challenge data updated successfully',
      });
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while updating challenge data',
      });
    }
  };

  const onUpdate = (updatedChallenge: CreateCoachPostRequest) => {
    setChallengeData(updatedChallenge);
  };

  return (
    <div>
      <h1>Edit Coach Post</h1>
      <CoachPostForm challengeData={challengeData} onUpdate={onUpdate} />
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}
