import {useEffect} from 'react';
import {LinkContainer} from 'react-router-bootstrap';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {useTitle} from '@/context/pageTitleContext';

export default function GameListPage() {
  const {setTitle} = useTitle();

  useEffect(() => {
    setTitle('Games');
  }, [setTitle]);

  return (
    <div>
      <Card style={{width: '18rem'}}>
        <Card.Img variant="top" src="/images/cards/sprint.png" />
        <Card.Body>
          <Card.Title>Strength Sprint</Card.Title>
          <Card.Text>
            Practice seeing the good together with the whole class in this short
            sprint filled with strengths.
          </Card.Text>
          <LinkContainer to="/games/sprint">
            <Button className="w-100" variant="primary">
              Start!
            </Button>
          </LinkContainer>
        </Card.Body>
      </Card>
    </div>
  );
}
