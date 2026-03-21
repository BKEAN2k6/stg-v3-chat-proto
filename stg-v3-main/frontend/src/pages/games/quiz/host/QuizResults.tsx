import {type GetHostQuizResponse} from '@client/ApiTypes';
import {Container, Table} from 'react-bootstrap';
import {Trans} from '@lingui/react/macro';

type Properties = {
  readonly quiz: GetHostQuizResponse;
};

type PlayerStats = {
  id: string;
  nickname: string;
  color: string;
  correct: number;
  wrong: number;
  total: number;
  points: number;
};

function getQuizSummary(data: GetHostQuizResponse): PlayerStats[] {
  const correctChoicesMap = new Map<string, Set<string>>();
  const choicePointsMap = new Map<string, Map<string, number>>();

  for (const q of data.questionSet.questions) {
    const correctSet = new Set<string>(
      q.choices.filter((c) => c.isCorrect).map((c) => c.id),
    );
    correctChoicesMap.set(q.id, correctSet);

    const pointsForChoices = new Map<string, number>();
    for (const c of q.choices) {
      pointsForChoices.set(c.id, c.points);
    }

    choicePointsMap.set(q.id, pointsForChoices);
  }

  const playerStats = new Map<string, PlayerStats>();
  for (const p of data.players) {
    playerStats.set(p.id, {
      id: p.id,
      nickname: p.nickname,
      color: p.color,
      correct: 0,
      wrong: 0,
      total: 0,
      points: 0,
    });
  }

  for (const ans of data.answers) {
    const stats = playerStats.get(ans.player);
    if (!stats) continue;

    stats.total += 1;

    const correctSet = correctChoicesMap.get(ans.question) ?? new Set<string>();
    const pointsForQuestion = choicePointsMap.get(ans.question);
    const selectedChoices = ans.choices ?? [];
    let questionPoints = 0;
    for (const choiceId of selectedChoices) {
      questionPoints += pointsForQuestion?.get(choiceId) ?? 0;
    }

    stats.points += questionPoints;

    const selectedSet = new Set<string>(selectedChoices);
    const isExactMatch =
      selectedSet.size === correctSet.size &&
      [...selectedSet].every((id) => correctSet.has(id));

    if (isExactMatch) {
      stats.correct += 1;
    } else {
      stats.wrong += 1;
    }
  }

  return [...playerStats.values()].sort((a, b) => b.points - a.points);
}

export default function QuizResults({quiz}: Properties) {
  const summary = getQuizSummary(quiz);
  const topThreePlayers = summary.slice(0, 3);

  return (
    <Container className="py-4">
      <h2 className="text-center">
        <Trans>Quiz Winner</Trans>
      </h2>
      <h1 className="text-center">{topThreePlayers[0]?.nickname || 'N/A'}</h1>

      <h2 className="mt-5 text-center">
        <Trans>Scores</Trans>
      </h2>

      <Table striped>
        <thead>
          <tr>
            <th>
              <Trans>Player</Trans>
            </th>
            <th className="text-center">
              <Trans>Answered</Trans>
            </th>
            <th className="text-center">
              <Trans>Correct</Trans>
            </th>
            <th className="text-end">
              <Trans>Score</Trans>
            </th>
          </tr>
        </thead>
        <tbody>
          {topThreePlayers.map((player) => (
            <tr key={player.id} style={{backgroundColor: player.color}}>
              <td>{player.nickname}</td>
              <td className="text-center">{player.total}</td>
              <td className="text-center">{player.correct}</td>
              <td className="text-end fw-bold">{player.points}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
