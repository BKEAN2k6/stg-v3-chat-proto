import {useLingui} from '@lingui/react';
import {type StrengthEntry} from './PlayerResults';
import {strengthColorMap, strengthName} from '@/helpers/strengths';
import {equalDivision} from '@/helpers/utils';

type Props = {
  readonly strengths: StrengthEntry[];
};

export default function StrengthsBar(props: Props) {
  const {i18n} = useLingui();
  const {strengths} = props;

  const counts = strengths.map((strength) => strength.count);
  const percentages = equalDivision(counts);

  return (
    <>
      <div className="mb-2 d-flex flex-row overflow-hidden rounded">
        {strengths.map((entry, index) => (
          <div
            key={`strength-bar-${entry.strength}`}
            className="flex-fill"
            style={{
              width: `${percentages[index]}%`,
              height: 10,
              backgroundColor: strengthColorMap[entry.strength][300],
            }}
          />
        ))}
      </div>
      <div className="d-flex flex-row flex-wrap">
        {strengths.map((entry, index) => (
          <div
            key={`strength-legend-${entry.strength}`}
            className="d-flex align-items-center me-4 mb-2 gap-1"
          >
            <div
              className="rounded-circle"
              style={{
                height: '16px',
                width: '16px',
                backgroundColor: strengthColorMap[entry.strength][300],
              }}
            />
            <small className="ml-2">
              {strengthName(entry.strength, i18n.locale)}{' '}
              {percentages[index].toFixed(1)}%
            </small>
          </div>
        ))}
      </div>
    </>
  );
}
