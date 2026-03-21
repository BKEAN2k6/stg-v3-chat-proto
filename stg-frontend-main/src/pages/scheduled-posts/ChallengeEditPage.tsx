import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import {ChallengeForm} from './ChallengeForm';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type ChallengeData} from '@/api/ApiTypes';

export default function ChallengeEditPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const [challengeData, setChallengeData] = useState<ChallengeData>();
  const {id} = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchChallengeData = async () => {
      try {
        const challengeData = await api.getChallenge({id});
        setChallengeData(challengeData);
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
      await api.updateChallenge(
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

  const onUpdate = (updatedChallenge: ChallengeData) => {
    setChallengeData(updatedChallenge);
  };

  return (
    <div>
      <h1>Edit Challenge</h1>
      <ChallengeForm challengeData={challengeData} onUpdate={onUpdate} />
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}
