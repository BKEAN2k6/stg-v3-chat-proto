import {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {type GetCommunityStatsResponse} from '@/api/ApiTypes';
import {useCurrentUser} from '@/context/currentUserContext';

type MoodValue = 1 | 2 | 3 | 4 | 5;

const today = new Date().toISOString().split('T')[0];

const getLocallyStoredMoodData = (communityId: string, userId: string) => {
  const moodDataString: string = localStorage.getItem(
    `moodData_${communityId}_${userId}`,
  )!;
  return moodDataString
    ? (JSON.parse(moodDataString) as {date: string; mood: MoodValue})
    : undefined;
};

const setLocallyStoredMoodData = (
  communityId: string,
  userId: string,
  moodValue: MoodValue,
) => {
  const moodData = {
    date: today,
    mood: moodValue,
  };
  localStorage.setItem(
    `moodData_${communityId}_${userId}`,
    JSON.stringify(moodData),
  );
};

const moodPostedToday = (communityId: string, userId: string) => {
  const moodData = getLocallyStoredMoodData(communityId, userId);
  return moodData && moodData.date === today;
};

const moods: Array<{value: MoodValue; emoji: string}> = [
  {value: 5, emoji: '🤩'},
  {value: 4, emoji: '😊'},
  {value: 3, emoji: '😐'},
  {value: 2, emoji: '🙁'},
  {value: 1, emoji: '😣'},
];

const calculateMoodPercentages = (
  moods: Array<{
    mood: number;
    count: number;
  }>,
) => {
  let totalCount = 0;
  const newMoodPercentages: Record<number, number> = {};

  for (const {count} of moods) {
    totalCount += count;
  }

  for (const {mood, count} of moods) {
    const percentage = totalCount > 0 ? (count / totalCount) * 100 : 0;
    newMoodPercentages[mood] = Number.parseInt(`${percentage}`, 10);
  }

  return newMoodPercentages;
};

type Props = {
  readonly communityId: string;
  readonly communityStats?: GetCommunityStatsResponse;
};

export default function MoodMeter(props: Props) {
  const {_} = useLingui();
  const {communityId, communityStats} = props;
  const [selectedMood, setSelectedMood] = useState<MoodValue | undefined>();
  const [moodPercentages, setMoodPercentages] = useState<
    Record<number, number>
  >({});

  const {currentUser} = useCurrentUser();
  const userId = currentUser?._id;
  const toasts = useToasts();

  const handleMoodClick = async (moodValue: MoodValue) => {
    if (!userId) return;
    if (moodPostedToday(communityId, userId)) return;

    try {
      const moods = await api.createCommunityMood(
        {id: communityId},
        {mood: moodValue},
      );
      setLocallyStoredMoodData(communityId, userId, moodValue);
      setSelectedMood(moodValue);
      setMoodPercentages(calculateMoodPercentages(moods));
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while saving the mood`),
      });
    }
  };

  useEffect(() => {
    if (communityStats)
      setMoodPercentages(calculateMoodPercentages(communityStats.moodMeter));
  }, [communityStats]);

  useEffect(() => {
    if (!userId) return;
    const moodData = getLocallyStoredMoodData(communityId, userId);
    const savedMood =
      moodData && moodData.date === today ? moodData.mood : undefined;
    setSelectedMood(savedMood);
  }, [communityId, userId]);

  return (
    <div className="p-2 p-md-3 d-flex flex-column gap-3 border rounded">
      <h5 className="mb-0">
        <Trans>Mood-o-meter</Trans>
      </h5>
      <p className="mb-0">
        <Trans>How are you feeling today?</Trans>
      </p>
      <div className="d-flex flex-row justify-content-between gap-2">
        {moods.map((m) => (
          <div key={m.value} className="w-100 text-center">
            <Button
              disabled={selectedMood && selectedMood !== m.value}
              id={`mood-${m.value}`}
              variant={
                selectedMood === m.value ? 'primary' : 'outline-secondary'
              }
              name="mood"
              className="w-100"
              value={m.value}
              onClick={async () => handleMoodClick(m.value)}
            >
              <div style={{marginBottom: -3}}>{m.emoji}</div>
            </Button>
            {selectedMood && (
              <div className="mt-1">{moodPercentages[m.value] || 0}%</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
