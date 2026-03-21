import React, {useEffect, useRef, useState} from 'react';
import Form from 'react-bootstrap/Form';
import useBreakpoint from '@/hooks/useBreakpoint.js';

type Properties = {
  readonly controlId: string;
  readonly onChange?: (newValue: string) => void;
  readonly className?: string;
  readonly isInvalid?: boolean;
  readonly mode?: 'numeric' | 'alphanumeric';
};

export default function CodeInput(properties: Properties) {
  const breakpoint = useBreakpoint();
  const isXs = breakpoint === 'xs';
  const inputSize = isXs ? 36 : 46;
  const fontSize = isXs ? 18 : 28;
  const borderAllowance = 2;
  const verticalPadding = Math.max(
    (inputSize - fontSize - borderAllowance) / 2,
    0,
  );
  const paddingTop = verticalPadding + (isXs ? 1 : 2);
  const paddingBottom = Math.max(verticalPadding - (isXs ? 1 : 2), 0);
  const {
    controlId,
    onChange,
    isInvalid,
    className,
    mode = 'numeric',
  } = properties;
  const [values, setValues] = useState<string[]>(
    Array.from({length: 6}).fill('') as string[],
  );
  const firstInputReference = useRef<HTMLInputElement>(null);

  const allowedCharacters = mode === 'alphanumeric' ? /^[A-Z\d]$/ : /^\d$/;

  const normalizeCharacter = (value: string): string => {
    const character = (value.at(-1) ?? '').toUpperCase();
    return allowedCharacters.test(character) ? character : '';
  };

  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValues: string[] = [...values];
      const {value} = event.target;

      newValues[index] = normalizeCharacter(value);

      setValues(newValues);
      onChange?.(newValues.join(''));

      if (index < 5 && newValues[index].length === 1) {
        const nextInput: HTMLInputElement = document.querySelector(
          `#${controlId}-${index + 1}`,
        )!;
        nextInput.focus();
      }
    };

  const handlePaste =
    (): React.ClipboardEventHandler<HTMLInputElement> => (event) => {
      event.preventDefault();

      const pastedData = event.clipboardData.getData('text');
      const pasteDataArray = [...pastedData.toUpperCase()]
        .filter((char) => allowedCharacters.test(char))
        .slice(0, 6);

      const newValues: string[] = [...values];

      for (const [i, char] of pasteDataArray.entries()) {
        newValues[i] = char;
      }

      setValues(newValues);
      onChange?.(newValues.join(''));
    };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && values[index] === '' && index > 0) {
        const newValues = values.map((value, index_) =>
          index_ === index - 1 ? '' : value,
        );
        setValues(newValues);
        onChange?.(newValues.join(''));
        const previousInput: HTMLInputElement = document.querySelector(
          `#${controlId}-${index - 1}`,
        )!;
        previousInput.focus();
      }
    };

  useEffect(() => {
    firstInputReference.current?.focus();
  }, []);

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: isXs ? 10 : 12,
        margin: '0 auto',
      }}
    >
      {values.map((value, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <React.Fragment key={`${controlId}-${index}`}>
          <Form.Control
            ref={index === 0 ? firstInputReference : null}
            type={mode === 'numeric' ? 'tel' : 'text'}
            inputMode={mode === 'numeric' ? 'numeric' : 'text'}
            autoCapitalize="characters"
            id={`${controlId}-${index}`}
            value={value}
            maxLength={1}
            isInvalid={isInvalid}
            style={{
              width: inputSize,
              height: inputSize,
              fontSize,
              lineHeight: fontSize,
              boxSizing: 'border-box',
              paddingTop,
              paddingBottom,
              paddingLeft: 0,
              paddingRight: 0,
              display: 'inline-block',
              margin: 0,
              textAlign: 'center',
              textTransform: 'uppercase',
              backgroundImage: 'none',
            }}
            onChange={handleChange(index)}
            onKeyDown={handleKeyDown(index)}
            onPaste={handlePaste()}
          />
          {index === 2 && (
            <span
              aria-hidden="true"
              style={{
                display: 'inline-block',
                minWidth: breakpoint === 'xs' ? 16 : 18,
                textAlign: 'center',
                color: '#6c757d',
              }}
            >
              -
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
