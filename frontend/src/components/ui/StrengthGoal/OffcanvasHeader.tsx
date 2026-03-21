import Button from 'react-bootstrap/Button';
import {XLg, DashLg, ChevronRight, ChevronLeft} from 'react-bootstrap-icons';
import {type StrengthSlug} from '@client/ApiTypes';
import {type OffcanvasMode} from './OffcanvasMode.js';
import {strengthColorMap} from '@/helpers/strengths.js';

type Properties = {
  readonly mode: OffcanvasMode;
  readonly setMode: (mode: OffcanvasMode) => void;
  readonly isExpanding: boolean;
  readonly isExpandingDisabled: boolean;
  readonly strength: StrengthSlug;
  readonly title: string;
  readonly closeIcon: 'close' | 'minimize';
};

export default function OffcanvasHeader({
  mode,
  setMode,
  isExpanding,
  isExpandingDisabled,
  strength,
  title,
  closeIcon,
}: Properties) {
  return (
    <div
      className="d-flex justify-content-between align-items-center p-2"
      style={{
        backgroundColor: strengthColorMap[strength][300],
        borderBottom: `1px solid ${strengthColorMap[strength][500]}`,
      }}
    >
      {isExpanding ? (
        <div>
          {isExpandingDisabled ? (
            <div style={{width: 36, height: 36}} />
          ) : (
            <Button
              className="rounded-circle p-0"
              variant="white"
              style={{width: 36, height: 36}}
              onClick={() => {
                setMode(mode === 'small' ? 'expanded' : 'small');
              }}
            >
              {mode === 'small' ? <ChevronLeft /> : <ChevronRight />}
            </Button>
          )}
        </div>
      ) : null}
      <h5 className="px-2 mb-0">{title}</h5>
      <div>
        <Button
          className="rounded-circle p-0"
          variant="white"
          style={{width: 36, height: 36}}
          onClick={() => {
            setMode('closed');
          }}
        >
          {
            {
              close: <XLg />,
              minimize: <DashLg />,
            }[closeIcon]
          }
        </Button>
      </div>
    </div>
  );
}
