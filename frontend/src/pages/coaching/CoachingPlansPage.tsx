import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState} from 'react';
import {
  Table,
  Button,
  Badge,
  Modal,
  Form,
  Spinner,
  Tabs,
  Tab,
} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import type {CoachingPlan, CoachingBasePrompt} from '@client/ApiTypes';
import PageTitle from '@/components/ui/PageTitle.js';
import {useToasts} from '@/components/toasts/index.js';
import {confirm} from '@/components/ui/confirm.js';
import {
  useGetCoachingPlansQuery,
  useCreateCoachingPlanMutation,
  useUpdateCoachingPlanMutation,
  useRemoveCoachingPlanMutation,
  useGetCoachingBasePromptsQuery,
  useCreateCoachingBasePromptMutation,
  useUpdateCoachingBasePromptMutation,
  useRemoveCoachingBasePromptMutation,
  useGetAllCoachingSessionsQuery,
} from '@/hooks/useApi.js';

// ---------- Plan Form ----------
type PlanFormData = {
  title: string;
  description: string;
  content: string;
  basePromptId: string;
  isPublished: boolean;
  order: number;
};

const emptyPlanFormData: PlanFormData = {
  title: '',
  description: '',
  content: '',
  basePromptId: '',
  isPublished: false,
  order: 0,
};

// ---------- Base Prompt Form ----------
type BasePromptFormData = {
  name: string;
  content: string;
};

const emptyBasePromptFormData: BasePromptFormData = {
  name: '',
  content: '',
};

// eslint-disable-next-line complexity
export default function CoachingPlansPage() {
  const {_} = useLingui();
  const toasts = useToasts();

  // Plans data
  const {data: plans, isLoading: isLoadingPlans} = useGetCoachingPlansQuery({});
  const createPlanMutation = useCreateCoachingPlanMutation();
  const updatePlanMutation = useUpdateCoachingPlanMutation();
  const removePlanMutation = useRemoveCoachingPlanMutation();

  // Base prompts data
  const {data: basePrompts, isLoading: isLoadingBasePrompts} =
    useGetCoachingBasePromptsQuery({});
  const createBasePromptMutation = useCreateCoachingBasePromptMutation();
  const updateBasePromptMutation = useUpdateCoachingBasePromptMutation();
  const removeBasePromptMutation = useRemoveCoachingBasePromptMutation();

  // Admin sessions data
  const {data: allSessions, isLoading: isLoadingSessions} =
    useGetAllCoachingSessionsQuery({});

  // Plan modal state
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CoachingPlan | undefined>();
  const [planFormData, setPlanFormData] =
    useState<PlanFormData>(emptyPlanFormData);

  // Base prompt modal state
  const [isBasePromptModalOpen, setIsBasePromptModalOpen] = useState(false);
  const [editingBasePrompt, setEditingBasePrompt] = useState<
    CoachingBasePrompt | undefined
  >();
  const [basePromptFormData, setBasePromptFormData] =
    useState<BasePromptFormData>(emptyBasePromptFormData);

  // Debug session modal state
  type DebugSession = NonNullable<typeof allSessions>[number];
  const [selectedSession, setSelectedSession] = useState<
    DebugSession | undefined
  >();

  // ---------- Plan handlers ----------
  const handleCreatePlan = () => {
    setEditingPlan(undefined);
    setPlanFormData(emptyPlanFormData);
    setIsPlanModalOpen(true);
  };

  const handleEditPlan = (plan: CoachingPlan) => {
    setEditingPlan(plan);
    setPlanFormData({
      title: plan.title,
      description: plan.description,
      content: plan.content ?? '',
      basePromptId: plan.basePromptId,
      isPublished: plan.isPublished,
      order: plan.order,
    });
    setIsPlanModalOpen(true);
  };

  const handleDeletePlan = async (plan: CoachingPlan) => {
    const confirmed = await confirm({
      title: _(msg`Delete Coaching Plan`),
      text: _(msg`Are you sure you want to delete "${plan.title}"?`),
      cancel: _(msg`Cancel`),
      confirm: _(msg`Delete`),
    });
    if (!confirmed) return;

    try {
      await removePlanMutation.mutateAsync({pathParameters: {id: plan.id}});
      toasts.success({header: _(msg`Deleted`), body: _(msg`Plan deleted.`)});
    } catch {
      toasts.danger({header: _(msg`Error`), body: _(msg`Failed to delete.`)});
    }
  };

  const handleSubmitPlan = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      if (editingPlan) {
        await updatePlanMutation.mutateAsync({
          pathParameters: {id: editingPlan.id},
          payload: planFormData,
        });
        toasts.success({header: _(msg`Updated`), body: _(msg`Plan updated.`)});
      } else {
        await createPlanMutation.mutateAsync({payload: planFormData});
        toasts.success({header: _(msg`Created`), body: _(msg`Plan created.`)});
      }

      setIsPlanModalOpen(false);
    } catch {
      toasts.danger({header: _(msg`Error`), body: _(msg`Failed to save.`)});
    }
  };

  // ---------- Base Prompt handlers ----------
  const handleCreateBasePrompt = () => {
    setEditingBasePrompt(undefined);
    setBasePromptFormData(emptyBasePromptFormData);
    setIsBasePromptModalOpen(true);
  };

  const handleEditBasePrompt = (prompt: CoachingBasePrompt) => {
    setEditingBasePrompt(prompt);
    setBasePromptFormData({
      name: prompt.name,
      content: prompt.content ?? '',
    });
    setIsBasePromptModalOpen(true);
  };

  const handleDeleteBasePrompt = async (prompt: CoachingBasePrompt) => {
    const confirmed = await confirm({
      title: _(msg`Delete Base Prompt`),
      text: _(msg`Are you sure you want to delete "${prompt.name}"?`),
      cancel: _(msg`Cancel`),
      confirm: _(msg`Delete`),
    });
    if (!confirmed) return;

    try {
      await removeBasePromptMutation.mutateAsync({
        pathParameters: {id: prompt.id},
      });
      toasts.success({
        header: _(msg`Deleted`),
        body: _(msg`Base prompt deleted.`),
      });
    } catch {
      toasts.danger({
        header: _(msg`Error`),
        body: _(msg`Cannot delete: base prompt is in use by plans.`),
      });
    }
  };

  const handleSubmitBasePrompt = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      if (editingBasePrompt) {
        await updateBasePromptMutation.mutateAsync({
          pathParameters: {id: editingBasePrompt.id},
          payload: basePromptFormData,
        });
        toasts.success({
          header: _(msg`Updated`),
          body: _(msg`Base prompt updated.`),
        });
      } else {
        await createBasePromptMutation.mutateAsync({
          payload: basePromptFormData,
        });
        toasts.success({
          header: _(msg`Created`),
          body: _(msg`Base prompt created.`),
        });
      }

      setIsBasePromptModalOpen(false);
    } catch {
      toasts.danger({header: _(msg`Error`), body: _(msg`Failed to save.`)});
    }
  };

  const isPlanPending =
    createPlanMutation.isPending || updatePlanMutation.isPending;
  const isBasePromptPending =
    createBasePromptMutation.isPending || updateBasePromptMutation.isPending;

  return (
    <div className="d-flex flex-column gap-3">
      <PageTitle title={_(msg`Coaching Admin`)} />

      <Tabs defaultActiveKey="plans" className="mb-3">
        {/* ========== PLANS TAB ========== */}
        <Tab eventKey="plans" title={_(msg`Session Plans`)}>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleCreatePlan}>
              <Trans>Add Plan</Trans>
            </Button>
          </div>

          {isLoadingPlans ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : null}

          {!isLoadingPlans && plans ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>
                    <Trans>Title</Trans>
                  </th>
                  <th>
                    <Trans>Base Prompt</Trans>
                  </th>
                  <th>
                    <Trans>Status</Trans>
                  </th>
                  <th>
                    <Trans>Actions</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id}>
                    <td>{plan.title}</td>
                    <td>
                      {basePrompts?.find((b) => b.id === plan.basePromptId)
                        ?.name ?? '-'}
                    </td>
                    <td>
                      {plan.isPublished ? (
                        <Badge bg="success">
                          <Trans>Published</Trans>
                        </Badge>
                      ) : (
                        <Badge bg="secondary">
                          <Trans>Draft</Trans>
                        </Badge>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            handleEditPlan(plan);
                          }}
                        >
                          <Trans>Edit</Trans>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={removePlanMutation.isPending}
                          onClick={async () => handleDeletePlan(plan)}
                        >
                          <Trans>Delete</Trans>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center text-muted">
                      <Trans>No plans yet.</Trans>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          ) : null}
        </Tab>

        {/* ========== BASE PROMPTS TAB ========== */}
        <Tab eventKey="basePrompts" title={_(msg`Base Prompts`)}>
          <div className="d-flex justify-content-end mb-3">
            <Button variant="primary" onClick={handleCreateBasePrompt}>
              <Trans>Add Base Prompt</Trans>
            </Button>
          </div>

          {isLoadingBasePrompts ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : null}

          {!isLoadingBasePrompts && basePrompts ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>
                    <Trans>Name</Trans>
                  </th>
                  <th>
                    <Trans>Actions</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {basePrompts.map((prompt) => (
                  <tr key={prompt.id}>
                    <td>{prompt.name}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => {
                            handleEditBasePrompt(prompt);
                          }}
                        >
                          <Trans>Edit</Trans>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          disabled={removeBasePromptMutation.isPending}
                          onClick={async () => handleDeleteBasePrompt(prompt)}
                        >
                          <Trans>Delete</Trans>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {basePrompts.length === 0 && (
                  <tr>
                    <td colSpan={2} className="text-center text-muted">
                      <Trans>No base prompts yet.</Trans>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          ) : null}
        </Tab>

        {/* ========== DEBUG SESSIONS TAB ========== */}
        <Tab eventKey="debugSessions" title={_(msg`Debug Sessions`)}>
          {isLoadingSessions ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : null}

          {!isLoadingSessions && allSessions ? (
            <Table striped bordered hover responsive size="sm">
              <thead>
                <tr>
                  <th>
                    <Trans>User</Trans>
                  </th>
                  <th>
                    <Trans>Plan</Trans>
                  </th>
                  <th>
                    <Trans>Status</Trans>
                  </th>
                  <th>
                    <Trans>Messages</Trans>
                  </th>
                  <th>
                    <Trans>Created</Trans>
                  </th>
                  <th>
                    <Trans>Actions</Trans>
                  </th>
                </tr>
              </thead>
              <tbody>
                {allSessions.map((session) => (
                  <tr key={session.id}>
                    <td>
                      <small>
                        {session.user?.name ?? 'Unknown'}
                        <br />
                        <span className="text-muted">
                          {session.user?.email}
                        </span>
                      </small>
                    </td>
                    <td>{session.planTitle}</td>
                    <td>
                      <Badge
                        bg={
                          session.status === 'active'
                            ? 'primary'
                            : session.status === 'completed'
                              ? 'success'
                              : 'secondary'
                        }
                      >
                        {session.status}
                      </Badge>
                    </td>
                    <td>{session.messages.length}</td>
                    <td>
                      <small>
                        {session.createdAt
                          ? new Date(session.createdAt).toLocaleDateString()
                          : '-'}
                      </small>
                    </td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => {
                          setSelectedSession(session);
                        }}
                      >
                        <Trans>View</Trans>
                      </Button>
                    </td>
                  </tr>
                ))}
                {allSessions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted">
                      <Trans>No sessions yet.</Trans>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          ) : null}
        </Tab>
      </Tabs>

      {/* ========== PLAN MODAL ========== */}
      <Modal
        show={isPlanModalOpen}
        size="lg"
        onHide={() => {
          setIsPlanModalOpen(false);
        }}
      >
        <Form onSubmit={handleSubmitPlan}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingPlan ? (
                <Trans>Edit Plan</Trans>
              ) : (
                <Trans>Create Plan</Trans>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Title</Trans>
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={planFormData.title}
                onChange={(event) => {
                  setPlanFormData({...planFormData, title: event.target.value});
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Base Prompt</Trans>
              </Form.Label>
              <Form.Select
                required
                value={planFormData.basePromptId}
                onChange={(event) => {
                  setPlanFormData({
                    ...planFormData,
                    basePromptId: event.target.value,
                  });
                }}
              >
                <option value="">{_(msg`Select a base prompt...`)}</option>
                {basePrompts?.map((bp) => (
                  <option key={bp.id} value={bp.id}>
                    {bp.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Description</Trans>
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={2}
                value={planFormData.description}
                onChange={(event) => {
                  setPlanFormData({
                    ...planFormData,
                    description: event.target.value,
                  });
                }}
              />
              <Form.Text className="text-muted">
                <Trans>Shown to users when selecting a plan.</Trans>
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Session Instructions</Trans>
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={8}
                value={planFormData.content}
                style={{fontFamily: 'monospace', fontSize: '0.875rem'}}
                onChange={(event) => {
                  setPlanFormData({
                    ...planFormData,
                    content: event.target.value,
                  });
                }}
              />
              <Form.Text className="text-muted">
                <Trans>
                  Session-specific instructions appended to the base prompt.
                </Trans>
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-4">
              <Form.Group>
                <Form.Check
                  type="switch"
                  label={_(msg`Published`)}
                  checked={planFormData.isPublished}
                  onChange={(event) => {
                    setPlanFormData({
                      ...planFormData,
                      isPublished: event.target.checked,
                    });
                  }}
                />
              </Form.Group>
              <Form.Group style={{width: '100px'}}>
                <Form.Label>
                  <Trans>Order</Trans>
                </Form.Label>
                <Form.Control
                  type="number"
                  value={planFormData.order}
                  onChange={(event) => {
                    setPlanFormData({
                      ...planFormData,
                      order: Number(event.target.value),
                    });
                  }}
                />
              </Form.Group>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsPlanModalOpen(false);
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button type="submit" variant="primary" disabled={isPlanPending}>
              {isPlanPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Trans>Save</Trans>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ========== BASE PROMPT MODAL ========== */}
      <Modal
        show={isBasePromptModalOpen}
        size="lg"
        onHide={() => {
          setIsBasePromptModalOpen(false);
        }}
      >
        <Form onSubmit={handleSubmitBasePrompt}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingBasePrompt ? (
                <Trans>Edit Base Prompt</Trans>
              ) : (
                <Trans>Create Base Prompt</Trans>
              )}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Name</Trans>
              </Form.Label>
              <Form.Control
                required
                type="text"
                value={basePromptFormData.name}
                placeholder={_(msg`e.g., Coach Kaisa`)}
                onChange={(event) => {
                  setBasePromptFormData({
                    ...basePromptFormData,
                    name: event.target.value,
                  });
                }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Trans>Prompt Content</Trans>
              </Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={15}
                value={basePromptFormData.content}
                style={{fontFamily: 'monospace', fontSize: '0.875rem'}}
                onChange={(event) => {
                  setBasePromptFormData({
                    ...basePromptFormData,
                    content: event.target.value,
                  });
                }}
              />
              <Form.Text className="text-muted">
                <Trans>
                  The full AI persona and coaching instructions. This is
                  combined with session-specific instructions.
                </Trans>
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setIsBasePromptModalOpen(false);
              }}
            >
              <Trans>Cancel</Trans>
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isBasePromptPending}
            >
              {isBasePromptPending ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <Trans>Save</Trans>
              )}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* ========== SESSION DEBUG MODAL ========== */}
      <Modal
        show={Boolean(selectedSession)}
        size="xl"
        onHide={() => {
          setSelectedSession(undefined);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSession?.planTitle} - {selectedSession?.user?.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession ? (
            <div className="d-flex flex-column gap-3">
              <div>
                <strong>
                  <Trans>Status:</Trans>
                </strong>{' '}
                <Badge
                  bg={
                    selectedSession.status === 'active'
                      ? 'primary'
                      : selectedSession.status === 'completed'
                        ? 'success'
                        : 'secondary'
                  }
                >
                  {selectedSession.status}
                </Badge>
              </div>

              <div>
                <strong>
                  <Trans>User:</Trans>
                </strong>{' '}
                {selectedSession.user?.name} ({selectedSession.user?.email})
              </div>

              <div>
                <strong>
                  <Trans>Created:</Trans>
                </strong>{' '}
                {selectedSession.createdAt
                  ? new Date(selectedSession.createdAt).toLocaleString()
                  : '-'}
              </div>

              <hr />

              <details>
                <summary className="fw-bold mb-2">
                  <Trans>Base Prompt Content</Trans>
                </summary>
                <pre
                  className="bg-light p-2 rounded small"
                  style={{maxHeight: '200px', overflow: 'auto'}}
                >
                  {selectedSession.basePromptContent}
                </pre>
              </details>

              <details>
                <summary className="fw-bold mb-2">
                  <Trans>Plan Content</Trans>
                </summary>
                <pre
                  className="bg-light p-2 rounded small"
                  style={{maxHeight: '200px', overflow: 'auto'}}
                >
                  {selectedSession.planContent}
                </pre>
              </details>

              {selectedSession.summary ? (
                <div className="mt-3 p-3 bg-success-subtle rounded">
                  <strong>
                    <Trans>AI Summary:</Trans>
                  </strong>
                  <div className="mt-2">{selectedSession.summary.content}</div>
                  <small className="text-muted d-block mt-2">
                    <Trans>Generated:</Trans>{' '}
                    {selectedSession.summary.completedAt
                      ? new Date(
                          selectedSession.summary.completedAt,
                        ).toLocaleString()
                      : '-'}
                  </small>
                </div>
              ) : null}

              <hr />

              <div>
                <strong>
                  <Trans>Messages</Trans> ({selectedSession.messages.length}):
                </strong>
              </div>

              <div
                className="border rounded p-2"
                style={{maxHeight: '400px', overflow: 'auto'}}
              >
                {selectedSession.messages.map((message) => (
                  <div
                    key={`${message.role}-${message.createdAt}`}
                    className={`mb-2 p-2 rounded ${
                      message.role === 'user'
                        ? 'bg-primary text-white ms-5'
                        : message.role === 'assistant'
                          ? 'bg-light me-5'
                          : 'bg-warning-subtle'
                    }`}
                  >
                    <small className="fw-bold d-block mb-1">
                      {message.role} -{' '}
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </small>
                    <div style={{whiteSpace: 'pre-wrap'}}>
                      {message.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedSession(undefined);
            }}
          >
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
