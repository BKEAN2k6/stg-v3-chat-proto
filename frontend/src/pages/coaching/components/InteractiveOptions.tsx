import {Button} from 'react-bootstrap';
import {HandThumbsUpFill, HandThumbsDownFill} from 'react-bootstrap-icons';
import type {
  InteractiveMetadata,
  MultipleChoiceOption,
} from '@client/ApiTypes.js';
import './InteractiveOptions.scss';

type InteractiveOptionsProperties = {
  readonly metadata: InteractiveMetadata;
  readonly onSelect: (
    option: {id: string; label: string} | {value: 'up' | 'down'},
  ) => void;
  readonly isDisabled?: boolean;
};

export default function InteractiveOptions({
  metadata,
  onSelect,
  isDisabled = false,
}: InteractiveOptionsProperties) {
  if (metadata.type === 'multiple_choice' && metadata.options) {
    return (
      <div className="d-flex flex-column gap-2 mt-3">
        {metadata.options.map((option: MultipleChoiceOption) => (
          <Button
            key={option.id}
            variant="outline-primary"
            disabled={isDisabled}
            className="text-start"
            onClick={() => {
              onSelect({id: option.id, label: option.label});
            }}
          >
            {option.emoji ? <span className="me-2">{option.emoji}</span> : null}
            {option.label}
          </Button>
        ))}
      </div>
    );
  }

  if (metadata.type === 'thumbs') {
    return (
      <div className="interactive-thumbs d-flex gap-2 mt-3">
        <Button
          variant="outline-success"
          disabled={isDisabled}
          onClick={() => {
            onSelect({value: 'up'});
          }}
        >
          <HandThumbsUpFill size={20} />
        </Button>
        <Button
          variant="outline-danger"
          disabled={isDisabled}
          onClick={() => {
            onSelect({value: 'down'});
          }}
        >
          <HandThumbsDownFill size={20} />
        </Button>
      </div>
    );
  }

  return null;
}
