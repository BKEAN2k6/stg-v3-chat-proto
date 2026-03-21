import {useEffect, useState} from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {Trans, msg} from '@lingui/macro';
import {useLingui} from '@lingui/react';
import {Row, Col, Button} from 'react-bootstrap';
import {useTracking} from 'react-tracking';
import {useCurrentUser} from '@/context/currentUserContext';
import api from '@/api/ApiClient';
import {useToasts} from '@/components/toasts';
import {useTitle} from '@/context/pageTitleContext';

function openInNewTab(url: string) {
  const win = window.open(url, '_blank');
  win?.focus();
}

export default function CreateMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {currentUser} = useCurrentUser();
  const {setTitle} = useTitle();
  const [numberOfCards, setNumberOfCards] = useState<16 | 36>(16);
  const {trackEvent} = useTracking<Trackables>({
    page: 'create-memory-game',
    path: window.location.pathname,
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    trackEvent({
      action: 'click',
      element: 'create-memory-game-button',
    });
    event.preventDefault();

    const selectedCommunity = currentUser?.selectedCommunity;
    if (!selectedCommunity) return false;

    try {
      const memoryGame = await api.createMemoryGame(
        {
          id: selectedCommunity,
        },
        {
          numberOfCards,
        },
      );
      openInNewTab(`/games/memory-games/${memoryGame._id}/host`);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating game`),
      });
    }
  };

  useEffect(() => {
    setTitle(_(msg`Memory Game`));
  }, [_, setTitle]);

  trackEvent({action: 'page-view'});

  return (
    <Form onSubmit={handleSubmit}>
      <h2>
        <Trans>Memory Game</Trans>
      </h2>
      <hr
        style={{
          margin: '0',
          marginBottom: '1rem',
        }}
      />
      <Row>
        <Col xs={12} lg={7}>
          <p>
            <Trans>
              Memory game is a fun and interactive game that helps you to
              improve your memory and focus. It is a great way to challenge
              yourself and have fun at the same time.
            </Trans>
          </p>
          <InputGroup
            style={{
              width: 250,
            }}
            className="mb-3"
          >
            <Form.Select
              value={numberOfCards}
              onChange={(event) => {
                setNumberOfCards(Number(event.target.value) as 16 | 36);
              }}
            >
              <option value="16">
                <Trans>16 cards</Trans>
              </option>
              <option value="36">
                <Trans>36 cards</Trans>
              </option>
            </Form.Select>
            <Button variant="primary" type="submit">
              <Trans>Start game</Trans>
            </Button>
          </InputGroup>
        </Col>
        <Col md={5} className="d-none d-lg-block">
          <img
            src="/images/start-page-image.png"
            alt="Memory game is fun!"
            className="img-fluid"
          />
        </Col>
      </Row>
    </Form>
  );
}
