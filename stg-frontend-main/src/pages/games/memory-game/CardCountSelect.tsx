import {Button} from 'react-bootstrap';

type Props = {
  readonly onSelect: (cardCount: number) => void;
};

export default function CardCountSelect(props: Props) {
  const {onSelect} = props;

  return (
    <div className="d-flex justify-content-center">
      <div className="d-flex flex-wrap">
        {[8, 16, 32].map((cardCount) => (
          <div key={cardCount} className="m-2">
            <Button
              className="btn btn-primary"
              onClick={() => {
                onSelect(cardCount);
              }}
            >
              {cardCount} cards
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
