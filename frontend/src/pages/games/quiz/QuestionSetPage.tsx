import {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom'; // as requested
import api from '@client/ApiClient';
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Spinner,
  Tab,
  Tabs,
} from 'react-bootstrap';
import {
  type LanguageCode,
  type GetQuestionSetResponse,
  type StrengthSlug,
} from '@client/ApiTypes';
import {ArrowDown, ArrowUp} from 'react-bootstrap-icons';
import {JsonEditor} from 'json-edit-react';
import Questionnaire from './Questionnaire.js';
import {SingleStrengthSelectWithUndefined} from './StrengthSelect.js';
import PageTitle from '@/components/ui/PageTitle.js';

const generateTemporaryId = () =>
  `new-${Math.random().toString(36).slice(2, 9)}`;

const languages = [
  {code: 'fi', label: 'Finnish (fi)'},
  {code: 'sv', label: 'Swedish (sv)'},
  {code: 'en', label: 'English (en)'},
];

const makeLangArray = (initial: Record<string, string> = {}) =>
  languages.map(({code}) => ({
    language: code as LanguageCode,
    text: initial[code] ?? '',
    id: generateTemporaryId(),
  }));

const makeEmptyChoice = () => ({
  points: 1,
  label: makeLangArray(),
  isCorrect: false,
  id: generateTemporaryId(),
});

const makeEmptyQuestion = () => ({
  // id intentionally omitted for new questions; backend will generate
  instruction: makeLangArray(),
  explanation: makeLangArray(),
  multiSelect: false,
  choices: [makeEmptyChoice(), makeEmptyChoice()],
  id: generateTemporaryId(),
});

const makeInitialFormState = (): GetQuestionSetResponse => ({
  id: generateTemporaryId(),
  type: 'questionnaire',
  title: makeLangArray(),
  description: makeLangArray(),
  questions: [makeEmptyQuestion()],
});

const ensureIds = (data: GetQuestionSetResponse): GetQuestionSetResponse => {
  const coercePoints = (p: unknown) => {
    const n = typeof p === 'number' ? p : Number(p);
    return Number.isFinite(n) ? n : 1;
  };

  return {
    ...data,
    id: data.id || generateTemporaryId(),
    type: data.type === 'quiz' ? 'quiz' : 'questionnaire',
    title: data.title ?? [],
    description: data.description ?? [],
    questions: (data.questions ?? []).map((q) => ({
      ...q,
      id: q.id ?? generateTemporaryId(),
      instruction: q.instruction ?? [],
      explanation: q.explanation ?? [],
      multiSelect: Boolean(q.multiSelect),
      strength: q.strength ?? undefined,
      choices: (q.choices ?? []).map((c) => ({
        ...c,
        id: c.id ?? generateTemporaryId(),
        points: coercePoints(c.points),
        isCorrect: Boolean(c.isCorrect),
        label: c.label ?? [],
      })),
    })),
  };
};

export default function QuizForm() {
  const {setId} = useParams();
  const isEditing = Boolean(setId);

  const [questionSet, setQuestionSet] =
    useState<GetQuestionSetResponse>(makeInitialFormState);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSlide, setIsSlide] = useState(false);
  const navigate = useNavigate();

  // Load existing quiz when editing
  useEffect(() => {
    let active = true;
    (async () => {
      if (!isEditing) return;
      try {
        setLoading(true);
        if (!setId) {
          return;
        }

        const data = await api.getQuestionSet({id: setId});

        setQuestionSet((previous) => ({...previous, ...data}));
      } catch {
        setError('Failed to load quiz. Please try again.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [setId, isEditing]);

  // Generic set helpers
  const setTitleText = (langCode: LanguageCode, value: string) => {
    setQuestionSet((previous) => ({
      ...previous,
      title: previous.title.map((t) =>
        t.language === langCode ? {...t, text: value} : t,
      ),
    }));
  };

  const setDescriptionText = (langCode: LanguageCode, value: string) => {
    setQuestionSet((previous) => ({
      ...previous,
      description: (previous.description ?? makeLangArray()).map((t) =>
        t.language === langCode ? {...t, text: value} : t,
      ),
    }));
  };

  const setInstructionText = (
    qIndex: number,
    langCode: LanguageCode,
    value: string,
  ) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              instruction: q.instruction.map((t) =>
                t.language === langCode ? {...t, text: value} : t,
              ),
            }
          : q,
      ),
    }));
  };

  const setExplanationText = (
    qIndex: number,
    langCode: LanguageCode,
    value: string,
  ) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              explanation: q.explanation.map((t) =>
                t.language === langCode ? {...t, text: value} : t,
              ),
            }
          : q,
      ),
    }));
  };

  const setQuestionMultiSelect = (qIndex: number, value: boolean) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex ? {...q, multiSelect: value} : q,
      ),
    }));
  };

  const setQuestionStrength = (
    qIndex: number,
    value: StrengthSlug | undefined,
  ) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex ? {...q, strength: value} : q,
      ),
    }));
  };

  const addQuestion = () => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: [...previous.questions, makeEmptyQuestion()],
    }));
  };

  const removeQuestion = (qIndex: number) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.filter((_, i) => i !== qIndex),
    }));
  };

  const addChoice = (qIndex: number) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex ? {...q, choices: [...q.choices, makeEmptyChoice()]} : q,
      ),
    }));
  };

  const removeChoice = (qIndex: number, cIndex: number) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {...q, choices: q.choices.filter((_, index) => index !== cIndex)}
          : q,
      ),
    }));
  };

  const setChoicePoints = (qIndex: number, cIndex: number, value: string) => {
    const number_ = Number(value);
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: q.choices.map((c, index) =>
                index === cIndex
                  ? {...c, points: Number.isNaN(number_) ? 1 : number_}
                  : c,
              ),
            }
          : q,
      ),
    }));
  };

  const setChoiceCorrect = (
    qIndex: number,
    cIndex: number,
    checked: boolean,
  ) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: q.choices.map((c, index) =>
                index === cIndex ? {...c, isCorrect: checked} : c,
              ),
            }
          : q,
      ),
    }));
  };

  const setChoiceLabelText = (
    qIndex: number,
    cIndex: number,
    langCode: LanguageCode,
    value: string,
  ) => {
    setQuestionSet((previous) => ({
      ...previous,
      questions: previous.questions.map((q, i) =>
        i === qIndex
          ? {
              ...q,
              choices: q.choices.map((c, index) =>
                index === cIndex
                  ? {
                      ...c,
                      label: c.label.map((t) =>
                        t.language === langCode ? {...t, text: value} : t,
                      ),
                    }
                  : c,
              ),
            }
          : q,
      ),
    }));
  };

  const moveQuestion = (fromIndex: number, toIndex: number) => {
    setQuestionSet((previous) => {
      const questions = [...previous.questions];
      if (toIndex < 0 || toIndex >= questions.length) return previous; // prevent out-of-range
      const [moved] = questions.splice(fromIndex, 1);
      questions.splice(toIndex, 0, moved);
      return {...previous, questions};
    });
  };

  // Minimal client-side validation to catch obvious mistakes
  const validate = () => {
    // Require ALL translations for every translatable field
    const hasAllLangs = (
      array: Array<{
        language: string;
        text: string;
      }>,
    ) =>
      array?.length === languages.length && array.every((t) => t.text.trim());

    if (!hasAllLangs(questionSet.title)) {
      return 'Provide title in all languages (fi, sv, en).';
    }

    if (!hasAllLangs(questionSet.description ?? [])) {
      return 'Provide description in all languages (fi, sv, en).';
    }

    if (questionSet.questions.length === 0) {
      return 'Add at least one question.';
    }

    for (let i = 0; i < questionSet.questions.length; i++) {
      const q = questionSet.questions[i];

      if (!hasAllLangs(q.instruction)) {
        return `Question ${i + 1}: instruction must be filled in fi, sv, and en.`;
      }

      if (!hasAllLangs(q.explanation)) {
        return `Question ${i + 1}: explanation must be filled in fi, sv, and en.`;
      }

      if (!q.choices || q.choices.length === 0) {
        return `Question ${i + 1}: add at least one choice.`;
      }

      for (let index = 0; index < q.choices.length; index++) {
        const c = q.choices[index];
        if (!hasAllLangs(c.label)) {
          return `Question ${i + 1}, Choice ${index + 1}: label must be filled in fi, sv, and en.`;
        }

        if (typeof c.points !== 'number' || Number.isNaN(c.points)) {
          return `Question ${i + 1}, Choice ${index + 1}: points must be a number.`;
        }
      }
    }

    return '';
  };

  const onSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    try {
      setSubmitting(true);
      const payload = questionSet;
      if (isEditing) {
        if (!setId) {
          return;
        }

        const response = await api.updateQuestionSet(
          {
            id: setId,
          },
          payload,
        );

        setQuestionSet((previous) => ({...previous, ...response}));
      } else {
        const response = await api.createQuestionSet(payload);
        navigate('/question-sets/' + response.id);
      }
    } catch (error_) {
      console.error(error_);
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  function Header() {
    return (
      <>
        <PageTitle title={isEditing ? 'Edit Quiz' : 'New Quiz'}>
          <Button type="submit" form="quiz-form" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Saving...
              </>
            ) : isEditing ? (
              'Save Changes'
            ) : (
              'Create Quiz'
            )}
          </Button>
        </PageTitle>
        {error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : null}
        {success ? (
          <div className="alert alert-success" role="alert">
            {success}
          </div>
        ) : null}
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="d-flex align-items-center">
          <Spinner animation="border" className="me-2" /> Loading quiz...
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <Tabs mountOnEnter unmountOnExit defaultActiveKey="edit" className="mt-3">
        <Tab title="Edit" eventKey="edit" className="pt-3">
          <Form.Group className="mb-3" controlId="quiz-type">
            <Form.Label>Quiz Type</Form.Label>
            <Form.Select
              value={questionSet.type ?? 'quiz'}
              onChange={(event) => {
                const value = event.target.value as 'quiz' | 'questionnaire';
                setQuestionSet((previous) => ({
                  ...previous,
                  type: value,
                }));
              }}
            >
              <option value="quiz">Quiz (default)</option>
              <option value="questionnaire">Survey (no correct answers)</option>
            </Form.Select>
          </Form.Group>

          <Card className="mb-4">
            <Card.Header>Title</Card.Header>
            <Card.Body>
              {languages.map(({code, label}) => (
                <Form.Group
                  key={code}
                  className="mb-3"
                  controlId={`title-${code}`}
                >
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={`Title (${code})`}
                    value={
                      questionSet.title.find((t) => t.language === code)
                        ?.text ?? ''
                    }
                    onChange={(event) => {
                      setTitleText(code as LanguageCode, event.target.value);
                    }}
                  />
                </Form.Group>
              ))}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header>Description</Card.Header>
            <Card.Body>
              {languages.map(({code, label}) => (
                <Form.Group
                  key={code}
                  className="mb-3"
                  controlId={`description-${code}`}
                >
                  <Form.Label>{label}</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder={`Description (${code})`}
                    value={
                      (questionSet.description ?? []).find(
                        (t) => t.language === code,
                      )?.text ?? ''
                    }
                    onChange={(event) => {
                      setDescriptionText(
                        code as LanguageCode,
                        event.target.value,
                      );
                    }}
                  />
                </Form.Group>
              ))}
            </Card.Body>
          </Card>

          <Form id="quiz-form" onSubmit={onSubmit}>
            {questionSet.questions.map((q, qIndex) => (
              <Card key={q.id} className="mb-4">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>Question {qIndex + 1}</div>
                  <div className="ms-auto">
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      className="me-1"
                      disabled={qIndex === 0}
                      onClick={() => {
                        moveQuestion(qIndex, qIndex - 1);
                      }}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-secondary"
                      disabled={qIndex === questionSet.questions.length - 1}
                      onClick={() => {
                        moveQuestion(qIndex, qIndex + 1);
                      }}
                    >
                      <ArrowDown />
                    </Button>
                  </div>
                </Card.Header>

                <Card.Body>
                  <Form.Check
                    className="mb-3"
                    type="switch"
                    id={`multi-${qIndex}`}
                    label="Multi-select"
                    checked={q.multiSelect}
                    onChange={(event) => {
                      setQuestionMultiSelect(qIndex, event.target.checked);
                    }}
                  />
                  <Form.Group className="mb-3" controlId={`strength-${qIndex}`}>
                    <Form.Label>Strength (optional)</Form.Label>

                    <SingleStrengthSelectWithUndefined
                      value={q.strength}
                      onChange={(value) => {
                        setQuestionStrength(qIndex, value);
                      }}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={12} className="mb-2">
                      <h6>Instruction</h6>
                    </Col>
                    {languages.map(({code, label}) => (
                      <Col key={`instr-${code}`} md={4}>
                        <Form.Group
                          className="mb-3"
                          controlId={`instr-${qIndex}-${code}`}
                        >
                          <Form.Label className="small">{label}</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder={`Instruction (${code})`}
                            value={
                              q.instruction.find((t) => t.language === code)
                                ?.text ?? ''
                            }
                            onChange={(event) => {
                              setInstructionText(
                                qIndex,
                                code as LanguageCode,
                                event.target.value,
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <Row className="mt-2">
                    <Col md={12} className="mb-2">
                      <h6>Explanation</h6>
                    </Col>
                    {languages.map(({code, label}) => (
                      <Col key={`expl-${code}`} md={4}>
                        <Form.Group
                          className="mb-3"
                          controlId={`expl-${qIndex}-${code}`}
                        >
                          <Form.Label className="small">{label}</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder={`Explanation (${code})`}
                            value={
                              (q.explanation ?? []).find(
                                (t) => t.language === code,
                              )?.text ?? ''
                            }
                            onChange={(event) => {
                              setExplanationText(
                                qIndex,
                                code as LanguageCode,
                                event.target.value,
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                    ))}
                  </Row>

                  <Row className="mt-2">
                    <Col
                      md={12}
                      className="mb-2 d-flex align-items-center justify-content-between"
                    >
                      <h6 className="mb-0">Choices</h6>
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => {
                          addChoice(qIndex);
                        }}
                      >
                        + Add Choice
                      </Button>
                    </Col>
                  </Row>

                  {q.choices.map((c, cIndex) => (
                    <Card key={c.id} className="mb-3">
                      <Card.Body>
                        <Row className="align-items-end">
                          <Col md={3}>
                            <Form.Group
                              className="mb-3"
                              controlId={`points-${qIndex}-${cIndex}`}
                            >
                              <Form.Label>Points</Form.Label>
                              <Form.Control
                                type="number"
                                value={c.points}
                                onChange={(event) => {
                                  setChoicePoints(
                                    qIndex,
                                    cIndex,
                                    event.target.value,
                                  );
                                }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group
                              className="mb-3"
                              controlId={`correct-${qIndex}-${cIndex}`}
                            >
                              <Form.Check
                                type="checkbox"
                                label="Correct answer"
                                checked={c.isCorrect}
                                onChange={(event) => {
                                  setChoiceCorrect(
                                    qIndex,
                                    cIndex,
                                    event.target.checked,
                                  );
                                }}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={6} className="text-end">
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => {
                                removeChoice(qIndex, cIndex);
                              }}
                            >
                              Remove choice
                            </Button>
                          </Col>
                        </Row>

                        <Row>
                          {languages.map(({code, label}) => (
                            <Col key={`label-${code}`} md={4}>
                              <Form.Group
                                className="mb-3"
                                controlId={`label-${qIndex}-${cIndex}-${code}`}
                              >
                                <Form.Label className="small">
                                  Label — {label}
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder={`Choice label (${code})`}
                                  value={
                                    c.label.find((t) => t.language === code)
                                      ?.text ?? ''
                                  }
                                  onChange={(event) => {
                                    setChoiceLabelText(
                                      qIndex,
                                      cIndex,
                                      code as LanguageCode,
                                      event.target.value,
                                    );
                                  }}
                                />
                              </Form.Group>
                            </Col>
                          ))}
                        </Row>
                      </Card.Body>
                    </Card>
                  ))}

                  <div className="d-flex justify-content-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => {
                        removeQuestion(qIndex);
                      }}
                    >
                      Remove question
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}

            <div className="d-flex justify-content-between">
              <Button variant="outline-primary" onClick={addQuestion}>
                + Add Question
              </Button>
              <Button type="submit" disabled={submitting}>
                {isEditing ? 'Save Changes' : 'Create Quiz'}
              </Button>
            </div>
          </Form>
        </Tab>
        <Tab title="JSON" eventKey="json" className="pt-3">
          <JsonEditor
            rootName="questionSet"
            data={questionSet}
            setData={(data) => {
              setQuestionSet(ensureIds(data as GetQuestionSetResponse));
            }}
            maxWidth="100%"
          />
        </Tab>
        <Tab title="Preview" eventKey="preview" className="pt-3">
          <Form.Check
            type="switch"
            id="preview-mode"
            label="Slide Mode"
            checked={isSlide}
            onChange={(event) => {
              setIsSlide(event.target.checked);
            }}
          />
          <Questionnaire questionSet={questionSet} />
        </Tab>
      </Tabs>
    </>
  );
}
