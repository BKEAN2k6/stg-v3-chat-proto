import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import api from '@client/ApiClient';
import {type CreateChallengeRequest} from '@client/ApiTypes';
import {ChallengeForm} from './ChallengeForm.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';

export default function ChallengeCreatePage() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [challengeData, setChallengeData] = useState<CreateChallengeRequest>({
    translations: {
      en: '',
      sv: '',
      fi: '',
    },
    theme: 'default',
    strength: 'love',
    showDate: new Date().toISOString(),
  });

  const onSave = async () => {
    setIsSaving(true);

    try {
      const showDate = new Date(challengeData.showDate);
      showDate.setUTCHours(7);
      await api.createChallenge({
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

  const onUpdate = (updatedChallenge: Partial<CreateChallengeRequest>) => {
    setChallengeData((challengeData) => ({
      ...challengeData,
      ...updatedChallenge,
    }));
  };

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title="Create Challenge">
        <Button disabled={isSaving} onClick={onSave}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </PageTitle>
      <ChallengeForm challengeData={challengeData} onUpdate={onUpdate} />
    </div>
  );
}
