import {Toast, ToastContainer} from 'react-bootstrap';
import {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import TimeAgo from 'react-timeago';
import {
  type ToastIdType,
  type ToastOptionsWithId,
  type ToastsHandle,
} from './types.js';
import ToastsContext from './toastContext.js';

const Toasts = forwardRef<ToastsHandle>((_, reference) => {
  const [toasts, setToasts] = useState<ToastOptionsWithId[]>([]);

  useImperativeHandle(reference, () => ({
    show(toastOptionsWithId: ToastOptionsWithId) {
      setToasts((state) => {
        const clone = [...state];
        const limit = 10;
        clone.push(toastOptionsWithId);
        if (limit && clone.length > limit) {
          clone.shift();
        }

        return clone;
      });
    },

    hide(id: ToastIdType) {
      setToasts((state) => [...state].filter((t) => t.id !== id));
    },
  }));

  return (
    <ToastContainer position="bottom-end" className="position-fixed">
      {toasts.map((toast) => {
        const {header, date, body, toastProps} = toast;
        return (
          <Toast
            key={toast.id}
            {...toastProps}
            onClose={() => {
              setToasts((toastsState) =>
                toastsState.filter((t) => t.id !== toast.id),
              );
            }}
          >
            <Toast.Header>
              <strong className="me-auto">{header}</strong>
              <small>
                <TimeAgo date={date} />
              </small>
            </Toast.Header>
            <Toast.Body>{body}</Toast.Body>
          </Toast>
        );
      })}
    </ToastContainer>
  );
});

function ToastsProvider({children}: {readonly children: React.JSX.Element}) {
  const toastsReference = useRef<ToastsHandle>(null!);

  return (
    <ToastsContext.Provider value={toastsReference}>
      {children}
      <Toasts ref={toastsReference} />
    </ToastsContext.Provider>
  );
}

export default ToastsProvider;
