import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {Clock, Person} from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import {useLingui} from '@lingui/react';
import {Row, Col, Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import {useToasts} from '@/components/toasts/index.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';
import {useIsSubscriptionExpired} from '@/hooks/useIsSubscriptionExpired.js';

function openInNewTab(url: string) {
  const win = window.open(url, '_blank');
  win?.focus();
}

export default function CreateSprintPage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {activeGroup} = useActiveGroup();
  const isSubscriptionExpired = useIsSubscriptionExpired();

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGroup) return;

    try {
      const sprint = await api.createSprint({
        id: activeGroup.id,
      });
      openInNewTab(`/games/${sprint.id}/host`);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating sprint`),
      });
    }
  };

  return (
    <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
      <div>
        <h2 className="fs-4 mb-0">{_(msg`Strength sprint`)}</h2>
        <div className="d-flex gap-3">
          <div className="d-flex align-items-center">
            <Clock
              size={14}
              style={{
                marginTop: '-2px',
              }}
            />
            <span
              style={{
                marginLeft: '4px',
              }}
            >
              2-10 min
            </span>
          </div>
          <div className="d-flex align-items-center">
            <Person
              size={14}
              style={{
                marginTop: '-2px',
              }}
            />
            <span
              style={{
                marginLeft: '4px',
              }}
            >
              2-50 <Trans>players</Trans>
            </span>
          </div>
        </div>
      </div>
      <Row>
        <Col xs={12} lg={7}>
          <p>
            <Trans>Welcome to share and receive strength-based feedback!</Trans>
          </p>
          <p>
            <Trans>
              To join the strength sprint, you’ll need at least two people and
              can participate easily using a mobile phone or computer. During
              the sprint, you’ll have the chance to give each other encouraging
              feedback on your character strengths.
            </Trans>
          </p>
          <p>
            <Trans>
              At the end of the sprint, you’ll receive a summary of both your
              individual strengths and the shared strengths within the group.
              Positive feedback not only boosts self-awareness but also
              strengthens community bonds and creates a joyful, inspiring
              atmosphere.
            </Trans>
          </p>
          <p>
            <Trans>Let’s discover and celebrate the good together!</Trans>
          </p>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubscriptionExpired}
          >
            <Trans>Start sprint</Trans>
          </Button>
          {isSubscriptionExpired ? (
            <p className="text-muted mt-2 mb-0">
              <Trans>Active subscription required</Trans>
            </p>
          ) : null}
        </Col>
        <Col md={5} className="d-none d-lg-block">
          <SimpleLottiePlayer
            autoplay
            loop
            style={{
              marginTop: -50,
            }}
            src="/animations/strengths/teamwork.json"
          />
        </Col>
      </Row>
    </Form>
  );
}
