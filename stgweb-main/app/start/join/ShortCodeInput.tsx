'use client';
import {type KeyboardEvent, createRef, useEffect} from 'react';

const BACKSPACE_KEY_KEYCODE = 8;
const DELETE_KEY_KEYCODE = 46;

type Props = {
  readonly onCodeChange: (x: string[]) => void;
  readonly shortCode: string[];
};

export const ShortCodeInput = (props: Props) => {
  const {onCodeChange, shortCode} = props;
  const elementsRefs = shortCode.map(() => createRef<HTMLInputElement>());

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (
      event.keyCode === BACKSPACE_KEY_KEYCODE ||
      event.keyCode === DELETE_KEY_KEYCODE
    ) {
      if (elementsRefs[index].current?.value === '' && index > 0) {
        index--;
        elementsRefs[index].current?.focus();
      }

      const newCode = elementsRefs.map((element, idx) =>
        index === idx ? '' : element.current?.value ?? '',
      );

      onCodeChange(newCode);
    } else if (event.keyCode > 47 && event.keyCode < 58) {
      event.preventDefault();

      const newValue = String.fromCodePoint(event.keyCode);
      const newCode = elementsRefs.map((element, idx) =>
        index === idx ? newValue : element.current?.value ?? '',
      );
      onCodeChange(newCode);

      if (index !== elementsRefs.length - 1) {
        elementsRefs[index + 1].current?.focus();
      }
    } else {
      event.preventDefault();
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newCode = elementsRefs.map((element, idx) =>
      index === idx ? event.target.value : element.current?.value ?? '',
    );
    onCodeChange(newCode);
  };

  useEffect(() => {
    elementsRefs[0].current?.focus();
  }, []);

  useEffect(() => {
    const handlePasteAnywhere = (event: ClipboardEvent) => {
      let text = event.clipboardData?.getData('text/plain');
      if (text === undefined) {
        return;
      }

      text = text.replaceAll(/\s/g, '');

      if (!/^\d+$/.test(text)) {
        return;
      }

      if (text.length !== 6) {
        return;
      }

      onCodeChange(text.split(''));
    };

    window.addEventListener('paste', handlePasteAnywhere);

    return () => {
      window.removeEventListener('paste', handlePasteAnywhere);
    };
  }, []);

  return (
    <div id="otp" className="flex flex-row justify-center px-2 text-center">
      {shortCode.map((value, index) => (
        <input
          ref={elementsRefs[index]}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          className="form-control m-1 h-10 w-10 rounded border text-center font-mono text-md sm:h-16 sm:w-16 sm:text-xl lg:h-20 lg:w-20 lg:text-3xl"
          type="tel"
          id={`otp${index}`}
          maxLength={1}
          value={value}
          onKeyDown={(event) => {
            handleKeyDown(event, index);
          }}
          onChange={(event) => {
            handleChange(event, index);
          }}
        />
      ))}
    </div>
  );
};
