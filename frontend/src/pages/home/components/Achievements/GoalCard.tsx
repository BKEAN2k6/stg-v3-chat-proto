import {Card} from 'react-bootstrap';
import {type StrengthSlug} from '@client/ApiTypes';
import GoalTrophy from '@/components/ui/StrengthGoal/GoalTrophy.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly title: string;
  readonly strength: StrengthSlug;
  readonly completedCount: number;
};

const size = 180;

export default function GoalCard({
  title,
  strength,
  completedCount,
}: Properties) {
  const darkerColor = strengthColorMap[strength][300];
  const lighterColor = strengthColorMap[strength][100];
  const borderColor = strengthColorMap[strength][500];

  return (
    <Card className="card-w-100 card-w-md-50 card-w-xl-33">
      <Card.Body
        className="text-center py-4"
        style={{backgroundColor: lighterColor}}
      >
        <div className="d-flex flex-column align-items-center gap-3">
          <div style={{width: '100%', maxWidth: size, aspectRatio: '1'}}>
            <div style={{position: 'relative', width: '100%', height: '100%'}}>
              <div
                style={{
                  position: 'absolute',
                  top: '78%',
                  left: '78%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 2,
                }}
              >
                <GoalTrophy
                  completedCount={completedCount}
                  isAnimated={false}
                  size={80}
                />
              </div>
              <img
                className="shadow-md"
                src={`/images/strengths/${strength}.png`}
                alt={strength}
                style={{
                  backgroundColor: darkerColor,
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `8px solid ${borderColor}`,
                }}
              />
            </div>
          </div>
          <div className="fw-bold fs-4">{title}</div>
        </div>
      </Card.Body>
    </Card>
  );
}
