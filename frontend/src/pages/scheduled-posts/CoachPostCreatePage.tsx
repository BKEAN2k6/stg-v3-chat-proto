import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import api from '@client/ApiClient';
import {type CreateCoachPostRequest} from '@client/ApiTypes';
import CoachPostForm from './CoachPostForm.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function CoachPostCreatePage() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [challengeData, setChallengeData] = useState<CreateCoachPostRequest>({
    translations: {
      en: '',
      sv: '',
      fi: '',
    },
    strengths: [],
    images: [],
    showDate: new Date().toISOString(),
  });

  const onSave = async () => {
    setIsSaving(true);

    try {
      const showDate = new Date(challengeData.showDate);
      showDate.setUTCHours(7);
      await api.createCoachPost({
        ...challengeData,
        showDate: showDate.toISOString(),
      });
      navigate('/scheduled-posts');
    } catch {
      toasts.danger({
        header: 'Oops!',
        body: 'Something went wrong while creating the challenge data',
      });
    }

    setIsSaving(false);
  };

  const onUpdate = (updatedChallenge: CreateCoachPostRequest) => {
    setChallengeData((challengeData) => ({
      ...challengeData,
      ...updatedChallenge,
    }));
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Create Coach Post">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </PageTitle>
      <CoachPostForm challengeData={challengeData} onUpdate={onUpdate} />
    </div>
  );
}
