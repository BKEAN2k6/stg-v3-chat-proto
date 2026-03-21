/* eslint-disable react/require-default-props */
import clsx from 'clsx';
import React from 'react';
import Form from 'react-bootstrap/Form';

type Props = {
  readonly controlId: string;
  readonly label?: string;
  readonly name?: string;
  readonly autoFocus?: boolean;
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
};

const TextInput = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  Props
>((props, ref) => {
  const {
    controlId,
    label,
    name,
    autoFocus,
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
    maxLength,
  } = props;

  const isTextarea = type === 'textarea';

  return (
    <Form.Group controlId={controlId} className={className} style={style}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control
        // @ts-expect-error tricky for ts to handle as this can be either HTMLInputElement or HTMLTextAreaElement...
        ref={ref}
        autoFocus={autoFocus}
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
      />
      {instructionText && (
        <div
          className={clsx(
            'form-text',
            isValid && 'valid-feedback',
            isInvalid && 'invalid-feedback',
          )}
        >
          {instructionText}
        </div>
      )}
    </Form.Group>
  );
});

export default TextInput;
