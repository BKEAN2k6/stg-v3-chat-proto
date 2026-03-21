import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Card, Button, Badge, Spinner} from 'react-bootstrap';
import {useLingui} from '@lingui/react';
import {useNavigate} from 'react-router-dom';
import {Trash} from 'react-bootstrap-icons';
import PageTitle from '@/components/ui/PageTitle.js';
import Avatar from '@/components/ui/Avatar.js';
import {confirm} from '@/components/ui/confirm.js';
import {
  useGetAvailableCoachingPlansQuery,
  useGetCoachingSessionsQuery,
  useCreateCoachingSessionMutation,
  useRemoveCoachingSessionMutation,
} from '@/hooks/useApi.js';

export default function CoachingPage() {
  const {_} = useLingui();
  const navigate = useNavigate();

  const {data: availablePlans, isLoading: isLoadingPlans} =
    useGetAvailableCoachingPlansQuery({});
  const {data: sessions, isLoading: isLoadingSessions} =
    useGetCoachingSessionsQuery({refetchOnMount: 'always'});
  const createSessionMutation = useCreateCoachingSessionMutation();
  const removeSessionMutation = useRemoveCoachingSessionMutation();

  const activeSessions = sessions?.filter((s) => s.status === 'active') ?? [];
  const completedSessions =
    sessions?.filter((s) => s.status === 'completed') ?? [];

  const handleStartSession = async (planId: string) => {
    // Navigate immediately - the session page will show loading state while Kaisa generates response
    createSessionMutation.mutate(
      {payload: {planId}},
      {
        onSuccess(session) {
          navigate(`/coaching/${session.id}`);
        },
      },
    );
  };

  const handleDeleteSession = async (
    event: React.MouseEvent,
    sessionId: string,
    sessionTitle: string,
  ) => {
    event.stopPropagation();

    const confirmed = await confirm({
      title: _(msg`Delete Session`),
      text: _(msg`Are you sure you want to delete "${sessionTitle}"?`),
      cancel: _(msg`Cancel`),
      confirm: _(msg`Delete`),
    });

    if (!confirmed) return;

    await removeSessionMutation.mutateAsync({
      pathParameters: {id: sessionId},
    });
  };

  const isLoading = isLoadingPlans || isLoadingSessions;

  return (
    <>
      <PageTitle title={_(msg`Coach Kaisa`)} />

      <div className="d-flex align-items-center gap-3 mb-4">
        <Avatar path="coach-kaisa" size={48} hasTooltip={false} />
        <div>
          <h4 className="mb-1">
            <Trans>Coach Kaisa</Trans>
          </h4>
          <p className="text-muted mb-0">
            <Trans>Your personal coaching companion</Trans>
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      ) : null}

      {/* Active Sessions */}
      {activeSessions.length > 0 && (
        <div className="mb-4">
          <h5>
            <Trans>Continue your sessions</Trans>
          </h5>
          <div className="d-flex flex-column gap-2">
            {activeSessions.map((session) => (
              <Card
                key={session.id}
                className="cursor-pointer"
                style={{cursor: 'pointer'}}
                onClick={() => {
                  navigate(`/coaching/${session.id}`);
                }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{session.planTitle}</h6>
                    <small className="text-muted">
                      {session.messages.length} <Trans>messages</Trans>
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="primary">
                      <Trans>Active</Trans>
                    </Badge>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={removeSessionMutation.isPending}
                      onClick={async (event) =>
                        handleDeleteSession(
                          event,
                          session.id,
                          session.planTitle,
                        )
                      }
                    >
                      <Trash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Available Plans */}
      {availablePlans && availablePlans.length > 0 ? (
        <div className="mb-4">
          <h5>
            <Trans>Start a new session</Trans>
          </h5>
          <div className="d-flex flex-column gap-2">
            {availablePlans.map((plan) => (
              <Card key={plan.id}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{plan.title}</h6>
                      <p className="text-muted mb-0 small">
                        {plan.description}
                      </p>
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={createSessionMutation.isPending}
                      onClick={async () => handleStartSession(plan.id)}
                    >
                      <Trans>Start</Trans>
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div>
          <h5>
            <Trans>Completed sessions</Trans>
          </h5>
          <div className="d-flex flex-column gap-2">
            {completedSessions.map((session) => (
              <Card
                key={session.id}
                style={{cursor: 'pointer', opacity: 0.7}}
                onClick={() => {
                  navigate(`/coaching/${session.id}`);
                }}
              >
                <Card.Body className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1">{session.planTitle}</h6>
                    <small className="text-muted">
                      {session.messages.length} <Trans>messages</Trans>
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="success">
                      <Trans>Completed</Trans>
                    </Badge>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      disabled={removeSessionMutation.isPending}
                      onClick={async (event) =>
                        handleDeleteSession(
                          event,
                          session.id,
                          session.planTitle,
                        )
                      }
                    >
                      <Trash />
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading &&
        activeSessions.length === 0 &&
        (!availablePlans || availablePlans.length === 0) && (
          <Card className="text-center" style={{backgroundColor: '#f9fafb'}}>
            <Card.Body>
              <h5>
                <Trans>No coaching plans available</Trans>
              </h5>
              <p className="text-muted">
                <Trans>Check back later for new coaching sessions.</Trans>
              </p>
            </Card.Body>
          </Card>
        )}
    </>
  );
}
