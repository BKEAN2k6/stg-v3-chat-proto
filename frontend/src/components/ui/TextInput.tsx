import clsx from 'clsx';
import type React from 'react';
import Form from 'react-bootstrap/Form';

type Properties = {
  readonly controlId: string;
  readonly label?: string;
  readonly name?: string;
  readonly isAutoFocused?: boolean;
  readonly autoComplete?: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly instructionText?: string;
  readonly isValid?: boolean;
  readonly isInvalid?: boolean;
  readonly value?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
  readonly inputStyle?: React.CSSProperties;
  readonly isRequired?: boolean;
  readonly maxLength?: number;
  readonly onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onBlur?: () => void;
};

function TextInput({
  controlId,
  label,
  name,
  isAutoFocused,
  autoComplete,
  type,
  placeholder,
  instructionText,
  value,
  className,
  style,
  inputStyle,
  isValid,
  isInvalid,
  isRequired,
  onChange,
  onBlur,
  maxLength,
}: Properties) {
  const isTextarea = type === 'textarea';

  return (
    <Form.Group controlId={controlId} className={className} style={style}>
      {label ? <Form.Label>{label}</Form.Label> : null}
      <Form.Control
        autoFocus={isAutoFocused}
        required={isRequired}
        name={name}
        autoComplete={autoComplete}
        isValid={isValid}
        isInvalid={isInvalid}
        type={isTextarea ? undefined : type}
        as={isTextarea ? 'textarea' : undefined}
        placeholder={placeholder}
        value={value}
        style={inputStyle}
        maxLength={maxLength}
        onChange={onChange}
        onBlur={onBlur}
      />
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

export default TextInput;
