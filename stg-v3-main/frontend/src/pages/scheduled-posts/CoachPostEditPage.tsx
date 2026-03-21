import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate, useParams} from 'react-router-dom';
import api from '@client/ApiClient';
import {type CreateCoachPostRequest} from '@client/ApiTypes';
import CoachPostForm from './CoachPostForm.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function CoachPostEditPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const [isSaving, setIsSaving] = useState(false);
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
          images: challengeData.images.map(({id}) => id),
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

    setIsSaving(true);

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

    setIsSaving(false);
  };

  const onUpdate = (updatedChallenge: CreateCoachPostRequest) => {
    setChallengeData(updatedChallenge);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Edit Coach Post">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </PageTitle>
      <CoachPostForm challengeData={challengeData} onUpdate={onUpdate} />
    </div>
  );
}
