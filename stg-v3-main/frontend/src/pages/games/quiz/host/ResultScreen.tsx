/* eslint-disable complexity */
import {
  useMemo,
  useLayoutEffect,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import type {
  StrengthSlug,
  GetHostQuizResponse,
  StrengthGroup,
} from '@client/ApiTypes';
import {useLingui} from '@lingui/react';
import {Trans} from '@lingui/react/macro';
import AnimatedBar from './AnimatedBar.js';
import BalloonFrame from './BalloonFrame.js';
import {
  strengthColorMap,
  strengthTranslationMap,
  strengthSlugToGroup,
  strengthGroupTranslationMap,
  strengthGroups,
} from '@/helpers/strengths.js';

type StrengthDatum = {strength: StrengthSlug; percentage: number};
type Properties = {readonly quiz: GetHostQuizResponse};

const calculateMultiSelectPoints = (
  choices: Array<{id: string; points?: number | undefined}>,
  selected: Set<string>,
) => {
  let points = 0;
  for (const choice of choices) {
    if (!selected.has(choice.id)) continue;
    const value =
      typeof choice.points === 'number' && choice.points > 0
        ? choice.points
        : 0;
    points += value;
  }

  return points;
};

function useResizeObserverSize<T extends HTMLElement>(
  // eslint-disable-next-line @typescript-eslint/no-restricted-types
  reference: React.RefObject<T | null>,
) {
  const [size, setSize] = useState({w: 0, h: 0});
  useLayoutEffect(() => {
    const element = reference.current;
    if (!element) return;
    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      setSize({
        w: (r?.width ?? element.clientWidth) || 0,
        h: (r?.height ?? element.clientHeight) || 0,
      });
    });
    ro.observe(element);
    return () => {
      ro.disconnect();
    };
  }, [reference]);
  return size;
}

function GroupTile({
  entry,
  resetKey,
  strengthLabel,
  groupLabel,
  baseDelayMs = 0,
  globalBarWidth,
  onComputedBarWidth,
}: {
  readonly entry: {
    group: StrengthGroup;
    pct: number;
    items: Array<{strength: StrengthSlug; percentage: number}>;
  };
  readonly resetKey: string;
  readonly strengthLabel: (s: StrengthSlug) => string;
  readonly groupLabel: (g: StrengthGroup) => string;
  readonly baseDelayMs?: number;
  readonly globalBarWidth?: number;
  readonly onComputedBarWidth?: (group: StrengthGroup, width: number) => void;
}) {
  const gap = 8;
  const minWidth = 30;
  const labelBlockHeight = 50;
  const labelBlockVerticalGap = 8;

  const rowReference = useRef<HTMLDivElement>(null);
  const {w: rowWidth, h: rowHeight} = useResizeObserverSize(rowReference);

  const {group, pct, items} = entry;
  const count = items.length;

  const localBarWidth =
    count > 0
      ? Math.max(minWidth, Math.floor((rowWidth - (count - 1) * gap) / count))
      : 0;

  useEffect(() => {
    if (onComputedBarWidth && localBarWidth > 0) {
      onComputedBarWidth(group, localBarWidth);
    }
  }, [group, localBarWidth, onComputedBarWidth]);

  const barWidth =
    globalBarWidth && globalBarWidth > 0 ? globalBarWidth : localBarWidth;

  const dynamicBarHeight = Math.max(
    24,
    rowHeight - labelBlockHeight - labelBlockVerticalGap,
  );

  return (
    <section
      key={String(group)}
      style={{
        minHeight: 0,
        borderRadius: 12,
        border: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        background: 'white',
      }}
    >
      <div
        className="d-flex align-items-baseline justify-content-center gap-2"
        style={{marginBottom: 8}}
      >
        <h2 className="m-0 text-center" style={{fontSize: '1.25rem'}}>
          {groupLabel(group)}
        </h2>
        <span
          className="fw-bold"
          style={{fontSize: '1.25rem', fontVariantNumeric: 'tabular-nums'}}
          aria-label="Group percentage"
        >
          {pct}%
        </span>
      </div>

      <div
        ref={rowReference}
        style={{
          display: 'flex',
          gap,
          alignItems: 'flex-end',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
        }}
      >
        {items.map((row, i) => {
          const track = strengthColorMap?.[row.strength]?.[100];
          const fill = strengthColorMap?.[row.strength]?.[500];
          const label = strengthLabel(row.strength);

          return (
            <div
              key={row.strength}
              style={{
                width: barWidth,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                minHeight: 0,
              }}
            >
              <AnimatedBar
                percentage={row.percentage}
                trackColor={track}
                fillColor={fill}
                heightPx={dynamicBarHeight}
                widthPx={barWidth}
                delayMs={baseDelayMs + i * 90}
                resetKey={resetKey}
              >
                <img
                  className="rounded-circle position-absolute"
                  src={`/images/strengths/${row.strength}.png`}
                  alt={row.strength}
                  style={{
                    width: barWidth * 0.9,
                    height: barWidth * 0.9,
                  }}
                />
              </AnimatedBar>

              <div
                className="mt-2 text-center d-flex flex-column justify-content-start"
                style={{height: labelBlockHeight, width: barWidth + 8}}
              >
                <div
                  style={{
                    fontSize: 14,
                  }}
                  className="fw-bold"
                >
                  {Math.round(row.percentage)}%
                </div>
                <div
                  style={{
                    fontSize: 12,
                  }}
                  className="text-wrap"
                >
                  {label}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{height: 4}} />
    </section>
  );
}

export default function ResultScreen({quiz}: Properties) {
  const {i18n} = useLingui();

  const strengthLabel = (slug: StrengthSlug): string => {
    const langMap = strengthTranslationMap?.[slug];
    if (!langMap) return slug;
    const candidate = i18n.locale;
    // eslint-disable-next-line prefer-object-has-own
    if (candidate && Object.prototype.hasOwnProperty.call(langMap, candidate)) {
      return (langMap as Record<string, string>)[candidate];
    }

    const keys = Object.keys(langMap);
    return keys.length > 0
      ? (langMap as Record<string, string>)[keys[0]]
      : slug;
  };

  const groupLabel = (group: StrengthGroup): string => {
    const langMap = strengthGroupTranslationMap?.[group];
    if (!langMap) return String(group);
    const candidate = i18n.locale;
    // eslint-disable-next-line prefer-object-has-own
    if (candidate && Object.prototype.hasOwnProperty.call(langMap, candidate)) {
      return (langMap as Record<string, string>)[candidate];
    }

    const keys = Object.keys(langMap);
    return keys.length > 0
      ? (langMap as Record<string, string>)[keys[0]]
      : String(group);
  };

  const {rows: data, groupTotals} = useMemo<{
    rows: StrengthDatum[];
    groupTotals: Map<StrengthGroup, {earned: number; max: number; pct: number}>;
  }>(() => {
    const selections = new Map<string, Map<string, Set<string>>>();
    for (const a of quiz.answers ?? []) {
      const questionId = a.question;
      const playerId = a.player;
      const picked = a.choices;
      if (!questionId || !playerId || !Array.isArray(picked)) continue;
      let byPlayer = selections.get(questionId);
      if (!byPlayer) {
        byPlayer = new Map<string, Set<string>>();
        selections.set(questionId, byPlayer);
      }

      let set = byPlayer.get(playerId);
      if (!set) {
        set = new Set<string>();
        byPlayer.set(playerId, set);
      }

      for (const choiceId of picked) {
        if (typeof choiceId === 'string' && choiceId) set.add(choiceId);
      }
    }

    const strengthMap = new Map<
      string,
      {sumPoints: number; sumMax: number; answers: number}
    >();
    const groupMap = new Map<StrengthGroup, {earned: number; max: number}>();

    for (const q of quiz.questionSet?.questions ?? []) {
      const qStrengthRaw = q.strength;
      const qStrength =
        typeof qStrengthRaw === 'string' ? qStrengthRaw.trim() : '';
      if (!q.id || !qStrength) continue;

      const qSelByPlayer =
        selections.get(q.id) ?? new Map<string, Set<string>>();

      const positivePoints = q.choices
        .map((c) => (typeof c.points === 'number' ? c.points : 0))
        .filter((p) => p > 0);

      const perPlayerMax = q.multiSelect
        ? positivePoints.reduce((a, b) => a + b, 0)
        : positivePoints.length > 0
          ? Math.max(...positivePoints)
          : 0;

      let sumPointsOverPlayers = 0;

      for (const [, selected] of qSelByPlayer) {
        if (q.multiSelect) {
          sumPointsOverPlayers += calculateMultiSelectPoints(
            q.choices,
            selected,
          );
          continue;
        }

        const firstId = selected.values().next().value;
        if (!firstId) continue;
        const picked = q.choices.find((choice) => choice.id === firstId);
        const pickedPoints =
          picked && typeof picked.points === 'number' && picked.points > 0
            ? picked.points
            : 0;
        sumPointsOverPlayers += pickedPoints;
      }

      const answeredPlayers = qSelByPlayer.size;
      const qMax = perPlayerMax * answeredPlayers;

      const sCurrent = strengthMap.get(qStrength) ?? {
        sumPoints: 0,
        sumMax: 0,
        answers: 0,
      };
      sCurrent.sumPoints += sumPointsOverPlayers;
      sCurrent.sumMax += qMax;
      sCurrent.answers += answeredPlayers;
      strengthMap.set(qStrength, sCurrent);

      const g = strengthSlugToGroup[qStrength as StrengthSlug];
      const gCurrent = groupMap.get(g) ?? {earned: 0, max: 0};
      gCurrent.earned += sumPointsOverPlayers;
      gCurrent.max += qMax;
      groupMap.set(g, gCurrent);
    }

    const rows: StrengthDatum[] = [...strengthMap.entries()]
      .filter(([, v]) => v.answers > 0 && v.sumMax > 0)
      .map(([strength, v]) => {
        const raw = (v.sumPoints / v.sumMax) * 100;
        const pct = Number.isFinite(raw) ? Math.max(0, Math.min(100, raw)) : 0;
        return {strength: strength as StrengthSlug, percentage: pct};
      })
      .sort((a, b) => b.percentage - a.percentage);

    const finalizedGroupMap = new Map<
      StrengthGroup,
      {earned: number; max: number; pct: number}
    >();
    for (const [g, {earned, max}] of groupMap.entries()) {
      const pct =
        max > 0 && Number.isFinite(earned / max)
          ? Math.max(0, Math.min(100, Math.round((earned / max) * 100)))
          : 0;
      finalizedGroupMap.set(g, {earned, max, pct});
    }

    return {rows, groupTotals: finalizedGroupMap};
  }, [quiz]);

  const groupedData = useMemo(() => {
    const buckets = new Map<StrengthGroup, StrengthDatum[]>();
    for (const row of data) {
      const g = strengthSlugToGroup[row.strength];
      if (!buckets.has(g)) buckets.set(g, []);
      buckets.get(g)!.push(row);
    }

    return buckets;
  }, [data]);

  const groupsWithPct = useMemo(() => {
    const array = strengthGroups
      .map((g) => ({
        group: g,
        pct: groupTotals.get(g)?.pct ?? 0,
        items: groupedData.get(g) ?? [],
      }))
      .filter((x) => x.items.length > 0);

    array.sort(
      (a, b) =>
        b.pct - a.pct ||
        strengthGroups.indexOf(a.group) - strengthGroups.indexOf(b.group),
    );

    return array;
  }, [groupTotals, groupedData]);

  const resetKey = `${Array.isArray(quiz.answers) ? quiz.answers.length : 0}-${Array.isArray(quiz.questionSet?.questions) ? quiz.questionSet.questions.length : 0}`;

  const minWidth = 30;
  const [tileWidths, setTileWidths] = useState<Record<string, number>>({});

  const handleComputedBarWidth = useCallback(
    (group: StrengthGroup, width: number) => {
      setTileWidths((previous) => {
        const key = String(group);
        if (previous[key] === width) return previous;
        return {...previous, [key]: width};
      });
    },
    [],
  );

  const globalBarWidth = useMemo(() => {
    const values = Object.values(tileWidths).filter((v) => v > 0);
    if (values.length === 0) return 0;
    return Math.max(minWidth, Math.min(...values));
  }, [tileWidths]);

  if ((data?.length ?? 0) === 0) {
    return null;
  }

  return (
    <BalloonFrame>
      <div className="bg-white h-100 d-flex flex-column rounded">
        <div
          style={{
            padding: 8,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{minHeight: 0, height: '20%'}}
          >
            <h1 className="text-center">
              <Trans>Group Results</Trans>
            </h1>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: 'repeat(2, 1fr)',
              gap: 12,
              alignItems: 'stretch',
              flex: 1,
              minHeight: 0,
            }}
          >
            {groupsWithPct.map((entry, index) => {
              if (entry.items.length === 0) {
                return (
                  <section
                    key={entry.group}
                    style={{
                      minHeight: 0,
                      borderRadius: 12,
                      border: '1px dashed rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'white',
                    }}
                  >
                    <span className="text-muted" style={{opacity: 0.6}}>
                      <Trans>No data</Trans>
                    </span>
                  </section>
                );
              }

              return (
                <GroupTile
                  key={String(entry.group)}
                  entry={entry}
                  resetKey={resetKey}
                  strengthLabel={strengthLabel}
                  groupLabel={groupLabel}
                  baseDelayMs={index * 300}
                  globalBarWidth={globalBarWidth}
                  onComputedBarWidth={handleComputedBarWidth}
                />
              );
            })}
          </div>
        </div>
      </div>
    </BalloonFrame>
  );
}
