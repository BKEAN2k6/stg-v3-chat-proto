import {useParams} from 'react-router-dom';
import CommunitySettings from './CommunitySettings.js';

export default function CommunitySettingsPage() {
  const {communityId} = useParams();

  if (!communityId) {
    return null;
  }

  return <CommunitySettings communityId={communityId} />;
}
