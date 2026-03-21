import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {ChallengeForm} from './ChallengeForm';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type ChallengeData} from '@/api/ApiTypes';

export default function ChallengeCreatePage() {
  const toasts = useToasts();
  const navigate = useNavigate();
  const [challengeData, setChallengeData] = useState<ChallengeData>({
    _id: '',
    translations: {
      en: '',
      sv: '',
      fi: '',
    },
    theme: 'default',
    postType: 'challenge',
    strength: 'love',
    showDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const onSave = async () => {
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
  };

  const onUpdate = (updatedChallenge: Partial<ChallengeData>) => {
    setChallengeData((challengeData) => ({
      ...challengeData,
      ...updatedChallenge,
    }));
  };

  return (
    <div>
      <h1>Create Challenge</h1>
      <ChallengeForm challengeData={challengeData} onUpdate={onUpdate} />
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}
