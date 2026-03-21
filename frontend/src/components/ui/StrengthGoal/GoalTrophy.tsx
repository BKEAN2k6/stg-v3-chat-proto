import {TrophyFill, ShieldFill} from 'react-bootstrap-icons';
import './GoalTrophy.scss';

type Properties = {
  readonly size: number;
  readonly completedCount: number;
  readonly isAnimated?: boolean;
};

export default function GoalTrophy({
  completedCount,
  size,
  isAnimated = true,
}: Properties) {
  return (
    <div className={isAnimated ? 'dropping-trophy' : 'dropping-trophy-static'}>
      <TrophyFill size={size} color="gold" className="goal-trophy" />
      <ShieldFill className="trophy-shield" size={size / 2.2} color="#fbe98a" />
      <span
        style={{
          fontSize: size / 5,
        }}
        className="goal-trophy-count"
      >
        {completedCount}
      </span>
    </div>
  );
}
