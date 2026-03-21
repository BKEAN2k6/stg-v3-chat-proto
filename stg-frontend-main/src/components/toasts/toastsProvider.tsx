import {Toast, ToastContainer} from 'react-bootstrap';
import {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import TimeAgo from 'react-timeago';
import {
  type ToastIdType,
  type ToastOptionsWithId,
  type ToastsHandle,
} from './types';
import ToastsContext from './toastContext';

const Toasts = forwardRef<ToastsHandle>((_, ref) => {
  const [toasts, setToasts] = useState<ToastOptionsWithId[]>([]);

  useImperativeHandle(ref, () => ({
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

function ToastsProvider({children}: {readonly children: JSX.Element}) {
  const toastsRef = useRef<ToastsHandle>(null);

  return (
    <ToastsContext.Provider value={toastsRef}>
      {children}
      <Toasts ref={toastsRef} />
    </ToastsContext.Provider>
  );
}

export default ToastsProvider;
