import {Trans} from '@lingui/react/macro';
import clsx from 'clsx';
import type React from 'react';
import Form from 'react-bootstrap/Form';

type Properties = {
  readonly controlId: string;
  readonly label?: string;
  readonly name?: string;
  readonly value?: string;
  readonly options: Array<{value: string; label: string}>;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly isValid?: boolean;
  readonly isInvalid?: boolean;
  readonly isRequired?: boolean;
  readonly instructionText?: string;
  readonly chooseText?: string;
  readonly onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};

function SelectInput({
  controlId,
  label,
  name,
  value,
  options,
  className,
  style,
  isValid,
  isInvalid,
  isRequired,
  instructionText,
  chooseText,
  onChange,
}: Properties) {
  return (
    <Form.Group controlId={controlId} className={className} style={style}>
      {label ? <Form.Label>{label}</Form.Label> : null}
      <Form.Select
        name={name}
        value={value}
        isValid={isValid}
        isInvalid={isInvalid}
        required={isRequired}
        onChange={onChange}
      >
        <option disabled value="">
          {chooseText ?? <Trans>Select an option</Trans>}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      {instructionText ? (
        <div
          className={clsx(
            'form-text',
            isValid && 'valid-feedback',
            isInvalid && 'invalid-feedback',
          )}
        >
          {instructionText}
        </div>
      ) : null}
    </Form.Group>
  );
}

export default SelectInput;
