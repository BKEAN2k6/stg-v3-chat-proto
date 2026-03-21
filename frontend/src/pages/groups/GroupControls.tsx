import {Dropdown} from 'react-bootstrap';
import {ThreeDots} from 'react-bootstrap-icons';
import {Trans} from '@lingui/react/macro';

type Properties = {
  readonly onGroupEdit: () => void;
};

export default function GroupControls({onGroupEdit}: Properties) {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="link" className="hide-icon">
        <ThreeDots />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onGroupEdit}>
          <Trans>Edit</Trans>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
