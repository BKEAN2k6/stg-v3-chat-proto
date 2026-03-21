import {Card, Button} from 'react-bootstrap';
import {type StrengthSlug} from '@client/ApiTypes';
import {Trans} from '@lingui/react/macro';
import {SimpleLottiePlayer} from '@/components/ui/SimpleLottiePlayer.js';

type Properties = {
  readonly onClick: () => void;
  readonly defaultStrength: StrengthSlug;
  readonly darkerColor: string;
  readonly lighterColor: string;
  readonly borderColor: string;
};

export default function CreateGoalCard({
  onClick,
  defaultStrength,
  darkerColor,
  lighterColor,
  borderColor,
}: Properties) {
  return (
    <Card style={{cursor: 'pointer'}} onClick={onClick}>
      <Card.Header style={{backgroundColor: darkerColor, border: 0}}>
        <div className="fw-bold fs-6">
          <Trans>Create a new goal</Trans>
        </div>
      </Card.Header>
      <Card.Body
        className="d-flex flex-column text-center pt-3 px-3 gap-3"
        style={{backgroundColor: lighterColor}}
      >
        <div
          className="shadow-md"
          style={{
            borderRadius: '50%',
            backgroundColor: darkerColor,
            border: `1px solid ${borderColor}`,
            width: 160,
            height: 160,
            margin: 'auto',
          }}
        >
          <SimpleLottiePlayer
            autoplay
            loop
            src={`/animations/strengths/${defaultStrength}.json`}
          />
        </div>
        <Trans>Develop your groups&apos;s strengths with a new goal.</Trans>
        <Button variant="white">
          <Trans>Create goal</Trans>
        </Button>
      </Card.Body>
    </Card>
  );
}
