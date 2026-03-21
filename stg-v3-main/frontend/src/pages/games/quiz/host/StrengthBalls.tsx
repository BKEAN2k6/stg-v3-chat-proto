/* eslint-disable max-depth */
/* eslint-disable complexity */
import {useMemo} from 'react';
import {useLingui} from '@lingui/react';
import type {
  StrengthSlug,
  GetHostQuizResponse,
  LanguageCode,
} from '@client/ApiTypes';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';
import BounsingBalls, {type BallData} from '@/components/ui/BounsingBalls.js';

type StrengthDatum = {
  strength: StrengthSlug;
  percentage: number;
};

function colorFor(strength: StrengthSlug): string {
  return strengthColorMap?.[strength][300];
}

function labelFor(strength: StrengthSlug, language: LanguageCode): string {
  return strengthTranslationMap?.[strength]?.[language] ?? String(strength);
}

function imageFor(strength: StrengthSlug): string {
  return `/images/strengths/${encodeURIComponent(String(strength))}.png`;
}

export default function StrengthBalls({
  quiz,
}: {
  readonly quiz: GetHostQuizResponse;
}) {
  const {i18n} = useLingui();
  const language = i18n.locale as LanguageCode;

  const data = useMemo<StrengthDatum[]>(() => {
    const totalPlayers = quiz.players?.length ?? 0;
    const selections = new Map<string, Map<string, Set<string>>>();

    for (const a of quiz.answers ?? []) {
      if (!a?.question || !a?.player || !Array.isArray(a?.choices)) continue;

      let byPlayer = selections.get(a.question);
      if (!byPlayer) {
        byPlayer = new Map<string, Set<string>>();
        selections.set(a.question, byPlayer);
      }

      let set = byPlayer.get(a.player);
      if (!set) {
        set = new Set<string>();
        byPlayer.set(a.player, set);
      }

      for (const choiceId of a.choices) {
        if (typeof choiceId === 'string' && choiceId) set.add(choiceId);
      }
    }

    type Agg = {
      points: number;
      max: number;
      questions: number;
      answers: number;
    };

    const strengthMap = new Map<string, Agg>();

    for (const q of quiz.questionSet.questions) {
      const qStrength = (q.strength ?? '').toString().trim();
      if (!qStrength) continue;

      const qSelByPlayer =
        selections.get(q.id) ?? new Map<string, Set<string>>();

      const answeredPlayers = qSelByPlayer.size;
      if (totalPlayers <= 0 || answeredPlayers !== totalPlayers) continue;

      const positiveChoices = q.choices.filter((c) => (c.points ?? 0) > 0);
      const perPlayerMax = q.multiSelect
        ? positiveChoices.reduce((sum, c) => sum + (c.points ?? 0), 0)
        : Math.max(0, ...q.choices.map((c) => c.points ?? 0));

      if (perPlayerMax <= 0) continue;

      let sumPointsOverPlayers = 0;

      for (const [, selected] of qSelByPlayer) {
        let playerPoints = 0;

        if (q.multiSelect) {
          for (const c of q.choices) {
            if (!selected.has(c.id)) continue;
            playerPoints += c.points ?? 0;
          }
        } else {
          const picked = q.choices.find((c) => selected.has(c.id));
          if (picked) playerPoints += picked.points ?? 0;
        }

        if (playerPoints > perPlayerMax) playerPoints = perPlayerMax;

        sumPointsOverPlayers += Math.max(0, playerPoints);
      }

      const qGroupMax = perPlayerMax * totalPlayers;

      const current = strengthMap.get(qStrength) ?? {
        points: 0,
        max: 0,
        questions: 0,
        answers: 0,
      };
      current.points += sumPointsOverPlayers;
      current.max += qGroupMax;
      current.questions += 1;
      current.answers += answeredPlayers;
      strengthMap.set(qStrength, current);
    }

    const rows: StrengthDatum[] = [...strengthMap.entries()]
      .filter(([, v]) => v.answers > 0 && v.max > 0)
      .map(([strength, v]) => ({
        strength: strength as StrengthSlug,
        percentage: Math.max(0, Math.min(100, (v.points / v.max) * 100)),
      }))
      .sort((a, b) => b.percentage - a.percentage);

    return rows;
  }, [quiz]);

  const balls = useMemo<BallData[]>(() => {
    return data.map(({strength, percentage}) => ({
      id: String(strength),
      label: labelFor(strength, language),
      ballColor: strengthColorMap[strength][300] ?? colorFor(strength),
      borderColor: strengthColorMap[strength][500],
      image: imageFor(strength),
      percentage,
    }));
  }, [data, language]);

  if (balls.length === 0) {
    return null;
  }

  return <BounsingBalls data={balls} ballScale={1.5} textScale={1} />;
}
