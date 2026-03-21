import {useState} from 'react';
import {Button} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import CoachPostForm from './CoachPostForm';
import {useToasts} from '@/components/toasts';
import api from '@/api/ApiClient';
import {type CreateCoachPostRequest} from '@/api/ApiTypes';

export default function CoachPostCreatePage() {
  const toasts = useToasts();
  const navigate = useNavigate();
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
  };

  const onUpdate = (updatedChallenge: CreateCoachPostRequest) => {
    setChallengeData((challengeData) => ({
      ...challengeData,
      ...updatedChallenge,
    }));
  };

  return (
    <div>
      <h1>Create Coach Post</h1>
      <CoachPostForm challengeData={challengeData} onUpdate={onUpdate} />
      <Button onClick={onSave}>Save</Button>
    </div>
  );
}
