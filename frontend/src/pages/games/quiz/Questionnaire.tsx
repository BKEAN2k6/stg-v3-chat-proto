import {useMemo, useState, useCallback, useRef, useLayoutEffect} from 'react';
import type {
  LanguageCode,
  GetQuestionSetResponse,
  StrengthSlug,
} from '@client/ApiTypes';
import {Button, Card, Stack, Form, Carousel} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {strengthColorMap, strengthTranslationMap} from '@/helpers/strengths.js';

function StrengthChart({
  data,
  language,
}: {
  readonly data: ReadonlyArray<{
    readonly strength: StrengthSlug;
    readonly percentage: number;
  }>;
  readonly language: LanguageCode;
}) {
  const chartHeight = 140; // px: bar track height
  const barWidth = 120; // px: bar width
  const labelBoxHeight = 40; // px: keeps row bottoms aligned
  const gap = 12; // px: space between bars

  return (
    <div
      className="d-flex flex-wrap"
      style={{
        gap,
        alignItems: 'flex-end', // bottoms line up within each row
      }}
    >
      {data.map((row) => (
        <div
          key={row.strength}
          className="d-flex flex-column align-items-center"
          style={{
            width: barWidth + 8, // little extra for label truncation
            height: chartHeight + labelBoxHeight,
            justifyContent: 'flex-end',
          }}
        >
          {/* Track */}
          <div
            className="position-relative"
            style={{
              height: chartHeight,
              width: barWidth,
              backgroundColor: 'rgba(0,0,0,0.08)',
              borderRadius: '0.25rem',
              overflow: 'hidden',
            }}
          >
            {/* Fill (anchored to bottom) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: `${Math.max(0, Math.min(100, row.percentage))}%`,
                backgroundColor: strengthColorMap[row.strength][500],
                borderRadius: '0.25rem 0.25rem 0 0',
                transition: 'height 0.3s ease',
              }}
            />
          </div>

          {/* Labels (fixed box height for tidy rows) */}
          <div
            className="mt-2 text-center d-flex flex-column justify-content-start"
            style={{height: labelBoxHeight, width: barWidth + 8}}
          >
            <div className="small text-truncate">
              {strengthTranslationMap[row.strength][language]}
            </div>
            <div className="fw-bold">{row.percentage.toFixed(0)}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const slideWidth = 1280;
const slideHeight = 720;

export function SlideFrame({children}: {readonly children: React.ReactNode}) {
  const sizerReference = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({w: 0, h: 0});

  useLayoutEffect(() => {
    const element = sizerReference.current;
    if (!element) return;
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) setBox({w: cr.width, h: cr.height});
    });
    ro.observe(element);
    return () => {
      ro.disconnect();
    };
  }, []);

  const scale = useMemo(() => {
    if (!box.w || !box.h) return 1;
    return Math.min(box.w / slideWidth, box.h / slideHeight);
  }, [box.w, box.h]);

  return (
    <div style={{position: 'relative', width: '100%'}}>
      <div
        ref={sizerReference}
        style={{
          width: '100%',
          aspectRatio: `${slideWidth} / ${slideHeight}`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: slideWidth,
          height: slideHeight,
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function Questionnaire({
  questionSet,
}: {
  readonly questionSet: GetQuestionSetResponse;
}) {
  const {i18n} = useLingui();
  const language = i18n.locale as LanguageCode;

  // NEW: intro screen state
  const [started, setStarted] = useState<boolean>(false);

  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, Set<string>>>({});

  const total = questionSet.questions.length;
  const isResults = step === total;
  console.log({isResults, step, total, started});

  const tPick = useCallback(
    (xs: Array<{language: LanguageCode; text: string}>) => {
      if (!xs || xs.length === 0) return '';
      if (language) {
        const m = xs.find((x) => x.language === language);
        if (m) return m.text;
      }

      return xs[0].text;
    },
    [language],
  );

  const title = useMemo(() => tPick(questionSet.title), [questionSet, tPick]);

  const goPrevious = useCallback(() => {
    setStep((s) => Math.max(0, s - 1));
  }, []);
  const goNext = useCallback(() => {
    setStep((s) => Math.min(total, s + 1));
  }, [total]);
  const goTo = useCallback(
    (index: number) => {
      setStep(() => Math.min(Math.max(index, 0), total));
    },
    [total],
  );

  const results = useMemo(() => {
    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    // strength -> { points, max, questions }
    const strengthMap = new Map<
      string,
      {points: number; max: number; questions: number}
    >();

    const perQuestion = questionSet.questions.map((question) => {
      const selected = answers[question.id] ?? new Set<string>();

      // points from current selection
      let pointsFromSelection = 0;
      for (const c of question.choices) {
        if (selected.has(c.id)) pointsFromSelection += c.points;
      }

      score += pointsFromSelection;

      // determine per-question maximum achievable points
      const questionMax = question.multiSelect
        ? question.choices.reduce((sum, c) => sum + Math.max(c.points, 0), 0)
        : Math.max(...question.choices.map((c) => c.points));

      // correctness (unchanged)
      const correctChoiceIds = new Set(
        question.choices.filter((c) => c.isCorrect).map((c) => c.id),
      );
      let isCorrect = true;
      if (selected.size === correctChoiceIds.size) {
        for (const id of selected)
          if (!correctChoiceIds.has(id)) isCorrect = false;
      } else {
        isCorrect = false;
      }

      if (isCorrect) correctCount += 1;
      else wrongCount += 1;

      // ---- NEW: aggregate by strength (ignore undefined / null / empty) ----
      const strength = (question as any).strength as string | undefined;
      if (strength && strength.trim().length > 0) {
        const current = strengthMap.get(strength) ?? {
          points: 0,
          max: 0,
          questions: 0,
        };
        current.points += pointsFromSelection;
        current.max += questionMax;
        current.questions += 1;
        strengthMap.set(strength, current);
      }

      return {
        questionId: question.id,
        isCorrect,
        selected: [...selected],
        correct: [...correctChoiceIds],
        pointsFromSelection,
      };
    });

    // turn the map into a sorted array with percentage
    const perStrength = [...strengthMap.entries()]
      .map(([strength, v]) => ({
        strength: strength as StrengthSlug,
        points: v.points,
        max: v.max,
        percentage: v.max > 0 ? (v.points / v.max) * 100 : 0,
        questions: v.questions,
      }))
      // optional: sort descending by percentage
      .sort((a, b) => b.percentage - a.percentage);

    return {score, correctCount, wrongCount, perQuestion, perStrength};
  }, [answers, questionSet.questions]);

  // RESULTS
  if (isResults) {
    return (
      <Card className="border mb-3">
        <SlideFrame>
          <Card.Body className="d-flex flex-column">
            <Card.Title as="h2" className="mb-3">
              Reusults: {title}
            </Card.Title>

            <StrengthChart data={results.perStrength} language={language} />

            <Stack direction="horizontal" gap={2}>
              <Button
                variant="outline-secondary"
                onClick={() => {
                  setStarted(false);
                  setAnswers({});
                  goTo(0);
                }}
              >
                Restart
              </Button>
            </Stack>
          </Card.Body>
        </SlideFrame>
      </Card>
    );
  }

  return (
    <Card>
      <SlideFrame>
        <div
          className="p-4"
          style={{
            width: 1280,
            height: 720,
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--primary)',
          }}
        >
          <Stack direction="horizontal" className="border-bottom mb-5" gap={3}>
            <div className="me-auto text-light fw-bolder fs-1">{title}</div>
            <div
              className="text-light text-end align-self-start"
              style={{width: 100}}
            >
              {Math.min(step + 1, total)} / {total}
            </div>
          </Stack>

          <Carousel
            touch
            activeIndex={Math.min(step, total - 1)}
            controls={false}
            indicators={false}
            wrap={false}
            interval={null}
            keyboard={false}
            className="flex-grow-1 d-flex"
            onSelect={(i) => {
              setStep(i);
            }}
          >
            {questionSet.questions.map((q) => (
              <Carousel.Item key={q.id}>
                <div className="mb-3 text-light fs-2" style={{height: '4em'}}>
                  {tPick(q.instruction)}
                </div>

                <Stack gap={2} className="mb-4">
                  {q.choices.map((c) => {
                    const checked = (answers[q.id] ?? new Set<string>()).has(
                      c.id,
                    );
                    const inputId = `${q.id}-${c.id}`;
                    return (
                      <Form.Check
                        key={c.id}
                        inline
                        id={inputId}
                        type={q.multiSelect ? 'checkbox' : 'radio'}
                        className={`border rounded p-2 mx-0 d-flex align-items-center gap-2 text-dark ${checked ? 'bg-secondary' : 'bg-light'}`}
                      >
                        <Form.Check.Input
                          type={q.multiSelect ? 'checkbox' : 'radio'}
                          name={q.id}
                          checked={checked}
                          className="m-2"
                          style={{
                            width: 20,
                            height: 20,
                          }}
                          onChange={() => {
                            setAnswers((previous) => {
                              const existing = new Set(previous[q.id] ?? []);
                              if (q.multiSelect) {
                                if (existing.has(c.id)) {
                                  existing.delete(c.id);
                                } else {
                                  existing.add(c.id);
                                }
                              } else {
                                existing.clear();
                                existing.add(c.id);
                              }

                              return {...previous, [q.id]: existing};
                            });
                            if (!q.multiSelect) setTimeout(goNext, 300);
                          }}
                        />
                        <Form.Check.Label className="mb-0 flex-grow-1 fs-3">
                          {tPick(c.label)}
                        </Form.Check.Label>
                      </Form.Check>
                    );
                  })}
                </Stack>
              </Carousel.Item>
            ))}
          </Carousel>

          {/* FOOTER: pinned to bottom via mt-auto */}
          <div className="mt-auto">
            <Stack direction="horizontal" className="justify-content-between">
              <Button
                variant="white"
                disabled={step === 0}
                style={{width: 100}}
                onClick={goPrevious}
              >
                Back
              </Button>

              {step < total - 1 ? (
                <Button variant="white" style={{width: 100}} onClick={goNext}>
                  Next
                </Button>
              ) : (
                <Button
                  style={{width: 100}}
                  variant="success"
                  onClick={() => {
                    goTo(total);
                  }}
                >
                  See results
                </Button>
              )}
            </Stack>
          </div>
        </div>
      </SlideFrame>
    </Card>
  );
}
