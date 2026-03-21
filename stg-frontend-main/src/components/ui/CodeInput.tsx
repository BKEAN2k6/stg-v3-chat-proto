import React, {useEffect, useRef, useState} from 'react';
import Form from 'react-bootstrap/Form';
import useBreakpoint from '@/hooks/useBreakpoint';

type Props = {
  readonly controlId: string;
  readonly onChange?: (newValue: string) => void;
  readonly className?: string;
  readonly isInvalid?: boolean;
};

export default function CodeInput(props: Props) {
  const breakpoint = useBreakpoint();
  const {controlId, onChange, isInvalid, className} = props;
  const [values, setValues] = useState<string[]>(
    Array.from({length: 6}).fill('') as string[],
  );
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newValues: string[] = [...values];
      const value = event.target.value;

      newValues[index] = value.at(-1) ?? '';

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

      const pastedData = event.clipboardData.getData('text').slice(0, 6);
      if (/^\d+$/.test(pastedData)) {
        const pasteDataArray = pastedData.split('');
        const newValues: string[] = [...values];

        for (const [i, char] of pasteDataArray.entries()) {
          newValues[i] = char;
        }

        setValues(newValues);
        onChange?.(newValues.join(''));
      }
    };

  const handleKeyDown =
    (index: number) => (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Backspace' && values[index] === '' && index > 0) {
        const newValues = values.map((value, idx) =>
          idx === index - 1 ? '' : value,
        );
        setValues(newValues);
        onChange?.(newValues.join(''));
        const previousInput: HTMLInputElement = document.querySelector(
          `#${controlId}-${index - 1}`,
        )!;
        previousInput.focus();
      }
    };

  const renderInputs = (start: number, end: number) => {
    return values.slice(start, end).map((value, index) => (
      <Form.Control
        key={`${controlId}-${start + index}`}
        ref={start + index === 0 ? firstInputRef : null}
        type="tel"
        id={`${controlId}-${start + index}`}
        value={value}
        maxLength={1}
        isInvalid={isInvalid}
        style={{
          width: breakpoint === 'xs' ? 37 : 40,
          height: breakpoint === 'xs' ? 37 : 40,
          fontSize: breakpoint === 'xs' ? 16 : 24,
          display: 'inline-block',
          margin: breakpoint === 'xs' ? '0 0.3rem' : '0 0.5rem',
          textAlign: 'center',
          paddingRight: '0.75rem',
          paddingLeft: '0.60rem',
          paddingBottom: '0.10rem',
          backgroundImage: 'none',
        }}
        onChange={handleChange(start + index)}
        onKeyDown={handleKeyDown(start + index)}
        onPaste={handlePaste()}
      />
    ));
  };

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <div
      className={className}
      style={{width: breakpoint === 'xs' ? 290 : 340, margin: '0 auto'}}
    >
      {renderInputs(0, 6)}
    </div>
  );
}
