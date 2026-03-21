import {msg} from '@lingui/core/macro';
import {Trans} from '@lingui/react/macro';
import {useState} from 'react';
import {Clock, Person} from 'react-bootstrap-icons';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {useLingui} from '@lingui/react';
import {Row, Col, Button} from 'react-bootstrap';
import api from '@client/ApiClient';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';
import {useToasts} from '@/components/toasts/index.js';
import PageTitle from '@/components/ui/PageTitle.js';
import {useActiveGroup} from '@/context/activeGroupContext.js';

function openInNewTab(url: string) {
  const win = window.open(url, '_blank');
  win?.focus();
}

export default function CreateMemoryGamePage() {
  const {_} = useLingui();
  const toasts = useToasts();
  const {activeGroup} = useActiveGroup();
  const [numberOfCards, setNumberOfCards] = useState<16 | 36>(16);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeGroup) return;

    try {
      const memoryGame = await api.createMemoryGame(
        {
          id: activeGroup.id,
        },
        {
          numberOfCards,
        },
      );
      openInNewTab(`/games/${memoryGame.id}/host`);
    } catch {
      toasts.danger({
        header: _(msg`Oops!`),
        body: _(msg`Something went wrong while creating game`),
      });
    }
  };

  return (
    <Form className="d-flex flex-column gap-3" onSubmit={handleSubmit}>
      <div>
        <PageTitle title={_(msg`Memory Game`)} />
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
              5-10 min
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
              2-20 <Trans>players</Trans>
            </span>
          </div>
        </div>
      </div>
      <Row>
        <Col xs={12} md={7}>
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
        <Col xs={5} className="d-none d-md-block">
          <SimpleLottiePlayer
            autoplay
            loop
            style={{
              marginTop: -120,
            }}
            src="/animations/other/pomppo.json"
          />
        </Col>
      </Row>
    </Form>
  );
}
