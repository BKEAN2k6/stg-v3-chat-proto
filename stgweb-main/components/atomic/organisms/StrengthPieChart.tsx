import {StrengthColorMap, type StrengthSlug} from '@/lib/strength-data';

export type StrengthPieChartItem = [StrengthSlug, number];

type Props = {
  readonly strengths?: StrengthPieChartItem[];
  readonly singleColor?: string;
};

export const StrengthPieChart = ({strengths, singleColor}: Props) => {
  const size = 100; // Always think in terms of a 100x100 box
  const radius = size / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercentage = 0; // Keep track of where to start the next segment

  if (!strengths || singleColor) {
    return (
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        <rect width="100%" height="100%" fill={singleColor ?? '#000'} />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" width="100%" height="100%">
      {strengths.map((strength, index) => {
        const slug = strength[0];
        if (!slug || !StrengthColorMap[slug]) {
          // Log an error here, this shouldn't happen
          return null;
        }

        const percentage = strength[1];
        const color = StrengthColorMap[slug][300];
        const dashArray = `${
          (percentage / 100) * circumference
        } ${circumference}`;
        const dashOffset = (-accumulatedPercentage / 100) * circumference;

        // Update the accumulatedPercentage for the next iteration
        accumulatedPercentage += percentage;

        return (
          <circle
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            cx={radius}
            cy={radius}
            r={radius}
            stroke={color}
            strokeWidth={radius}
            strokeLinecap="butt"
            fill="none"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90, ${radius}, ${radius})`} // Start from the top
          />
        );
      })}
    </svg>
  );
};
