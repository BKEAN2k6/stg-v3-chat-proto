import React from 'react';
import {useLingui} from '@lingui/react';
import {
  type StrengthGroup,
  type GetPlayerQuizResponse,
  type LanguageCode,
} from '@client/ApiTypes.js';
import {
  strengthGroups,
  strengthSlugs,
  strengthSlugToGroup,
  strengthGroupTranslationMap,
  strengthTranslationMap,
  strengthGroupColorMap,
} from '@/helpers/strengths.js';
import BounsingBalls, {type BallData} from '@/components/ui/BounsingBalls.js';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type Properties = {
  readonly quiz: GetPlayerQuizResponse;
};

export default function ResultScreen({quiz}: Properties) {
  const {i18n} = useLingui();
  const language = i18n.locale as LanguageCode;

  const groupTotals = React.useMemo(() => {
    const totals = new Map<StrengthGroup, {earned: number; max: number}>();
    const addToGroup = (group: StrengthGroup, earned: number, max: number) => {
      const previous = totals.get(group) ?? {earned: 0, max: 0};
      previous.earned += earned;
      previous.max += max;
      totals.set(group, previous);
    };

    for (const q of quiz.questionSet.questions) {
      if (!q.strength) continue;
      const group = strengthSlugToGroup[q.strength];

      const ans = quiz.answers.find((a) => a.question === q.id);
      const selectedIds = new Set(ans?.choices ?? []);
      const earned = q.choices
        .filter((c) => selectedIds.has(c.id))
        .reduce((sum, c) => sum + (c.points || 0), 0);

      let max = q.multiSelect
        ? q.choices.reduce((s, c) => s + Math.max(0, c.points || 0), 0)
        : Math.max(...q.choices.map((c) => c.points || 0));
      max = Math.max(0, max);

      addToGroup(group, earned, max);
    }

    return totals;
  }, [quiz.questionSet.questions, quiz.answers]);

  const strengthsByGroup = React.useMemo(() => {
    const m = new Map<StrengthGroup, string[]>();
    for (const slug of strengthSlugs) {
      const g = strengthSlugToGroup[slug];
      if (!m.has(g)) m.set(g, []);
      m.get(g)!.push(strengthTranslationMap[slug][language]);
    }

    return m;
  }, [language]);

  const rows = strengthGroups
    .map((group) => {
      const t = groupTotals.get(group);
      const pct = t && t.max > 0 ? Math.round((t.earned / t.max) * 100) : 0;
      return {
        group,
        pct,
        earned: t?.earned ?? 0,
        max: t?.max ?? 0,
        color: strengthGroupColorMap[group]['500'],
      };
    })
    .filter((r) => r.max > 0)
    .sort((a, b) => b.pct - a.pct);

  const ballsData: BallData[] = rows.map((r) => ({
    id: String(r.group),
    label: strengthGroupTranslationMap[r.group][language],
    ballColor: r.color,
    percentage: r.pct,
  }));

  return (
    <>
      {/* Page wrapper that spans the viewport and stacks content vertically */}
      <div className="position-relative d-flex flex-column min-vh-100">
        {/* background */}
        <div
          className="position-fixed"
          aria-hidden="true"
          style={{
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'var(--primary-darker-1)',
          }}
        >
          <BounsingBalls data={ballsData} ballScale={2} textScale={0.7} />
        </div>

        {/* avatar fills all available vertical space */}
        <div
          className="flex-grow-1 d-flex align-items-center justify-content-center flex-column"
          style={{position: 'relative', zIndex: 1}}
        >
          <div
            className="flex-grow-1 mt-4 mt-md-5 mb-2"
            style={{
              aspectRatio: '1 / 1',
              maxWidth: 320,
              maxHeight: 320,
              borderRadius: '50%',
              border: `2px solid ${quiz.player.color}`,
              backgroundColor: quiz.player.color,
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
            aria-label="Player avatar animation"
          >
            <SimpleLottiePlayer
              autoplay
              loop
              src={`/animations/avatars/${quiz.player.avatar}.json`}
            />
          </div>
        </div>

        {quiz.player.nickname ? (
          <div
            className="text-center text-light mb-0 mb-md-2 fs-4 fs-md-2 fw-bold"
            style={{
              position: 'relative',
              zIndex: 1,
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
            }}
          >
            {quiz.player.nickname}
          </div>
        ) : null}

        {/* bottom section */}
        <section
          className="p-3 m-2 text-start"
          aria-label="Quiz Results by Strength Group"
          style={{
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(2px)',
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {rows.length === 0 ? (
            <p style={{color: '#555'}}>
              No scored questions mapped to strength groups yet.
            </p>
          ) : (
            <ul
              className="fs-5 gap-1 m-0"
              style={{
                listStyle: 'none',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {rows.map((r) => (
                <li
                  key={String(r.group)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    padding: '8px 10px',
                    border: '1px solid #eee',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.7)',
                    backdropFilter: 'blur(2px)',
                  }}
                >
                  <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: r.color,
                        display: 'inline-block',
                        flex: '0 0 12px',
                      }}
                    />
                    <span style={{fontWeight: 600}}>
                      {strengthGroupTranslationMap[r.group][language]}
                    </span>
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {r.pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      lineHeight: 1.25,
                      wordBreak: 'break-word',
                    }}
                  >
                    {strengthsByGroup.get(r.group)?.join(', ')}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
