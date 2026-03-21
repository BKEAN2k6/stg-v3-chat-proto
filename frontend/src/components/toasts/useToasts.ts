import {useContext, useEffect, useMemo, useState} from 'react';
import type {ToastProps} from 'react-bootstrap';
import type {
  ToastIdType,
  ToastOptions,
  ToastOptionsWithId,
  ToastPropertiesOmitBg,
} from './types.js';
import ToastsContext from './toastContext.js';

let toastId: ToastIdType = 0;

const useToasts = () => {
  const [toastOptionsQueue, setToastOptionsQueue] = useState<
    ToastOptionsWithId[]
  >([]);

  const context = useContext(ToastsContext);
  if (context === undefined) {
    throw new Error(
      '`useToasts` must be used inside of a `ToastsProvider`, ' +
        'otherwise it will not function correctly.',
    );
  }

  const api = useMemo(() => {
    const show = (toastOptions: ToastOptions<ToastProps>): ToastIdType => {
      const id = toastId++;
      setToastOptionsQueue((q) => [
        ...q,
        {...toastOptions, date: new Date(), id},
      ]);
      return id;
    };

    const hide = (id: ToastIdType) => {
      context.current?.hide(id);
    };

    const success = (toastOptions: ToastOptions<ToastPropertiesOmitBg>) => {
      const toastProperties = toastOptions.toastProps ?? {};
      const autohide = toastProperties.autohide ?? true;
      toastOptions.toastProps = {
        ...toastProperties,
        autohide,
      };
      return show(_withType(toastOptions, 'success'));
    };

    const danger = (toastOptions: ToastOptions<ToastPropertiesOmitBg>) => {
      return show(_withType(toastOptions, 'danger'));
    };

    const _withType = (
      toastOptions: ToastOptions<ToastPropertiesOmitBg>,
      type: 'success' | 'danger',
    ) => {
      const {toastProps} = toastOptions;
      const toastPropertiesWithBg = {...toastProps, className: `${type}-toast`};
      return {
        ...toastOptions,
        toastProps: toastPropertiesWithBg,
      };
    };

    return {
      show,
      hide,
      success,
      danger,
    };
  }, [context]);

  useEffect(() => {
    const {current} = context;
    if (current !== null && toastOptionsQueue.length > 0) {
      for (const options of toastOptionsQueue) {
        current.show(options);
      }

      setToastOptionsQueue([]);
    }
  }, [context, toastOptionsQueue]);

  return api;
};

export default useToasts;
