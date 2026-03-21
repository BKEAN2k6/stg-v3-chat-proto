import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {Trash, PencilFill, ArrowClockwise} from 'react-bootstrap-icons';
import {Trans} from '@lingui/react/macro';

type Properties = {
  readonly onGoalRemove?: () => void;
  readonly onGoalEdit?: () => void;
  readonly onGoalRedo?: () => void;
};

const renderControl = (
  icon: React.JSX.Element,
  translation: React.JSX.Element,
  action: () => void,
) => (
  <OverlayTrigger overlay={<Tooltip>{translation}</Tooltip>}>
    <Button
      className="rounded-circle p-0"
      variant="white"
      style={{width: 36, height: 36}}
      onClick={(event) => {
        event.stopPropagation();
        action();
      }}
    >
      {icon}
    </Button>
  </OverlayTrigger>
);

export default function GoalControls({
  onGoalRemove,
  onGoalEdit,
  onGoalRedo,
}: Properties) {
  const iconSize = 16;
  return (
    <div className="d-flex justify-content-center align-items-center pb-2 gap-3">
      {onGoalRemove
        ? renderControl(
            <Trash size={iconSize} />,
            <Trans>Remove goal</Trans>,
            onGoalRemove,
          )
        : null}
      {onGoalEdit
        ? renderControl(
            <PencilFill size={iconSize} />,
            <Trans>Edit goal</Trans>,
            onGoalEdit,
          )
        : null}
      {onGoalRedo
        ? renderControl(
            <ArrowClockwise size={iconSize} />,
            <Trans>Redo goal</Trans>,
            onGoalRedo,
          )
        : null}
    </div>
  );
}
