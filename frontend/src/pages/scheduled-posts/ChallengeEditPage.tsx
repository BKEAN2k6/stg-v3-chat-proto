import {useState, useEffect} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {type CreateChallengeRequest} from '@client/ApiTypes';
import {ChallengeForm} from './ChallengeForm.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ChallengeEditPage() {
  const navigate = useNavigate();
  const toasts = useToasts();
  const [challengeData, setChallengeData] = useState<CreateChallengeRequest>();
  const [isSaving, setIsSaving] = useState(false);
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

    setIsSaving(true);

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

    setIsSaving(false);
  };

  const onUpdate = (updatedChallenge: CreateChallengeRequest) => {
    setChallengeData(updatedChallenge);
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Edit Challenge">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </PageTitle>
      <ChallengeForm challengeData={challengeData} onUpdate={onUpdate} />
    </div>
  );
}
